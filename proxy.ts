import { NextResponse, type NextRequest } from 'next/server';
import { getPreferredLocale, hasLocale } from '@/lib/i18n/config';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);

  if (pathname === '/') {
    const locale = getPreferredLocale(request.headers.get('accept-language'));
    requestHeaders.set('x-current-locale', locale);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const pathSegments = pathname.split('/').filter(Boolean);
  const pathnameLocale = pathSegments[0];
  const pathnameHasLocale = Boolean(pathnameLocale && hasLocale(pathnameLocale));

  if (pathnameHasLocale) {
    requestHeaders.set('x-current-locale', pathnameLocale);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const locale = getPreferredLocale(request.headers.get('accept-language'));
  requestHeaders.set('x-current-locale', locale);
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${locale}${pathname}`;

  const response = NextResponse.redirect(redirectUrl);
  response.headers.set('x-current-locale', locale);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
