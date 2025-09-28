import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email i hasło są wymagane." }, { status: 400 });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "Nie znaleziono użytkownika. Załóż konto." }, { status: 404 });
    }

    if (!user.is_active) {
      return NextResponse.json({ error: "Konto nie zostało aktywowane. Sprawdź e-mail." }, { status: 403 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Błędne hasło." }, { status: 401 });
    }

    return NextResponse.json({ ok: true, message: "Zalogowano pomyślnie." });
  } catch (err) {
    console.error("❌ Login error:", err);
    return NextResponse.json({ error: "Błąd logowania." }, { status: 500 });
  }
}
