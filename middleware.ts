import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isSimplifiedMode } from './lib/config/simplified';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const simplified = isSimplifiedMode();

  // Protect admin routes (except login)
  if (!simplified && pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminToken = request.cookies.get('admin_token')?.value;

    if (!adminToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect logged-in admins away from login page
  if (!simplified && pathname === '/admin/login') {
    const adminToken = request.cookies.get('admin_token')?.value;
    if (adminToken) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
