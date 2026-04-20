import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  let cookies = request.cookies.get('accessToken');

  if (cookies && (request.nextUrl.pathname.startsWith('/signup') || request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!cookies && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/logs'))){
    return NextResponse.redirect(new URL('/login', request.url));
  }  
}

export const config = {
  matcher: [
    '/signup/:path*',
    '/login/:path*',
    '/dashboard/:path*',
    '/logs/:path*',
    '/',
  ],
}