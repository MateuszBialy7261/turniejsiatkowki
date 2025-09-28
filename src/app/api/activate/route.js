import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Brak tokena" }, { status: 400 });
  }

  const { data: tokenData, error } = await supabase
    .from("activation_tokens")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !tokenData) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/activated?status=error`
    );
  }

  await supabase.from("users").update({ is_active: true }).eq("id", tokenData.user_id);
  await supabase.from("activation_tokens").delete().eq("id", tokenData.id);

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_SITE_URL}/activated?status=success`
  );
}
