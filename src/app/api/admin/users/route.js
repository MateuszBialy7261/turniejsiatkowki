import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";
import { requireAdmin } from "@/lib/adminAuth";
import { sendPasswordEmail } from "@/lib/mailer";

function generatePassword(length = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function GET(req) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  const { data, error } = await supabase
    .from("users")
    .select("id, first_name, last_name, email, role, is_active, created_at")
    .ilike("email", query ? `%${query}%` : "%");

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(req) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { first_name, last_name, email, role, is_active = true } = body;

  if (!email || !role || !first_name || !last_name)
    return NextResponse.json({ error: "Brak wymaganych danych." }, { status: 400 });

  const password = generatePassword();
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([
      { first_name, last_name, email, password: hashedPassword, role, is_active },
    ])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await sendPasswordEmail(email, password, "new", first_name);
  return NextResponse.json({ success: true, message: "Użytkownik dodany i e-mail wysłany." });
}
