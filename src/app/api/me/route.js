import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  const token = req.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.json({ loggedIn: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Pobierz dane użytkownika z bazy
    const { data: user } = await supabase
      .from("users")
      .select("first_name, role")
      .eq("id", decoded.id)
      .single();

    if (!user) {
      return NextResponse.json({ loggedIn: false });
    }

    return NextResponse.json({
      loggedIn: true,
      firstName: user.first_name,
      role: user.role,
    });
  } catch (err) {
    console.error("❌ JWT verify error:", err);
    return NextResponse.json({ loggedIn: false });
  }
}
