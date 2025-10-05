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
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  let query = supabase
    .from("users")
    .select("id, first_name, last_name, email, role, is_active, created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(
      `first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%`
    );
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

export async function POST(req) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const first_name = String(body?.first_name || "").trim();
  const last_name = String(body?.last_name || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const role = String(body?.role || "sedzia").trim();
  const is_active = body?.is_active !== undefined ? !!body.is_active : true;

  if (!first_name || !last_name || !email) {
    return NextResponse.json({ error: "Wymagane: imię, nazwisko, e-mail." }, { status: 400 });
  }

  const plain = generatePassword();
  const hashed = await bcrypt.hash(plain, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([{ first_name, last_name, email, password: hashed, role, is_active }])
    .select("id, email, first_name, password")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Użytkownik o tym e-mailu już istnieje." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // 🔎 weryfikacja, że zapisany hash odpowiada plain
  const ok = await bcrypt.compare(plain, data.password);
  if (!ok) {
    return NextResponse.json(
      { error: "Wewnętrzny błąd: zapisane hasło nie przechodzi weryfikacji." },
      { status: 500 }
    );
  }

  await sendPasswordEmail(email, plain, "new", first_name);
  return NextResponse.json({ success: true, message: "Użytkownik dodany i e-mail wysłany." });
}
