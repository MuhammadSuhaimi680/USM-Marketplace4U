import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 🛡️ SECURE MIDDLEWARE - Route Protection & Security Headers
 * Protects authenticated routes, enforces role-based access, adds security headers
 */
export const middleware = withAuth(
  function middleware(request: NextRequest) {
    const token = request.nextauth.token;
    const pathname = request.nextUrl.pathname;

    // 🔐 Authentication check: Redirect if not authenticated
    if (!token) {
      // Redirect to login for protected routes
      if (pathname.startsWith('/admin') || 
          pathname.startsWith('/my-products') || 
          pathname.startsWith('/products/new')) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // 👤 Role-Based Access Control (RBAC): Only admins can access /admin routes
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // 🛡️ Add security headers to all responses
    const response = NextResponse.next();
    
    // Prevent MIME type sniffing attacks (forces correct content type)
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    // Prevent clickjacking attacks (disallow iframe embedding)
    response.headers.set('X-Frame-Options', 'DENY');
    
    // Enable browser XSS filtering and protection
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    // Enforce HTTPS connections (HSTS - 1 year max-age)
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    // Content Security Policy: Prevent XSS & injection attacks
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
    );
    
    // Control referrer information to prevent leakage
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/my-products/:path*',
    '/products/new/:path*',
  ],
};