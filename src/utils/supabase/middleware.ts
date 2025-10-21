import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Basic authentication check
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    request.nextUrl.pathname !== '/'
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Protect onboarding and discord integration routes
  if (user && (
    request.nextUrl.pathname.startsWith('/onboarding') ||
    request.nextUrl.pathname === '/role'
  )) {
    try {
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('profile_type')
        .eq('id', user.id)
        .single()

      // If user is a student, redirect them away from onboarding
      if (profile?.profile_type === 'student') {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }

      // For club users, check if they need specific onboarding steps
      if (profile?.profile_type === 'club') {
        // Get club data to check completion status
        const { data: club } = await supabase
          .from('clubs')
          .select('name, email')
          .eq('owner_user_id', user.id)
          .single()

        // If accessing /onboarding/discord but club info is incomplete, redirect to club onboarding
        if (request.nextUrl.pathname === '/onboarding/discord' && (!club?.name || !club?.email)) {
          const url = request.nextUrl.clone()
          url.pathname = '/onboarding/club'
          return NextResponse.redirect(url)
        }

        // If accessing /onboarding/club but club is already complete, redirect to home
        if (request.nextUrl.pathname === '/onboarding/club' && club?.name && club?.email) {
          const url = request.nextUrl.clone()
          url.pathname = '/'
          return NextResponse.redirect(url)
        }

        // If accessing /role but profile_type is already set, redirect to home
        if (request.nextUrl.pathname === '/role') {
          const url = request.nextUrl.clone()
          url.pathname = '/'
          return NextResponse.redirect(url)
        }
      }

      // If profile_type is empty and not on /role, redirect to role selection
      if (!profile?.profile_type && request.nextUrl.pathname !== '/role') {
        const url = request.nextUrl.clone()
        url.pathname = '/role'
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error('Error checking profile in middleware:', error)
      // On error, allow access but log the issue
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}