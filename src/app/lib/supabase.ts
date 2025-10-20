/*
  Supabase client setup for browser environment
*/

import { createClient } from '@supabase/supabase-js'
    
    export function getSupabaseClient() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      return createClient(url, anon);
    }