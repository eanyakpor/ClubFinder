"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import NavBar from "./NavBar/NavBar";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser } from "../lib/auth-actions";
import { getAuthStateListener } from "../lib/supabase-client-minimal";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser?: User | null;
}

export default function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authListener = getAuthStateListener();
    
    // Get initial session if no initial user provided
    if (!initialUser) {
      authListener.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });
    }

    // Listen for auth state changes
    const { data: { subscription } } = authListener.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [initialUser]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      <NavBar user={user} />
      {children}
    </AuthContext.Provider>
  );
}
