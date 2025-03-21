import { NextRequest, NextResponse } from 'next/server';
const routesBlacklist = ['/dashboard'];

export const middleware = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;

  const cookies = request.headers.get('cookie');

  const isUserLoggedIn = cookies
    ?.split(';')
    .find((c) => c.trim().startsWith('isUserLoggedIn='))
    ?.split('=')[1];

  if (isUserLoggedIn !== 'true') {
    let isRoutesBlacklisted = false;

    routesBlacklist.forEach((route) => {
      isRoutesBlacklisted = pathname.includes(route);
    });

    // TODO IF WE NEED A MESSAGE WE OTHER NEED TO SENT A RESPONSE AND NOTIFY CLIENT OR MAKE A PROTECTED ROUTE
    if (isRoutesBlacklisted) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`
      );
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
  ],
};
