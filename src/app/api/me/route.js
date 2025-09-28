import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  const token = req.cookies.get("session")?.value;
  console.log("🍪 session token:", token); // debug

  if (!token) {
    return NextResponse.json({ loggedIn: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ decoded JWT:", decoded); // debug

    // Pobierz dane użytkownika z bazy
    const { data: user, error } = await supabase
      .from("users")
      .select("first_name, role")
      .eq("id", decoded.id)
      .single();

    if (error || !user) {
      console.error("❌ User not found:", error);
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
