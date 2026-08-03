import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtUtils } from "./utils/jwt";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/", "/services", "/technicians"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let decoded = token ? jwtUtils.verifyToken(token) : null;

  let userRole: string | null = null;

  if (decoded?.success && decoded.data) {
    const payload = decoded.data as any;
    userRole = payload.role ? payload.role.toUpperCase() : null;
  }

  // Logged in user trying to access login/register → redirect to their dashboard
  if (token && decoded?.success && AUTH_ROUTES.includes(pathname)) {
    if (userRole === "CUSTOMER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (userRole === "TECHNICIAN") {
      return NextResponse.redirect(new URL("/technician-dashboard", request.url));
    } else if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  const isPublicRoute =
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    ) || AUTH_ROUTES.includes(pathname);

  // Not logged in and trying to access private route → redirect to login
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control & intelligent redirection
  if (pathname.startsWith("/dashboard")) {
    if (userRole === "TECHNICIAN") {
      return NextResponse.redirect(new URL("/technician-dashboard", request.url));
    }
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    }
  }

  if (pathname.startsWith("/technician-dashboard") && userRole !== "TECHNICIAN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
