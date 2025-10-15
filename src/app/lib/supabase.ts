import { createClient } from '@supabase/supabase-js'

export const supabaseBrowser = () =>
    createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
    
    export function getSupabaseClient() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      return createClient(url, anon);
    }