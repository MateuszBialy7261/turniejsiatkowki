import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Ścieżki chronione
const protectedPaths = ["/dashboard/sedzia", "/dashboard/organizator", "/dashboard/admin"];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Jeśli ścieżka nie jest chroniona → przepuść
  if (!protectedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;

  // Brak tokena → redirect do logowania
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔒 Sprawdź role vs ścieżkę
    if (pathname.startsWith("/dashboard/sedzia") && decoded.role !== "sedzia") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname.startsWith("/dashboard/organizator") && decoded.role !== "organizator") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname.startsWith("/dashboard/admin") && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("❌ Middleware JWT error:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Middleware tylko dla /dashboard/*
export const config = {
  matcher: ["/dashboard/:path*"],
};
