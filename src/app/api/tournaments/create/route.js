import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import db from "@/lib/db";
import { sendTournamentNotification } from "@/lib/mailer";

export async function POST(req) {
  try {
    // 🔹 Pobranie zalogowanego użytkownika z Supabase (cookie sesji)
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user)
      return NextResponse.json(
        { error: "Brak autoryzacji" },
        { status: 401 }
      );

    // 🔹 Pobranie rozszerzonych danych użytkownika z bazy MySQL
    const [profile] = await db.query("SELECT * FROM users WHERE id = ?", [
      user.id,
    ]);
    const currentUser = profile || {};

    // 🔹 Dane z formularza
    const { name, startDate, endDate, location, teamsCount, description } =
      await req.json();

    let status = "pending";

    // 🔹 Admin → natychmiast aktywny
    if (currentUser.role === "admin") {
      status = "active";
    }
    // 🔹 Organizator → aktywny tylko jeśli ma kredyty
    else if (currentUser.role === "organizer") {
      const credits = currentUser.credits || 0;
      if (credits > 0) {
        status = "active";
        await db.query("UPDATE users SET credits = credits - 1 WHERE id = ?", [
          currentUser.id,
        ]);
      }
    }

    // 🔹 Wstawienie nowego turnieju
    const result = await db.query(
      `INSERT INTO tournaments (name, start_date, end_date, location, teams_count, description, organizer_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        startDate,
        endDate,
        location,
        teamsCount,
        description,
        currentUser.id,
        status,
      ]
    );

    console.log("✅ [API] Turniej zapisany w bazie:", result);

    // 🔹 Wysłanie powiadomienia e-mail (dla organizatorów)
    if (currentUser.role === "organizer") {
      await sendTournamentNotification({
        organizerName:
          currentUser.first_name || currentUser.firstName || "Nieznany",
        organizerEmail: currentUser.email,
        tournamentName: name,
        status,
      });
    }

    return NextResponse.json({ success: true, status });
  } catch (err) {
    console.error("❌ [API] Błąd tworzenia turnieju:", err);
    return NextResponse.json(
      { error: "Błąd po stronie serwera", details: err.message },
      { status: 500 }
    );
  }
}
