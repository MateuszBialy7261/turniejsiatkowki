import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Brak tokenu." }, { status: 400 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    const { error } = await supabase.from("users").update({ is_active: true }).eq("email", email);

    if (error) throw error;

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/verify/success`);
  } catch (err) {
    console.error("❌ Błąd aktywacji:", err);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/verify/fail`);
  }
}
