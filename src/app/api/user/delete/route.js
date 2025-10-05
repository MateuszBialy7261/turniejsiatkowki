import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";

export async function DELETE(req) {
  try {
    const token = req.cookies.get("session")?.value;
    if (!token) return NextResponse.json({ error: "Brak sesji" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // całkowite usunięcie z bazy:
    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error)
      return NextResponse.json({ error: "Nie udało się usunąć konta" }, { status: 500 });

    // wylogowanie po usunięciu
    const res = NextResponse.json({ message: "✅ Konto zostało usunięte" });
    res.cookies.delete("session");

    return res;
  } catch (err) {
    console.error("❌ Błąd usuwania konta:", err);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
