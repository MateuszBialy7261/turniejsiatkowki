import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getUserFromSession } from "@/lib/session";
import { sendTournamentNotification } from "@/lib/mailer";

export async function POST(req) {
  const user = await getUserFromSession(req);
  if (!user) return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });

  const { name, startDate, endDate, location, teamsCount, description } = await req.json();

  let status = "pending";

  if (user.role === "admin") {
    status = "active";
  } else if (user.role === "organizer") {
    const credits = user.credits || 0;
    if (credits > 0) {
      status = "active";
      await db.query("UPDATE users SET credits = credits - 1 WHERE id = ?", [user.id]);
    }
  }

  const result = await db.query(
    `INSERT INTO tournaments (name, start_date, end_date, location, teams_count, description, organizer_id, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, startDate, endDate, location, teamsCount, description, user.id, status]
  );

  await sendTournamentNotification({
    organizerName: user.first_name || user.firstName || "Nieznany",
    organizerEmail: user.email,
    tournamentName: name,
    status,
  });

  return NextResponse.json({ success: true, status });
}
