import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing, type Locale } from "./i18n/routing";

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

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  // First, handle internationalization
  const response = intlMiddleware(request);

  // If intl middleware returns a redirect, return it immediately
  if (response.status === 307 || response.status === 308) {
    return response;
  }

  // Get the pathname (intl middleware should have already processed it)
  const pathname = request.nextUrl.pathname;

  // Extract locale from pathname (e.g., /en/..., /fr/...)
  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // Get the pathname without locale for auth checks
  let pathnameWithoutLocale = pathname;
  let locale: string = routing.defaultLocale;

  if (pathnameHasLocale) {
    const extractedLocale = pathname.split("/")[1];
    if (routing.locales.includes(extractedLocale as Locale)) {
      locale = extractedLocale;
      pathnameWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    }
  }

  // List of public paths that don't require authentication
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/auth/callback",
    "/verify-email",
  ];

  // Allow access to public paths
  if (publicPaths.includes(pathnameWithoutLocale)) {
    return response;
  }

  // Check if user is authenticated
  // All non-public paths require authentication (including /dashboard, /profile, etc.)
  const authenticated = isAuthenticated(request);

  // If not authenticated and trying to access a non-public path, redirect to login
  // This ensures paths like /dashboard, /profile, etc. require authentication
  if (!authenticated) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    // Preserve the original path for redirect-back after login
    loginUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated, return the i18n response
  return response;
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
