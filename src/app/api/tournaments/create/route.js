import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import db from "@/lib/db";

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nie jesteś zalogowany." }, { status: 401 });
  }

  try {
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
      role
    } = body;

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
          organizer_id: user.id,
          status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error("Błąd Supabase:", error);
      return NextResponse.json({ error: "Nie udało się dodać turnieju." }, { status: 500 });
    }

    return NextResponse.json({ message: "Turniej dodany pomyślnie", status });
  } catch (err) {
    console.error("Błąd serwera:", err);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}
