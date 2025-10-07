import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const organizerId = searchParams.get("organizer");

    if (!organizerId) {
      return NextResponse.json({ error: "Brak ID organizatora." }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("tournaments")
      .select("id, name, location, date_start, date_end, status")
      .eq("organizer_id", organizerId)
      .order("date_start", { ascending: true });

    if (error) {
      console.error("❌ Błąd Supabase:", error);
      return NextResponse.json({ error: "Nie udało się pobrać turniejów." }, { status: 500 });
    }

    return NextResponse.json({ tournaments: data || [] });
  } catch (err) {
    console.error("❌ Błąd serwera:", err);
    return NextResponse.json({ error: "Błąd serwera podczas pobierania listy." }, { status: 500 });
  }
}
