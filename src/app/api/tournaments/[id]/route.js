import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import jwt from "jsonwebtoken";

// ✅ GET — pobranie danych turnieju
export async function GET(req, { params }) {
  const { id } = params;

  const { data, error } = await supabaseServer
    .from("tournaments")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Nie znaleziono turnieju" }, { status: 404 });
  }

  return NextResponse.json(data);
}

// ✅ PUT — aktualizacja danych turnieju
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const token = req.cookies.get("session")?.value;

  if (!token) return NextResponse.json({ error: "Brak sesji" }, { status: 401 });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return NextResponse.json({ error: "Nieprawidłowy token" }, { status: 401 });
  }

  // sprawdzamy czy user jest adminem lub właścicielem turnieju
  const { data: tournament } = await supabaseServer
    .from("tournaments")
    .select("organizer_id")
    .eq("id", id)
    .single();

  if (!tournament)
    return NextResponse.json({ error: "Nie znaleziono turnieju" }, { status: 404 });

  const isAdmin = decoded.role === "admin";
  const isOwner = decoded.id === tournament.organizer_id;

  if (!isAdmin && !isOwner)
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });

  // Zapis zmian
  const { data, error } = await supabaseServer
    .from("tournaments")
    .update({
      ...body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("❌ Błąd aktualizacji:", error);
    return NextResponse.json({ error: "Nie udało się zapisać zmian" }, { status: 500 });
  }

  return NextResponse.json({ success: true, tournament: data });
}
