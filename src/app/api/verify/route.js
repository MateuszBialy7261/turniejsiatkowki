import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return Response.redirect("/verify/fail");
    }

    const { data, error } = await supabase
      .from("users")
      .update({ is_verified: true, verification_token: null })
      .eq("verification_token", token)
      .select("id");

    if (error) {
      console.error("❌ Supabase error:", error);
      return Response.redirect("/verify/fail");
    }

    if (!data || data.length === 0) {
      return Response.redirect("/verify/fail");
    }

    // Sukces → przenosimy na stronę z komunikatem
    return Response.redirect("/verify/success");

  } catch (err) {
    console.error("❌ Verify error:", err);
    return Response.redirect("/verify/fail");
  }
}
