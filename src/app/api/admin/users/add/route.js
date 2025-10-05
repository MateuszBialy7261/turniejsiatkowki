import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      first_name,
      last_name,
      email,
      role,
      phone,
      address,
      club_name,
      nip,
      age,
      license,
    } = body;

    // Walidacja podstawowa
    if (!first_name || !last_name || !email || !role) {
      return NextResponse.json(
        { error: "Wymagane: imię, nazwisko, e-mail, rola." },
        { status: 400 }
      );
    }

    // 1️⃣ Wygeneruj 8-znakowe hasło + hash
    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // 2️⃣ Dodaj użytkownika jako nieaktywnego
    const { error: insertError } = await supabase.from("users").insert([
      {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        role,
        phone,
        address,
        club_name,
        nip,
        age,
        license,
        is_active: false,
      },
    ]);

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "Użytkownik o tym e-mailu już istnieje." },
          { status: 400 }
        );
      }
      console.error("❌ insert error:", insertError);
      return NextResponse.json(
        { error: "Nie udało się dodać użytkownika." },
        { status: 500 }
      );
    }

    // 3️⃣ Link aktywacyjny (JWT na 72h)
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "72h",
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "http://localhost:3000";
    const activationLink = `${baseUrl}/api/activate?token=${token}`;

    // 4️⃣ SMTP — konfiguracja transportu
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 5️⃣ Treść maila
    const htmlBody = `
      <div style="font-family:Arial,sans-serif;color:#333;padding:12px">
        <h2 style="margin:0 0 12px 0;">Witaj ${first_name}!</h2>
        <p>Administrator utworzył dla Ciebie konto w systemie <b>Turniej Siatkówki</b>.</p>
        <p><b>Login:</b> ${email}<br/>
           <b>Tymczasowe hasło:</b> ${generatedPassword}</p>

        <p>Aby aktywować konto i potwierdzić zgodę na przetwarzanie danych osobowych,
           kliknij poniższy przycisk:</p>

        <p>
          <a href="${activationLink}"
             style="display:inline-block;background:#3b82f6;color:#fff;
                    padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:600">
             Aktywuj konto
          </a>
        </p>

        <hr style="border:0;border-top:1px solid #eee;margin:16px 0"/>
        <p style="font-size:12px;color:#555;line-height:1.5">
          Klikając w link aktywacyjny wyrażasz zgodę na przetwarzanie danych osobowych przez
          <b>Smart Web Solutions Mateusz Biały</b> w celach utworzenia konta i realizacji zadań turniejowych.
          W razie wątpliwości prosimy o kontakt: 
          <a href="mailto:sedzia@mateuszbialy.pl">sedzia@mateuszbialy.pl</a>.
        </p>
      </div>
    `;

    try {
      await transporter.sendMail({
        from:
          process.env.SMTP_FROM ||
          `"Turniej Siatkówki" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Twoje konto w systemie Turniej Siatkówki – aktywacja i hasło",
        html: htmlBody,
      });
    } catch (mailErr) {
      console.error("📧 Błąd wysyłki maila:", mailErr);
    }

    return NextResponse.json({ message: "OK" });
  } catch (err) {
    console.error("❌ /api/admin/users/add error:", err);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}
