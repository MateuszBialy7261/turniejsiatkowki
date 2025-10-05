import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { requireAdmin } from "@/lib/adminAuth";
import bcrypt from "bcryptjs";

/**
 * GET /api/admin/users?q=...&limit=...&offset=...
 * Zwraca listę użytkowników (proste filtrowanie po imieniu, nazwisku, emailu).
 */
export async function GET(req) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const limit = Number(searchParams.get("limit") || 50);
  const offset = Number(searchParams.get("offset") || 0);

  let query = supabase
    .from("users")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (q) {
    query = query.or(
      `first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%`
    );
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ items: data, count });
}

/**
 * POST /api/admin/users
 * Body: { first_name, last_name, email, password, role, is_active, phone, age, club_name, nip, address, license }
 */
export async function POST(req) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      first_name,
      last_name,
      email,
      password,
      role = "sedzia",
      is_active = true,
      phone = null,
      age = null,
      club_name = null,
      nip = null,
      address = null,
      license = false,
    } = body;

    if (!first_name || !last_name || !email || !password) {
      return NextResponse.json(
        { error: "Wymagane: first_name, last_name, email, password." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          first_name,
          last_name,
          email,
          password: hashed,
          role,
          is_active,
          phone,
          age,
          club_name,
          nip,
          address,
          license,
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Użytkownik o tym e-mailu już istnieje." },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, user: data });
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
