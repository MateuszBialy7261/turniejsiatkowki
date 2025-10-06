import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { supabaseServer } from "@/lib/supabaseServer";

/**
 * Weryfikacja naszego cookie "session" (JWT z JWT_SECRET)
 * Zwraca { id, email, role } albo null.
 */
async function getUserFromSessionCookie() {
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    // payload: { id, email, role, iat, exp }
    if (!payload?.id) return null;
    return { id: payload.id, email: payload.email || null, role: payload.role || null };
  } catch (err) {
    console.error("❌ JWT verify error (create tournament):", err);
    return null;
  }
}

export async function POST(req) {
  try {
    // 1) Autoryzacja po naszym cookie "session"
    const sessUser = await getUserFromSessionCookie();
    if (!sessUser) {
      return NextResponse.json({ error: "Brak autoryzacji. Zaloguj się ponownie." }, { status: 401 });
    }

    // 2) Dane z formularza
    const body = await req.json();
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
      facebookLink, // opcjonalne, bez walidacji URL
      rules,        // opcjonalne
      travelInfo,
    } = body;

    // 3) Pobierz użytkownika z DB (spójnie z Twoją strukturą)
    let dbUser = null;

    // najpierw po id (najpewniejsze)
    {
      const { data, error } = await supabaseServer
        .from("users")
        .select("id, email, role, credits, first_name")
        .eq("id", sessUser.id)
        .single();
      if (!error && data) dbUser = data;
    }

    // fallback po email, gdyby id w sesji nie pokrywało się (nie powinno, ale na wszelki)
    if (!dbUser && sessUser.email) {
      const { data, error } = await supabaseServer
        .from("users")
        .select("id, email, role, credits, first_name")
        .eq("email", sessUser.email)
        .single();
      if (!error && data) dbUser = data;
    }

    if (!dbUser) {
      return NextResponse.json({ error: "Nie znaleziono użytkownika w bazie." }, { status: 404 });
    }

    // 4) Uprawnienia (Twoje role: 'admin', 'organizator')
    const role = (dbUser.role || "").toLowerCase();
    const isAdmin = role === "admin";
    const isOrganizer = role === "organizator";

    if (!isAdmin && !isOrganizer) {
      return NextResponse.json({ error: "Brak uprawnień do tworzenia turniejów." }, { status: 403 });
    }

    // 5) Status i kredyty:
    // - admin: zawsze "active", kredytów nie ruszamy
    // - organizator:
    //     * credits > 0 => "active" i odejmujemy 1
    //     * credits <= 0 => "pending" (nie odejmujemy)
    let status = "pending";
    if (isAdmin) {
      status = "active";
    } else if (isOrganizer) {
      status = (dbUser.credits ?? 0) > 0 ? "active" : "pending";
    }

    // 6) Insert do "tournaments" (pełne pola, opcjonalne mogą być null)
    const { data: inserted, error: insertError } = await supabaseServer
      .from("tournaments")
      .insert([
        {
          name,
          category,
          location,
          date_start: startDate || null,
          date_end: endDate || null,
          start_time: startTime || null,
          end_time: endTime || null,
          opening_time: openingTime || null,
          briefing_time: briefingTime || null,
          latitude: latitude || null,
          longitude: longitude || null,
          travel_info: travelInfo || null,
          prizes: prizes || null,
          attractions: attractions || null,
          requirements: requirements || null,
          referees: Array.isArray(referees) && referees.length ? referees : null,
          meal_info: mealInfo || null,
          entry_fee: entryFee === "" ? null : entryFee, // puste -> null
          facebook_link: facebookLink || null, // bez wymuszania i walidacji
          rules: rules || null,
          organizer_id: dbUser.id,
          status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select("id, status")
      .single();

    if (insertError) {
      console.error("❌ Błąd INSERT tournaments:", insertError);
      return NextResponse.json({ error: "Nie udało się zapisać turnieju w bazie." }, { status: 500 });
    }

    // 7) Organizator + status=active => odejmij 1 kredyt
    if (isOrganizer && status === "active") {
      const newCredits = Math.max((dbUser.credits ?? 0) - 1, 0);
      await supabaseServer
        .from("users")
        .update({ credits: newCredits })
        .eq("id", dbUser.id);
    }

    // (opcjonalnie: mail do admina/sędziego — możesz dorzucić, masz już mailer)

    return NextResponse.json({
      success: true,
      status,
      tournamentId: inserted.id,
      message:
        status === "active"
          ? "Turniej został aktywowany."
          : "Turniej oczekuje na akceptację administratora.",
    });
  } catch (err) {
    console.error("❌ Błąd serwera /api/tournaments/create:", err);
    return NextResponse.json(
      { error: "Błąd serwera podczas tworzenia turnieju." },
      { status: 500 }
    );
  }
}
