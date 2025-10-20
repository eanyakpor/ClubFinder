/*
  Secure server-side utilities that don't expose Supabase client to browser
  
  SECURITY NOTE: This approach keeps Supabase operations on the server side only.
  The client-side code should use server actions instead of direct Supabase calls.
*/

import { createClient } from '@supabase/supabase-js'

// Server-only Supabase client - never exposed to browser
function createSecureSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

export async function validateUserSession(accessToken: string) {
  const supabase = createSecureSupabaseClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return null
    }
    
    // Return the full user object to maintain type compatibility
    return user
  } catch (error) {
    console.error('Error validating user session:', error)
    return null
  }
}
