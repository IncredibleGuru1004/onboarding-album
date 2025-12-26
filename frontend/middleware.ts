import { NextRequest, NextResponse } from "next/server";

// Check if user is authenticated by looking for auth token in cookies
function isAuthenticated(request: NextRequest): boolean {
  // Check for common authentication cookie names
  const token =
    request.cookies.get("token")?.value ||
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("authToken")?.value ||
    request.cookies.get("jwt")?.value;

  // Also check Authorization header
  const authHeader = request.headers.get("authorization");
  const hasAuthHeader = authHeader && authHeader.startsWith("Bearer ");

  return !!token || !!hasAuthHeader;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // List of public paths that don't require authentication
  const publicPaths = ["/", "/login", "/register", "/forgot-password"];

  // Allow access to public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const authenticated = isAuthenticated(request);

  // If not authenticated, redirect to login
  if (!authenticated) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the original path for redirect-back after login
    loginUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (Next.js internal files)
     * - favicon.ico (favicon file)
     * - Files with extensions (images, fonts, etc.)
     */
    "/((?!api|_next|favicon.ico|.*\\..*).*)",
  ],
};
