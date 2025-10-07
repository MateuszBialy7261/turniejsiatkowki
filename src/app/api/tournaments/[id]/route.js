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

// GET /api/tournaments/[id]  — pobierz turniej
export async function GET(req, { params }) {
  const { id } = params;
  const user = await getUserFromSessionCookie();
  if (!user) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const { data, error } = await supabaseServer
    .from("tournaments")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Nie znaleziono turnieju." }, { status: 404 });
  }

  // Organizator widzi tylko swoje turnieje
  if (user.role === "organizator" && data.organizer_id !== user.id) {
    return NextResponse.json({ error: "Brak dostępu." }, { status: 403 });
  }

  return NextResponse.json(data);
}

// PUT /api/tournaments/[id] — edycja / aktywacja
export async function PUT(req, { params }) {
  const { id } = params;
  const user = await getUserFromSessionCookie();
  if (!user) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const body = await req.json();

  // pobierz bieżący turniej
  const { data: tournament, error: fetchErr } = await supabaseServer
    .from("tournaments")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !tournament) {
    return NextResponse.json({ error: "Nie znaleziono turnieju." }, { status: 404 });
  }

  // organizator może edytować tylko swoje
  if (user.role === "organizator" && tournament.organizer_id !== user.id) {
    return NextResponse.json({ error: "Brak uprawnień." }, { status: 403 });
  }

  // 🧭 mapowanie danych z frontu (form) -> kolumny DB; częściowe update'y są OK
  const {
    name,
    category,
    startDate,
    startTime,
    endDate,
    endTime,
    openingTime,
    briefingTime,
    location,
    latitude,
    longitude,
    prizes,
    attractions,
    requirements,
    referees,
    mealInfo,
    entryFee,
    facebookLink,
    rules,
    travelInfo,
    status, // może przyjść sam status (np. aktywacja)
  } = body;

  const updates = { updated_at: new Date().toISOString() };

  if (name !== undefined) updates.name = name || null;

  if (category !== undefined) {
    // u nas w formularzu jest 1 kategoria (string), a w DB text[]
    updates.category = Array.isArray(category) ? category : category ? [category] : null;
  }

  if (location !== undefined) updates.location = location || null;

  if (startDate !== undefined) updates.date_start = startDate || null;
  if (endDate !== undefined) updates.date_end = endDate || null;

  const normTime = (t) => (t ? String(t).slice(0, 5) : null);
  if (startTime !== undefined) updates.start_time = normTime(startTime);
  if (endTime !== undefined) updates.end_time = normTime(endTime);
  if (openingTime !== undefined) updates.opening_time = normTime(openingTime);
  if (briefingTime !== undefined) updates.briefing_time = normTime(briefingTime);

  if (latitude !== undefined) {
    updates.latitude =
      latitude === null || latitude === "" ? null : parseFloat(latitude);
  }
  if (longitude !== undefined) {
    updates.longitude =
      longitude === null || longitude === "" ? null : parseFloat(longitude);
  }

  if (prizes !== undefined) updates.prizes = prizes || null;
  if (attractions !== undefined) updates.attractions = attractions || null;
  if (requirements !== undefined) updates.requirements = requirements || null;

  if (referees !== undefined) {
    updates.referees =
      Array.isArray(referees) && referees.length ? referees : null;
  }

  if (mealInfo !== undefined) updates.meal_info = mealInfo || null;

  if (entryFee !== undefined) {
    updates.entry_fee =
      entryFee === null || entryFee === "" ? null : parseFloat(entryFee);
  }

  if (facebookLink !== undefined) updates.facebook_link = facebookLink || null;
  if (rules !== undefined) updates.rules = rules || null;
  if (travelInfo !== undefined) updates.travel_info = travelInfo || null;

  // 🟢 Logika aktywacji (status)
  const wantsActivation =
    status !== undefined && status === "active" && tournament.status !== "active";

  if (status !== undefined) {
    // Zmiana statusu — na coś innego niż „active” nie wymaga kredytów
    updates.status = status;
  }

  // jeśli ktoś aktywuje turniej
  if (wantsActivation) {
    if (user.role === "admin") {
      // admin aktywuje bez kredytu
      updates.status = "active";
    } else if (user.role === "organizator") {
      // sprawdź kredyty
      const { data: dbUser, error: userErr } = await supabaseServer
        .from("users")
        .select("id, credits")
        .eq("id", user.id)
        .single();

      if (userErr || !dbUser) {
        return NextResponse.json({ error: "Nie znaleziono użytkownika." }, { status: 404 });
      }
      if ((dbUser.credits || 0) <= 0) {
        return NextResponse.json(
          { error: "Brak dostępnych kredytów do aktywacji turnieju." },
          { status: 402 }
        );
      }

      // OK — aktywujemy i odejmujemy kredyt
      updates.status = "active";

      const { error: creditErr } = await supabaseServer
        .from("users")
        .update({ credits: (dbUser.credits || 0) - 1 })
        .eq("id", user.id);

      if (creditErr) {
        return NextResponse.json(
          { error: "Nie udało się zaktualizować kredytów." },
          { status: 500 }
        );
      }
    }
  }

  // wykonaj UPDATE (częściowy)
  const { error: updateErr } = await supabaseServer
    .from("tournaments")
    .update(updates)
    .eq("id", id);

  if (updateErr) {
    return NextResponse.json({ error: "Błąd zapisu zmian." }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: wantsActivation
      ? "Turniej aktywowany pomyślnie."
      : "Zapisano zmiany.",
  });
}
