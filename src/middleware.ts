import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (path.startsWith("/api") && !path.startsWith("/api/auth/") && !session) {
    return; /* NextResponse.redirect(new URL("/api/auth/signin", req.url));*/
  } else if (!session && !path.startsWith("/api/auth/")) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  } else if (session && (path === "/api/auth" || path === "/register")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}
