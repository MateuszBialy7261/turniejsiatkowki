import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  const token = req.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Pobierz dane użytkownika (dodane pole credits)
    const { data: user, error } = await supabase
      .from("users")
      .select("id, first_name, role, email, credits, is_active")
      .eq("id", decoded.id)
      .single();

    if (error || !user) {
      console.error("❌ User not found:", error);
      return NextResponse.json({ loggedIn: false }, { status: 404 });
    }

    // Zwracamy pełne dane
    return NextResponse.json({
      loggedIn: true,
      id: user.id,
      first_name: user.first_name,
      role: user.role,
      email: user.email,
      credits: user.credits ?? 0,
      is_active: user.is_active,
    });
  } catch (err) {
    console.error("❌ JWT verify error:", err);
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }
}
