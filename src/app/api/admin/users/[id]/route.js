import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(_req, { params }) {
  const { id } = params;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("❌ GET /admin/users/[id]:", error);
    return NextResponse.json({ error: "Nie znaleziono użytkownika." }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(req, { params }) {
  const { id } = params;
  const payload = await req.json();

  // (opcjonalnie) whitelist pól, które wolno edytować:
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
    return NextResponse.json({ error: "Błąd aktualizacji użytkownika." }, { status: 400 });
  }

  return NextResponse.json({ message: "OK" });
}
