import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

async function getUserFromSessionCookie() {
  const token = cookies().get("session")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload; // { id, role, email }
  } catch {
    return null;
  }
}

// 🔹 Pobierz turniej
export async function GET(req, { params }) {
  const { id } = params;
  const user = await getUserFromSessionCookie();

  if (!user)
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });

  const { data, error } = await supabaseServer
    .from("tournaments")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data)
    return NextResponse.json({ error: "Nie znaleziono turnieju." }, { status: 404 });

  // 🔒 Organizator może pobrać tylko swoje turnieje
  if (user.role === "organizator" && data.organizer_id !== user.id)
    return NextResponse.json({ error: "Brak dostępu." }, { status: 403 });

  return NextResponse.json(data);
}

// 🔹 Edycja turnieju (z obsługą aktywacji i kredytów)
export async function PUT(req, { params }) {
  const { id } = params;
  const user = await getUserFromSessionCookie();
  if (!user)
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });

  const body = await req.json();

  // 🔸 Pobierz turniej
  const { data: tournament, error: fetchErr } = await supabaseServer
    .from("tournaments")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !tournament)
    return NextResponse.json({ error: "Nie znaleziono turnieju." }, { status: 404 });

  // 🔸 Sprawdź uprawnienia
  if (user.role === "organizator" && tournament.organizer_id !== user.id)
    return NextResponse.json({ error: "Brak uprawnień." }, { status: 403 });

  // 🔹 Sprawdź aktywację (czy zmieniamy status na "active")
  if (body.status === "active" && tournament.status !== "active") {
    // Jeśli organizator aktywuje turniej → odejmujemy kredyt
    if (user.role === "organizator") {
      const { data: organizer, error: orgErr } = await supabaseServer
        .from("users")
        .select("credits")
        .eq("id", user.id)
        .single();

      if (orgErr || !organizer)
        return NextResponse.json({ error: "Nie znaleziono organizatora." }, { status: 404 });

      if (organizer.credits <= 0)
        return NextResponse.json(
          { error: "Brak dostępnych kredytów do aktywacji turnieju." },
          { status: 403 }
        );

      // 🔹 Odejmij kredyt
      const { error: creditErr } = await supabaseServer
        .from("users")
        .update({ credits: organizer.credits - 1 })
        .eq("id", user.id);

      if (creditErr)
        return NextResponse.json(
          { error: "Nie udało się odjąć kredytu." },
          { status: 500 }
        );
    }

    // Jeśli admin — brak ograniczeń (może aktywować bez limitu)
  }

  // 🔸 Zaktualizuj dane turnieju
  const { error: updateErr } = await supabaseServer
    .from("tournaments")
    .update({
      ...body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateErr)
    return NextResponse.json({ error: "Błąd zapisu zmian." }, { status: 500 });

  return NextResponse.json({
    success: true,
    message: "✅ Zmiany zapisano pomyślnie.",
  });
}
