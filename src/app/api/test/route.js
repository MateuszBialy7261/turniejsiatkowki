import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      first_name,
      last_name,
      role,
      email,
      phone,
      age,
      has_license,
      club_name,
      nip,
      address,
      password,
    } = body;

    // 1. Hash hasła
    const password_hash = await bcrypt.hash(password, 10);

    // 2. Token do weryfikacji maila
    const verification_token = crypto.randomBytes(32).toString("hex");

    // 3. Zapis do bazy
    const { data, error } = await supabase.from("users").insert([
      {
        first_name,
        last_name,
        role,
        email,
        phone,
        age,
        has_license,
        club_name,
        nip,
        address,
        password_hash,
        verification_token,
        is_verified: false,
      },
    ]);

    if (error) throw error;

    // 4. TODO: wysyłka maila
    // Tutaj podłączymy Nodemailer, np. z Gmailem albo SMTP z Unixstorm
    console.log(
      `Wysłać mail do ${email} z linkiem: https://twojadomena.vercel.app/api/verify?token=${verification_token}`
    );

    return Response.json({ success: true, message: "Użytkownik zarejestrowany. Sprawdź maila w celu aktywacji konta." });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
