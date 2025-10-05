import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";
import { requireAdmin } from "@/lib/adminAuth";
import { sendPasswordEmail } from "@/lib/mailer";

function generatePassword(length = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// PATCH: edycja danych (imię, nazwisko, e-mail, rola, aktywność)
export async function PATCH(req, { params }) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = params.id;
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch = {};
  if ("first_name" in body) patch.first_name = String(body.first_name || "").trim();
  if ("last_name" in body) patch.last_name = String(body.last_name || "").trim();
  if ("email" in body) patch.email = String(body.email || "").trim().toLowerCase();
  if ("role" in body) patch.role = String(body.role || "").trim();
  if ("is_active" in body) patch.is_active = !!body.is_active;

  const { error } = await supabase.from("users").update(patch).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}

// DELETE: usuń użytkownika
export async function DELETE(req, { params }) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = params.id;

  await supabase.from("activation_tokens").delete().eq("user_id", id);
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}

// POST: reset hasła → generuj, haszuj, zapisz, ZWERYFIKUJ, wyślij e-mail
export async function POST(req, { params }) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = params.id;

  const plain = generatePassword();
  const hashed = await bcrypt.hash(plain, 10);

  const { data, error } = await supabase
    .from("users")
    .update({ password: hashed })
    .eq("id", id)
    .select("email, first_name, password")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // 🔎 weryfikacja spójności zanim wyślemy e-mail
  const ok = await bcrypt.compare(plain, data.password);
  if (!ok) {
    return NextResponse.json(
      { error: "Wewnętrzny błąd: zapisane hasło nie przechodzi weryfikacji." },
      { status: 500 }
    );
  }

  await sendPasswordEmail(data.email, plain, "reset", data.first_name);
  return NextResponse.json({ success: true, message: "Hasło zresetowane i wysłane e-mailem." });
}
