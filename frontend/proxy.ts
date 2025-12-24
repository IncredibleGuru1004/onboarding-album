// proxy.ts (or src/proxy.ts)
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // List of public paths (exact match, no trailing slash issues)
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/dashboard",
  ];

  if (publicPaths.includes(pathname)) {
    return NextResponse.next(); // Allow access
  }

  // Redirect everything else to /login
  // Optional: Preserve the original path for redirect-back after login
  const loginUrl = new URL("/login", request.url);
  // loginUrl.searchParams.set('redirect', pathname + request.nextUrl.search);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    // Match all paths except:
    // - /api routes
    // - /_next (static files, images, etc.)
    // - favicon, robots.txt, etc.
    // - But DO include /login to allow direct access
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
