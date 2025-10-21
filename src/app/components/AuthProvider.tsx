"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { UserProfile, AuthContextType } from '@/app/lib/types/user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hasClub, setHasClub] = useState<boolean | null>(null);
  const [clubName, setClubName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Function to ensure profile exists for user
  const ensureProfile = async (user: User) => {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile check timeout')), 10000)
      );

      const profileCheckPromise = supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      const { data: existingProfile, error } = await Promise.race([
        profileCheckPromise,
        timeoutPromise
      ]) as any;

      // If profile doesn't exist (error code PGRST116 = no rows returned)
      if (error && error.code === 'PGRST116') {
        console.log('Profile not found, creating new profile for user:', user.id);
        
        const insertPromise = supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || 
                      user.user_metadata?.name || 
                      user.email?.split('@')[0] || 
                      'Unknown User',
            profile_type: '', // Default to empty - user needs to select role
            club_name: null,
            bio: null,
            major: null,
            interests: null,
          });

        const { error: insertError } = await Promise.race([
          insertPromise,
          timeoutPromise
        ]) as any;

        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          console.log('Profile created successfully');
        }
      } else if (error && error.message !== 'Profile check timeout') {
        console.error('Error checking profile:', error);
      }
    } catch (error) {
      console.error('Error in ensureProfile:', error);
    }
  };

  // Function to fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      );

      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]) as any;

      if (error && error.message !== 'Profile fetch timeout') {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setProfile(null);
    }
  };

  // Function to check if user owns a club
  const checkClubOwnership = async (userId: string) => {
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Club check timeout')), 10000)
      );

      const clubCheckPromise = supabase
        .from('clubs')
        .select('id, name')
        .eq('owner_user_id', userId)
        .single();

      const { data, error } = await Promise.race([
        clubCheckPromise,
        timeoutPromise
      ]) as any;

      if (error && error.code === 'PGRST116') {
        // No club found
        setHasClub(false);
        setClubName(null);
      } else if (error && error.message !== 'Club check timeout') {
        console.error('Error checking club ownership:', error);
        setHasClub(false);
        setClubName(null);
      } else if (data) {
        // Club found
        setHasClub(true);
        setClubName(data.name);
      }
    } catch (error) {
      console.error('Error in checkClubOwnership:', error);
      setHasClub(false);
    }
  };

  useEffect(() => {
    // Get initial session and profile
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Run profile operations but don't let them block loading
          Promise.all([
            ensureProfile(session.user),
            fetchProfile(session.user.id),
            checkClubOwnership(session.user.id)
          ]).catch(error => {
            console.error('Error handling profile:', error);
          });
        } else {
          setHasClub(null);
          setClubName(null);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Don't await these operations to prevent hanging
          Promise.all([
            ensureProfile(session.user),
            fetchProfile(session.user.id),
            checkClubOwnership(session.user.id)
          ]).catch(error => {
            console.error('Error handling profile:', error);
          });
        } else {
          setProfile(null);
          setHasClub(null);
          setClubName(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Function to update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      } else {
        // Refresh profile data
        await fetchProfile(user.id);
      }
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/role`
      }
    });
  };

  // Function to refresh club status (useful after club creation)
  const refreshClubStatus = async () => {
    if (user) {
      await checkClubOwnership(user.id);
    }
  };

  const value = {
    user,
    profile,
    hasClub,
    clubName,
    loading,
    signOut,
    signInWithGoogle,
    updateProfile,
    refreshClubStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
