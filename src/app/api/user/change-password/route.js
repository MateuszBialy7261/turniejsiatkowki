import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const token = req.cookies.get("session")?.value;
    if (!token) return NextResponse.json({ error: "Brak tokenu." }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword)
      return NextResponse.json({ error: "Wymagane pola: stare i nowe hasło." }, { status: 400 });

    const { data: user, error } = await supabase
      .from("users")
      .select("password")
      .eq("id", decoded.id)
      .single();

    if (error || !user) return NextResponse.json({ error: "Nie znaleziono użytkownika." }, { status: 404 });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return NextResponse.json({ error: "Nieprawidłowe stare hasło." }, { status: 403 });

    const hashed = await bcrypt.hash(newPassword, 10);
    await supabase.from("users").update({ password: hashed }).eq("id", decoded.id);

    return NextResponse.json({ message: "Hasło zostało zmienione." });
  } catch (err) {
    console.error("❌ /api/user/change-password error:", err);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}
