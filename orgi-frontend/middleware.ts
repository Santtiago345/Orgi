import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  const authPaths = ["/login", "/register"];
  const protectedPaths = ["/dashboard", "/transactions", "/accounts", "/cards", "/debts", "/budgets", "/pdf", "/reports"];

  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*", "/transactions/:path*", "/accounts/:path*", "/cards/:path*", "/debts/:path*", "/budgets/:path*", "/pdf/:path*", "/reports/:path*"],
};
