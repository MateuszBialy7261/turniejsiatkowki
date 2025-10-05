import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// ✅ GET — pobiera dane konkretnego użytkownika
export async function GET(req, { params }) {
  const { id } = params;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("❌ Błąd pobierania użytkownika:", error);
    return NextResponse.json({ error: "Nie znaleziono użytkownika." }, { status: 404 });
  }

  return NextResponse.json(data);
}

// ✅ PUT — aktualizuje dane użytkownika
export async function PUT(req, { params }) {
  const { id } = params;
  const updates = await req.json();

  const { error } = await supabase.from("users").update(updates).eq("id", id);

  if (error) {
    console.error("❌ Błąd aktualizacji użytkownika:", error);
    return NextResponse.json({ error: "Błąd aktualizacji użytkownika." }, { status: 400 });
  }

  return NextResponse.json({ message: "✅ Dane użytkownika zaktualizowane pomyślnie." });
}
