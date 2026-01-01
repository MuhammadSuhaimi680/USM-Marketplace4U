// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Add route protection logic here
  // Check auth tokens, redirect unauthorized users, etc.
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/my-products/:path*',
    '/products/new/:path*',
  ],
};