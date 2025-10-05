// src/app/api/admin/users/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabaseAdmin";

// 📦 Pobranie wszystkich użytkowników
export async function GET() {
  const { data, error } = await supabase
    .from("users")
    .select("id, first_name, last_name, email, role, is_active, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ GET /admin/users:", error);
    return NextResponse.json(
      { error: "Błąd pobierania użytkowników." },
      { status: 500 }
    );
  }

  return NextResponse.json(data || []);
}
