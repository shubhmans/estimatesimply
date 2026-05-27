import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  const path = request.nextUrl.pathname;

  // Protected paths
  const isProtectedPath = path.startsWith('/generate') || 
                          path.startsWith('/projects') || 
                          path.startsWith('/history');

  // Auth paths
  const isAuthPath = path.startsWith('/auth');

  if (isProtectedPath && !token) {
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/generate', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/generate/:path*',
    '/projects/:path*',
    '/history/:path*',
    '/auth/:path*',
  ],
};
