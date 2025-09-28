import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email i hasło są wymagane." },
        { status: 400 }
      );
    }

    // Pobierz użytkownika
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "Nie znaleziono użytkownika." },
        { status: 404 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { error: "Konto nie zostało aktywowane. Sprawdź e-mail." },
        { status: 403 }
      );
    }

    // Sprawdź hasło
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Błędne hasło." },
        { status: 401 }
      );
    }

    // JWT z rolą
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "72h" }
    );

    const response = NextResponse.json({
      ok: true,
      message: "Zalogowano pomyślnie.",
      role: user.role,
    });

    // Cookie httpOnly
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 72, // 72h
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("❌ Login error:", err);
    return NextResponse.json({ error: "Błąd logowania." }, { status: 500 });
  }
}
