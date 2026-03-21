import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/superadmin') && !request.nextUrl.pathname.startsWith('/superadmin/login')) {
    const authCookie = request.cookies.get('superadmin_auth');
    if (!authCookie || authCookie.value !== 'true') {
      const url = request.nextUrl.clone();
      url.pathname = '/superadmin/login';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/superadmin/:path*'],
}
