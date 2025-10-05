import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  try {
    const token = req.cookies.get("session")?.value;
    if (!token) return NextResponse.json({ error: "Brak tokenu." }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user, error } = await supabase
      .from("users")
      .select("id, first_name, last_name, email, role, phone, address, club_name, nip, age, license, is_active")
      .eq("id", decoded.id)
      .single();

    if (error || !user) return NextResponse.json({ error: "Nie znaleziono użytkownika." }, { status: 404 });

    return NextResponse.json(user);
  } catch (err) {
    console.error("❌ /api/user GET error:", err);
    return NextResponse.json({ error: "Błąd autoryzacji." }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const token = req.cookies.get("session")?.value;
    if (!token) return NextResponse.json({ error: "Brak tokenu." }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const updates = await req.json();

    const allowed = ["first_name", "last_name", "phone", "address", "club_name", "nip", "license"];
    const clean = {};
    for (const key of allowed) if (updates[key] !== undefined) clean[key] = updates[key];

    const { error } = await supabase.from("users").update(clean).eq("id", decoded.id);

    if (error) throw error;
    return NextResponse.json({ message: "OK" });
  } catch (err) {
    console.error("❌ /api/user PUT error:", err);
    return NextResponse.json({ error: "Nie udało się zapisać danych." }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const token = req.cookies.get("session")?.value;
    if (!token) return NextResponse.json({ error: "Brak tokenu." }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { error } = await supabase.from("users").delete().eq("id", decoded.id);

    if (error) throw error;

    const res = NextResponse.json({ message: "Konto usunięte." });
    res.cookies.set("session", "", { expires: new Date(0) }); // wyloguj
    return res;
  } catch (err) {
    console.error("❌ /api/user DELETE error:", err);
    return NextResponse.json({ error: "Błąd podczas usuwania konta." }, { status: 500 });
  }
}

