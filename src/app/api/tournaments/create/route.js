import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { supabaseServer } from "@/lib/supabaseServer";
import { sendTournamentNotification } from "@/lib/mailer";

// 🔸 Weryfikacja tokena JWT
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

export async function POST(req) {
  try {
    const sessUser = await getUserFromSessionCookie();
    if (!sessUser)
      return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });

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
    } = body;

    // 🔹 Pobierz dane użytkownika
    const { data: dbUser, error: userErr } = await supabaseServer
      .from("users")
      .select("id, email, first_name, role, credits")
      .eq("id", sessUser.id)
      .single();

    if (userErr || !dbUser)
      return NextResponse.json(
        { error: "Nie znaleziono użytkownika." },
        { status: 404 }
      );

    const role = dbUser.role?.toLowerCase();
    if (!["admin", "organizator"].includes(role))
      return NextResponse.json(
        { error: "Brak uprawnień do tworzenia turniejów." },
        { status: 403 }
      );

    // 🔹 Ustal status (aktywny tylko jeśli są kredyty lub admin)
    let status = "pending";
    if (role === "admin") status = "active";
    else if (dbUser.credits > 0) status = "active";

    // 🔹 Przygotuj dane turnieju
    const tournamentData = {
      name,
      category: Array.isArray(category)
        ? category
        : category
        ? [category]
        : [],
      location,
      date_start: startDate,
      date_end: endDate,
      start_time: startTime,
      end_time: endTime,
      opening_time: openingTime,
      briefing_time: briefingTime,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      prizes,
      attractions,
      requirements,
      referees: Array.isArray(referees) ? referees : [],
      meal_info: mealInfo,
      entry_fee: entryFee ? parseFloat(entryFee) : null,
      facebook_link: facebookLink,
      rules,
      travel_info: travelInfo,
      organizer_id: dbUser.id,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 🔹 Wstaw turniej
    const { data: inserted, error: insertErr } = await supabaseServer
      .from("tournaments")
      .insert([tournamentData])
      .select()
      .single();

    if (insertErr) {
      console.error("❌ Insert error:", insertErr);
      return NextResponse.json(
        { error: "Nie udało się zapisać turnieju w bazie." },
        { status: 500 }
      );
    }

    // 🔹 Odejmij kredyt (tylko organizator z aktywnym turniejem)
    if (role === "organizator" && status === "active" && dbUser.credits > 0) {
      const { error: creditErr } = await supabaseServer
        .from("users")
        .update({ credits: dbUser.credits - 1 })
        .eq("id", dbUser.id);

      if (creditErr)
        console.warn("⚠️ Błąd przy aktualizacji kredytu:", creditErr);
    }

    // 🔹 Powiadomienia e-mail
    if (role === "organizator") {
      // Admini
      const { data: admins } = await supabaseServer
        .from("users")
        .select("email")
        .eq("role", "admin");

      const adminEmails = admins?.map((a) => a.email).filter(Boolean) || [];

      if (adminEmails.length > 0) {
        await sendTournamentNotification({
          organizerName: dbUser.first_name || "Organizator",
          organizerEmail: dbUser.email,
          tournament: inserted,
          status,
          recipients: adminEmails,
          type: "admin",
        });
      }

      // Organizator
      await sendTournamentNotification({
        organizerName: dbUser.first_name,
        organizerEmail: dbUser.email,
        tournament: inserted,
        status,
        recipients: [dbUser.email],
        type: "organizer",
      });
    }

    // 🔹 Zwróć odpowiedź
    return NextResponse.json({
      success: true,
      message:
        status === "active"
          ? "Turniej został utworzony i aktywowany."
          : "Turniej został utworzony, ale oczekuje na aktywację (brak kredytów).",
      status,
      tournament: inserted,
    });
  } catch (err) {
    console.error("❌ Błąd serwera /api/tournaments/create:", err);
    return NextResponse.json(
      { error: "Błąd serwera podczas tworzenia turnieju." },
      { status: 500 }
    );
  }
}
