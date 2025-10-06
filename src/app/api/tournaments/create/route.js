import { NextResponse } from "next/server";
import db from "@/lib/db";
import { supabaseServer } from "@/lib/supabaseServer";
import { sendTournamentNotification } from "@/lib/mailer";

export async function POST(req) {
  try {
    const { data: { session } } = await supabaseServer.auth.getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Brak autoryzacji. Zaloguj się ponownie." }, { status: 401 });
    }

    const { name, category, startDate, startTime, endDate, endTime, openingTime, briefingTime,
            location, latitude, longitude, prizes, attractions, requirements, referees,
            mealInfo, entryFee, facebookLink, rules, travelInfo, role } = await req.json();

    // Pobranie użytkownika z bazy
    const [user] = await db.query("SELECT id, role, credits, email, first_name FROM users WHERE email = ?", [session.user.email]);

    if (!user) {
      return NextResponse.json({ error: "Nie znaleziono użytkownika w bazie." }, { status: 404 });
    }

    let status = "pending";

    if (user.role === "admin" || role === "admin") {
      status = "active"; // Admin zawsze aktywuje od razu
    } else if (user.role === "organizer" || role === "organizer") {
      if (user.credits > 0) {
        status = "active";
        await db.query("UPDATE users SET credits = credits - 1 WHERE id = ?", [user.id]);
      } else {
        status = "pending"; // brak kredytów = wymaga akceptacji
      }
    }

    await db.query(
      `INSERT INTO tournaments (
        name, category, start_date, start_time, end_date, end_time,
        opening_time, briefing_time, location, latitude, longitude,
        prizes, attractions, requirements, referees, meal_info,
        entry_fee, facebook_link, rules, travel_info,
        organizer_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, category, startDate, startTime, endDate, endTime,
        openingTime, briefingTime, location, latitude, longitude,
        prizes, attractions, requirements, JSON.stringify(referees || []),
        mealInfo, entryFee, facebookLink, rules, travelInfo,
        user.id, status
      ]
    );

    // Powiadomienie mailowe
    await sendTournamentNotification({
      organizerName: user.first_name || "Organizator",
      organizerEmail: user.email,
      tournamentName: name,
      status,
    });

    return NextResponse.json({
      success: true,
      message: status === "active"
        ? "Turniej został aktywowany."
        : "Turniej oczekuje na akceptację administratora.",
      status,
    });
  } catch (error) {
    console.error("❌ Błąd tworzenia turnieju:", error);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}
