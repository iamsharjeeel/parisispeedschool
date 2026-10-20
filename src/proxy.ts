import { NextRequest, NextResponse } from 'next/server';
import { siteIsPublic } from '@/lib/config';

export function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const dev = process.env.NODE_ENV === 'development';
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://assets.cdn.filesafe.space https://www.google-analytics.com https://www.googletagmanager.com https://www.googleadservices.com https://www.google.com https://googleads.g.doubleclick.net",
    "font-src 'self'",
    `connect-src 'self' https://*.google-analytics.com https://www.googletagmanager.com https://www.googleadservices.com https://www.google.com https://googleads.g.doubleclick.net https://paged2.googlesyndication.com${dev ? ' ws: wss:' : ''}`,
    'frame-src https://www.googletagmanager.com https://www.google.com',
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(process.env.VERCEL_ENV === 'production'
      ? ['upgrade-insecure-requests']
      : []),
  ].join('; ');
  const headers = new Headers(request.headers);
  headers.set('x-nonce', nonce);
  headers.set('Content-Security-Policy', csp);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set('Content-Security-Policy', csp);
  if (!siteIsPublic())
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|media|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
