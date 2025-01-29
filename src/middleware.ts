import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const isPublicRoute = createRouteMatcher(['/onboarding', '/sign-in', '/sign-up'])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && !isPublicRoute(req)) {
    const signInUrl = new URL('/sign-in', req.url)
    return NextResponse.redirect(signInUrl)
  }

  // If user is signed in, check if they've completed onboarding
  if (userId) {
    // Skip check if already on onboarding page
    if (req.nextUrl.pathname === '/onboarding') {
      return NextResponse.next()
    }

    // Check if user has completed onboarding
    const { data: user } = await supabase
      .from('users')
      .select('interests')
      .eq('id', userId)
      .single()

    // If no user record or no interests, redirect to onboarding
    if (!user || !user.interests || user.interests.length < 5) {
      const onboardingUrl = new URL('/onboarding', req.url)
      return NextResponse.redirect(onboardingUrl)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}