// User types and schemas for ClubFinder application
import { User as SupabaseUser } from '@supabase/supabase-js';

// User profile from database
export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  is_club: boolean;
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
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}
