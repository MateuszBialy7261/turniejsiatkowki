import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabaseClient";

export async function POST(_req, { params }) {
  const { id } = params;

  try {
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("email, first_name")
      .eq("id", id)
      .single();

    if (userErr || !user) {
      return NextResponse.json({ error: "Nie znaleziono użytkownika." }, { status: 404 });
    }

    // Wygeneruj nowe hasło
    const newPassword = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(newPassword, 10);

    // Zaktualizuj w bazie
    const { error: updateErr } = await supabase
      .from("users")
      .update({ password: hashed })
      .eq("id", id);

    if (updateErr) throw updateErr;

    // Wyślij e-mail z nowym hasłem
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: "🔄 Reset hasła – Turniej Siatkówki",
      html: `
        <div style="font-family:Arial,sans-serif;color:#333;padding:12px">
          <h2>Witaj ${user.first_name}!</h2>
          <p>Twoje hasło zostało zresetowane przez administratora.</p>
          <p><b>Nowe hasło:</b> ${newPassword}</p>
          <p>Po zalogowaniu zalecamy zmianę hasła w ustawieniach profilu.</p>
          <hr/>
          <p style="font-size:12px;color:#555">
            Jeśli nie prosiłeś o reset hasła, skontaktuj się z administratorem.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Hasło zresetowane." });
  } catch (err) {
    console.error("❌ /reset error:", err);
    return NextResponse.json({ error: "Błąd resetowania hasła." }, { status: 500 });
  }
}
