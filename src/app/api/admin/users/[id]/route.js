import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { requireAdmin } from "@/lib/adminAuth";
import bcrypt from "bcryptjs";

/**
 * GET /api/admin/users/:id
 */
export async function GET(req, { params }) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;
  const { data, error } = await supabase.from("users").select("*").eq("id", id).single();
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ user: data });
}

/**
 * PATCH /api/admin/users/:id
 * Body: dowolne pola z tabeli users (jeśli password podasz, będzie zhashowane)
 */
export async function PATCH(req, { params }) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const update = { ...body };
  if ("password" in update) {
    if (!update.password) {
      delete update.password;
    } else {
      update.password = await bcrypt.hash(String(update.password), 10);
    }
  }

  const { data, error } = await supabase
    .from("users")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Update failed" },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, user: data });
}

/**
 * DELETE /api/admin/users/:id
 */
export async function DELETE(req, { params }) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;

  // (opcjonalnie) usuń powiązane tokeny aktywacyjne
  await supabase.from("activation_tokens").delete().eq("user_id", id);

  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
