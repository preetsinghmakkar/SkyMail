import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Dashboard routes that require authentication
  if (pathname.startsWith("/dashboard")) {
    // Check for access token in cookies
    const accessTokenCookie = request.cookies.get("access_token")?.value;

    if (!accessTokenCookie) {
      // Redirect to login if no access token found in cookies
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith("/auth/")) {
    const accessTokenCookie = request.cookies.get("access_token")?.value;

    if (accessTokenCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Redirect root to dashboard if authenticated
  if (pathname === "/") {
    const accessTokenCookie = request.cookies.get("access_token")?.value;

    if (accessTokenCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/:path*"],
};
