import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/verify/fail`);
    }

    const { data, error } = await supabase
      .from("users")
      .update({ is_verified: true, verification_token: null })
      .eq("verification_token", token)
      .select("id");

    if (error || !data || data.length === 0) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/verify/fail`);
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/verify/success`);
  } catch (err) {
    console.error("❌ Verify error:", err);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/verify/fail`);
  }
}
