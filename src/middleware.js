import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Ścieżki chronione
const protectedPaths = [
  "/dashboard/sedzia",
  "/dashboard/organizator",
  "/dashboard/admin",
];

async function verifyJWT(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload; // { id, email, role, iat, exp }
  } catch (err) {
    console.error("❌ Edge JWT verify error:", err);
    return null;
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Jeśli to nie jest ścieżka chroniona -> przepuść
  if (!protectedPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;

  // Brak sesji -> logowanie
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Weryfikacja tokena na Edge (jose)
  const decoded = await verifyJWT(token);
  if (!decoded) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Autoryzacja per rola
  if (pathname.startsWith("/dashboard/sedzia") && decoded.role !== "sedzia") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (
    pathname.startsWith("/dashboard/organizator") &&
    decoded.role !== "organizator"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/dashboard/admin") && decoded.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Middleware tylko dla /dashboard/*
export const config = {
  matcher: ["/dashboard/:path*"],
};
