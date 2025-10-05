import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      password,
      phone = null,
      age = null,
      clubName = null,
      nip = null,
      address = null,
      license = false,
      role,
    } = body;

    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { error: "Brak wymaganych pól." },
        { status: 400 }
      );
    }

    // 🔒 Hashowanie hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧩 Dodanie użytkownika jako nieaktywnego
    const { error: insertError } = await supabase.from("users").insert([
      {
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
        phone,
        age,
        club_name: clubName,
        nip,
        address,
        license,
        role,
        is_active: false,
      },
    ]);

    if (insertError) {
      console.error("❌ Insert error:", insertError);
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "Użytkownik o tym adresie e-mail już istnieje." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Nie udało się utworzyć konta." },
        { status: 500 }
      );
    }

    // 🧾 Tworzenie tokenu aktywacyjnego (ważny 72h)
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "72h",
    });

    // 🧠 Upewniamy się, że adres nie zawiera błędów kodowania
    const safeToken = encodeURIComponent(token);

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const activationLink = `${baseUrl}/api/activate?token=${safeToken}`;

    // ✉️ SMTP konfiguracja
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 💌 Wysłanie maila
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Aktywacja konta – Turniej Siatkówki",
      html: `
        <div style="font-family:Arial,sans-serif;color:#333;padding:12px">
          <h2>Witaj ${firstName}!</h2>
          <p>Dziękujemy za rejestrację w systemie <b>Turniej Siatkówki</b>.</p>
          <p>Twoje konto zostało utworzone, ale wymaga aktywacji.</p>
          <p>
            Kliknij poniższy przycisk, aby aktywować swoje konto:
          </p>
          <p>
            <a href="${activationLink}" 
               style="background:#3b82f6;color:#fff;
                      padding:10px 18px;border-radius:6px;
                      text-decoration:none;font-weight:bold;">
               Aktywuj konto
            </a>
          </p>
          <hr style="border:0;border-top:1px solid #eee;margin:16px 0"/>
          <p style="font-size:12px;color:#555;line-height:1.5">
            Klikając w powyższy link, wyrażasz zgodę na przetwarzanie danych osobowych przez 
            <b>Smart Web Solutions Mateusz Biały</b> w celach utworzenia konta
            i realizacji zadań turniejowych. W razie wątpliwości prosimy o kontakt:
            <a href="mailto:sedzia@mateuszbialy.pl">sedzia@mateuszbialy.pl</a>.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "✅ Konto utworzone. Sprawdź e-mail, aby aktywować konto.",
    });
  } catch (err) {
    console.error("❌ /api/register error:", err);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}
