import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req) {
  try {
    // 🔹 Pobranie danych użytkownika z ciasteczek
    const userRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/me`, {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });

    const userData = await userRes.json();

    if (!userData.loggedIn) {
      return NextResponse.json({ error: "Nie jesteś zalogowany." }, { status: 401 });
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
      referees = [],
      mealInfo,
      entryFee,
      facebookLink = null,
      rules,
      travelInfo,
      role,
    } = body;

    // 🔹 Status zależny od roli
    const status = role === "admin" ? "approved" : "pending";

    const { data, error } = await db
      .from("tournaments")
      .insert([
        {
          name,
          category,
          date_start: startDate,
          start_time: startTime,
          date_end: endDate,
          end_time: endTime,
          opening_time: openingTime,
          briefing_time: briefingTime,
          location,
          latitude,
          longitude,
          prizes,
          attractions,
          requirements,
          referees,
          meal_info: mealInfo,
          entry_fee: entryFee,
          facebook_link: facebookLink,
          rules,
          travel_info: travelInfo,
          organizer_id: userData.id,
          status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("❌ Błąd Supabase:", error);
      return NextResponse.json({ error: "Nie udało się dodać turnieju." }, { status: 500 });
    }

    return NextResponse.json({
      message: "Turniej dodany pomyślnie!",
      status,
    });
  } catch (err) {
    console.error("❌ Błąd serwera:", err);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}
