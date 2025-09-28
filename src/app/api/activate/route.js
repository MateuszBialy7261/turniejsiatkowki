import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/activated?status=error`
      );
    }

    // Sprawdź token
    const { data: tokenData, error: tokenError } = await supabase
      .from("activation_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/activated?status=error`
      );
    }

    // Aktywacja konta
    const { error: updateError } = await supabase
      .from("users")
      .update({ is_active: true })
      .eq("id", tokenData.user_id);

    if (updateError) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/activated?status=error`
      );
    }

    // Usuń token
    await supabase.from("activation_tokens").delete().eq("id", tokenData.id);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/activated?status=success`
    );
  } catch (err) {
    console.error("❌ Activation error:", err);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/activated?status=error`
    );
  }
}
