import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";
import { requireAdmin } from "@/lib/adminAuth";
import { sendPasswordEmail } from "@/lib/mailer";

function generatePassword(length = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function PATCH(req, { params }) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { first_name, last_name, email, role, is_active } = body;

  const { error } = await supabase
    .from("users")
    .update({ first_name, last_name, email, role, is_active })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req, { params }) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase.from("users").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}

// 🔹 Reset hasła
export async function POST(req, { params }) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const newPassword = generatePassword();
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const { data, error } = await supabase
    .from("users")
    .update({ password: hashedPassword })
    .eq("id", params.id)
    .select("email, first_name")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await sendPasswordEmail(data.email, newPassword, "reset", data.first_name);
  return NextResponse.json({ success: true, message: "Hasło zresetowane i wysłane e-mailem." });
}
