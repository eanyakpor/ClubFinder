/*
  Supabase client setup for browser environment
*/

import { createClient } from '@supabase/supabase-js'

// Create a singleton instance
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    supabaseInstance = createClient(url, anon);
  }
  return supabaseInstance;
}