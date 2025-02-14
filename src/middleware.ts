import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const isPublicRoute = createRouteMatcher(['/onboarding(.*)', '/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, request) => {
  // Skip middleware for service worker
  if (request.nextUrl.pathname === '/sw.js') {
    return NextResponse.next();
  }

  if (!isPublicRoute(request)) {
    // Protect non-public routes
    await auth.protect();
  }

  const { userId } = await auth()
  
  // Check onboarding status for authenticated users
  if (userId && !request.nextUrl.pathname.startsWith('/onboarding')) {
    const { data: user } = await supabase
      .from('users')
      .select('interests')
      .eq('id', userId)
      .single();

    if (!user?.interests?.length || user.interests.length < 5) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  return NextResponse.next();
})

// Update matcher pattern to match Clerk's requirements
export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)', 
    '/',
    '/(api|trpc)(.*)',
    '/sw.js'  // Add service worker to matcher
  ]
};