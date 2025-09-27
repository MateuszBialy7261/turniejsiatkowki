import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // szukamy użytkownika
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (error) throw error;

    const user = users[0];

    if (!user) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    if (!user.is_active) {
      return NextResponse.json({ status: "inactive" }, { status: 200 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "invalid_password" },
        { status: 401 }
      );
    }

    return NextResponse.json({ status: "success", user: user.id }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
