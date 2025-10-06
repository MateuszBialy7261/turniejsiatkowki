import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("sb-access-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Brak autoryzacji. Zaloguj się ponownie." }, { status: 401 });
    }

    // 🔹 Pobieramy dane użytkownika z tokena
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: "Nie udało się zweryfikować użytkownika." }, { status: 401 });
    }

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
      facebookLink,
      rules,
      travelInfo,
      role,
    } = body;

    // 🔹 Pobieramy dane użytkownika z bazy (w tym kredyty i rolę)
    const { data: dbUser, error: userFetchError } = await supabaseServer
      .from("users")
      .select("id, role, credits")
      .eq("id", user.id)
      .single();

    if (userFetchError || !dbUser) {
      return NextResponse.json({ error: "Nie znaleziono użytkownika w bazie." }, { status: 404 });
    }

    // 🔹 Sprawdzamy uprawnienia
    if (!["admin", "organizator"].includes(dbUser.role)) {
      return NextResponse.json({ error: "Brak uprawnień do tworzenia turniejów." }, { status: 403 });
    }

    // 🔹 Sprawdzamy kredyty (tylko organizator)
    if (dbUser.role === "organizator" && dbUser.credits <= 0) {
      return NextResponse.json({
        error: "Brak wystarczającej liczby kredytów. Doładuj konto, aby utworzyć turniej.",
      }, { status: 402 });
    }

    // 🔹 Status: admin -> aktywny od razu, organizator -> pending
    const tournamentStatus = dbUser.role === "admin" ? "active" : "pending";

    // 🔹 Wstawiamy rekord do bazy
    const { data: insertedTournament, error: insertError } = await supabaseServer
      .from("tournaments")
      .insert([
        {
          name,
          category,
          location,
          date_start: startDate,
          date_end: endDate,
          organizer_id: dbUser.id,
          status: tournamentStatus,
          prizes,
          attractions,
          requirements,
          entry_fee: entryFee || null,
          facebook_link: facebookLink || null,
          rules: rules || null,
          travel_info: travelInfo || null,
          opening_time: openingTime || null,
          briefing_time: briefingTime || null,
          start_time: startTime || null,
          end_time: endTime || null,
          latitude: latitude || null,
          longitude: longitude || null,
          referees: referees?.length ? referees : null,
          meal_info: mealInfo || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("❌ Błąd przy dodawaniu turnieju:", insertError);
      return NextResponse.json({ error: "Nie udało się zapisać turnieju w bazie." }, { status: 500 });
    }

    // 🔹 Jeśli organizator -> odejmujemy 1 kredyt
    if (dbUser.role === "organizator") {
      await supabaseServer
        .from("users")
        .update({ credits: dbUser.credits - 1 })
        .eq("id", dbUser.id);
    }

    return NextResponse.json({
      message: "Turniej został utworzony.",
      status: tournamentStatus,
      tournament: insertedTournament,
    });
  } catch (error) {
    console.error("❌ Błąd serwera:", error);
    return NextResponse.json({ error: "Błąd serwera podczas tworzenia turnieju." }, { status: 500 });
  }
}
