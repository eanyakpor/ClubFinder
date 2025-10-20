/*
  Minimal client-side Supabase setup for auth state changes only
  
  SECURITY: This client is configured to ONLY handle auth state changes.
  All data operations should use server actions instead.
*/

import { createClient } from '@supabase/supabase-js'

// Create a minimal client that can only handle auth state changes
export function createMinimalSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Enable auth state tracking
        autoRefreshToken: true,
        persistSession: true,
        // Store tokens in cookies for server-side access
        storage: {
          getItem: (key: string) => {
            if (typeof window === 'undefined') return null
            return document.cookie
              .split('; ')
              .find(row => row.startsWith(`${key}=`))
              ?.split('=')[1] || null
          },
          setItem: (key: string, value: string) => {
            if (typeof window === 'undefined') return
            document.cookie = `${key}=${value}; path=/; secure; samesite=strict`
          },
          removeItem: (key: string) => {
            if (typeof window === 'undefined') return
            document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
          },
        },
      },
      // Disable all database operations on client side
      db: {
        schema: 'public',
      },
    }
  )
}

// Export only auth-related functions
export function getAuthStateListener() {
  const supabase = createMinimalSupabaseClient()
  return {
    onAuthStateChange: supabase.auth.onAuthStateChange.bind(supabase.auth),
    getSession: supabase.auth.getSession.bind(supabase.auth),
  }
}
