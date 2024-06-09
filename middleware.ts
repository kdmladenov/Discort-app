import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

// See https://clerk.com/docs/references/nextjs/auth-middleware
export default authMiddleware({
  async afterAuth(auth, request) {
    // if users are not authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: request.url });
    }

    // If user has signed up, register on Stream backend
    if (auth.userId && !auth.user?.privateMetadata?.streamRegistered) {
      // return redirect('/register');
    } else {
      console.log('[Middleware] User already registered on Stream backend: ', auth.userId);
    }

    return NextResponse.next();
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/(api|trpc)(.*)']
};
