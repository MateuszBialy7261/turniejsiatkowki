import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getUserFromSession } from "@/lib/supabaseServer";
import { sendTournamentNotification } from "@/lib/mailer";

export async function POST(req) {
  try {
    const user = await getUserFromSession(req);

    console.log("🔍 [API] Otrzymano żądanie utworzenia turnieju");
    console.log("👤 Użytkownik:", user);

    if (!user)
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });

    const data = await req.json();
    console.log("📦 Dane formularza:", data);

    const { name, startDate, endDate, location, teamsCount, description } = data;

    let status = "pending";

    if (user.role === "admin") {
      status = "active";
    } else if (user.role === "organizer") {
      const credits = user.credits || 0;
      if (credits > 0) {
        status = "active";
        await db.query("UPDATE users SET credits = credits - 1 WHERE id = ?", [
          user.id,
        ]);
      }
    }

    console.log("💾 Wstawianie turnieju do bazy...");

    const result = await db.query(
      `INSERT INTO tournaments (name, start_date, end_date, location, teams_count, description, organizer_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, startDate, endDate, location, teamsCount, description, user.id, status]
    );

    console.log("✅ Zapisano turniej:", result);

    await sendTournamentNotification({
      organizerName: user.first_name || user.firstName || "Nieznany",
      organizerEmail: user.email,
      tournamentName: name,
      status,
    });

    return NextResponse.json({ success: true, status });
  } catch (err) {
    console.error("❌ Błąd w API /tournaments/create:", err);
    return NextResponse.json(
      { error: "Wystąpił błąd po stronie serwera", details: err.message },
      { status: 500 }
    );
  }
}
