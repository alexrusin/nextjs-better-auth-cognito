import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Routes that require authentication
  const protectedRoutes = ["/dashboard", "/tasks"];

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    // Try to get session from auth API
    const session = request.cookies.get("better-auth.session_token");

    // If no session exists, redirect to home page
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // If user is logged in and trying to access home page, redirect to dashboard
  if (pathname === "/") {
    const session = request.cookies.get("better-auth.session_token");

    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/dashboard/:path*", "/tasks", "/tasks/:path*"],
};
