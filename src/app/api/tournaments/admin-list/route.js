import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const adminId = searchParams.get("adminId"); // opcjonalne filtrowanie

    let query = supabaseServer
      .from("tournaments")
      .select("id, name, category, location, date_start, date_end, start_time, status, organizer_id")
      .order("date_start", { ascending: true });

    if (adminId) query = query.eq("organizer_id", adminId);

    const { data, error } = await query;

    if (error) {
      console.error("❌ Błąd Supabase:", error);
      return NextResponse.json({ error: "Nie udało się pobrać listy turniejów." }, { status: 500 });
    }

    return NextResponse.json({ tournaments: data || [] });
  } catch (err) {
    console.error("❌ Błąd serwera:", err);
    return NextResponse.json({ error: "Błąd serwera podczas pobierania turniejów." }, { status: 500 });
  }
}
