// src/app/api/admin/users/[id]/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabaseAdmin";

// 🔹 Pobierz konkretnego użytkownika
export async function GET(_req, { params }) {
  const { id } = params;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("❌ GET /admin/users/[id]:", error);
    return NextResponse.json(
      { error: "Nie znaleziono użytkownika." },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

// 🔹 Aktualizuj użytkownika
export async function PUT(req, { params }) {
  const { id } = params;
  const payload = await req.json();

  // Dozwolone pola
  const allowed = [
    "first_name",
    "last_name",
    "email",
    "phone",
    "address",
    "club_name",
    "nip",
    "age",
    "license",
    "role",
    "is_active",
  ];
  const updates = {};
  for (const k of allowed) {
    if (k in payload) updates[k] = payload[k];
  }

  const { error } = await supabase.from("users").update(updates).eq("id", id);

  if (error) {
    console.error("❌ PUT /admin/users/[id]:", error);
    return NextResponse.json(
      { error: "Błąd aktualizacji użytkownika." },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: "OK" });
}

// 🔹 Usuń użytkownika
export async function DELETE(_req, { params }) {
  const { id } = params;

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) {
    console.error("❌ DELETE /admin/users/[id]:", error);
    return NextResponse.json(
      { error: "Błąd usuwania użytkownika." },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: "Użytkownik usunięty." });
}
