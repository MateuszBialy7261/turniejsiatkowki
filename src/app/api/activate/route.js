import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Brak tokena." }, { status: 400 });
  }

  try {
    // ✅ weryfikacja JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    if (!email) {
      return NextResponse.json({ error: "Niepoprawny token." }, { status: 400 });
    }

    // ✅ pobierz użytkownika po e-mailu
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      console.error("❌ Błąd Supabase:", error);
      return NextResponse.json({ error: "Nie znaleziono użytkownika." }, { status: 404 });
    }

    if (user.is_active) {
      return NextResponse.json(
        { error: "Konto zostało już aktywowane." },
        { status: 400 }
      );
    }

    // ✅ aktywacja konta
    const { error: updateError } = await supabase
      .from("users")
      .update({ is_active: true })
      .eq("email", email);

    if (updateError) {
      console.error("❌ Błąd aktualizacji:", updateError);
      return NextResponse.json({ error: "Nie udało się aktywować konta." }, { status: 500 });
    }

    // ✅ przekierowanie do logowania
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/login?activated=1`);
  } catch (err) {
    console.error("❌ JWT verify error:", err);
    return NextResponse.json(
      { error: "Token weryfikacyjny jest nieprawidłowy lub wygasł." },
      { status: 400 }
    );
  }
}
