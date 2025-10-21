// User types and schemas for ClubFinder application
import { User as SupabaseUser } from '@supabase/supabase-js';

// User profile from database
export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  profile_type: '' | 'student' | 'club';
  club_name: string | null;
  bio: string | null;
  major: string | null;
  interests: string[] | null;
  created_at: string;
  updated_at: string;
}

// Combined user type (auth + profile)
export interface AppUser extends SupabaseUser {
  profile?: UserProfile;
}

// Auth context type
export interface AuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  hasClub: boolean | null; // null = loading, true = has club, false = no club
  clubName: string | null; // actual club name from clubs table
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshClubStatus: () => Promise<void>;
}

// Helper functions for profile_type
export const isClub = (profile: UserProfile | null): boolean => {
  return profile?.profile_type === 'club';
};

export const isStudent = (profile: UserProfile | null): boolean => {
  return profile?.profile_type === 'student';
};

export const hasSelectedRole = (profile: UserProfile | null): boolean => {
  return profile?.profile_type !== '' && profile?.profile_type !== undefined;
};

export const needsRoleSelection = (profile: UserProfile | null): boolean => {
  return profile?.profile_type === '';
};

export const needsClubOnboarding = (profile: UserProfile | null, hasClub: boolean | null): boolean => {
  return profile?.profile_type === 'club' && hasClub === false;
};

export const getProfileTypeLabel = (profile: UserProfile | null): string => {
  switch (profile?.profile_type) {
    case 'club':
      return 'Club';
    case 'student':
      return 'Student';
    case '':
      return 'Role Not Selected';
    default:
      return 'User';
  }
};
