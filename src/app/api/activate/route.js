import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    const origin = new URL(req.url).origin;
    return NextResponse.redirect(`${origin}/verify/fail`);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    const { error } = await supabase
      .from("users")
      .update({ is_active: true })
      .eq("email", email);

    const origin = new URL(req.url).origin;

    if (error) {
      console.error("❌ Activate update error:", error);
      return NextResponse.redirect(`${origin}/verify/fail`);
    }

    return NextResponse.redirect(`${origin}/verify/success`);
  } catch (err) {
    console.error("❌ Activate verify error:", err);
    const origin = new URL(req.url).origin;
    return NextResponse.redirect(`${origin}/verify/fail`);
  }
}
