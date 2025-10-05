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

    if (!first_name || !last_name || !email || !role) {
      return NextResponse.json(
        { error: "Wymagane: imię, nazwisko, e-mail, rola." },
        { status: 400 }
      );
    }

    // 🧩 hasło
    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // 🧩 dane z rzutowaniem typów
    const cleanData = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role,
      phone: phone || null,
      address: address || null,
      club_name: club_name || null,
      nip: nip ? String(nip).trim() : null,
      age: age ? Number(age) : null,
      license: !!license,
      is_active: false,
    };

    // 🧩 zapis
    const { error: insertError } = await supabase.from("users").insert([cleanData]);
    if (insertError) {
      console.error("❌ insert error:", insertError);
      return NextResponse.json(
        { error: "Nie udało się dodać użytkownika." },
        { status: 500 }
      );
    }

    // 🧩 token aktywacyjny
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "72h" });
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";
    const activationLink = `${baseUrl}/api/activate?token=${token}`;

    // 🧩 mail
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
      to: email,
      subject: "Twoje konto w systemie Turniej Siatkówki – aktywacja i hasło",
      html: `
        <div style="font-family:Arial,sans-serif;color:#333;padding:12px">
          <h2>Witaj ${first_name}!</h2>
          <p>Administrator utworzył dla Ciebie konto w systemie <b>Turniej Siatkówki</b>.</p>
          <p><b>Login:</b> ${email}<br/><b>Tymczasowe hasło:</b> ${generatedPassword}</p>
          <p>Kliknij przycisk poniżej, aby aktywować konto i potwierdzić zgodę na przetwarzanie danych:</p>
          <p><a href="${activationLink}" style="background:#3b82f6;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">Aktywuj konto</a></p>
          <hr/>
          <p style="font-size:12px;color:#555;">
            Klikając w link aktywacyjny, wyrażasz zgodę na przetwarzanie danych osobowych przez
            <b>Smart Web Solutions Mateusz Biały</b> w celach utworzenia konta i realizacji zadań turniejowych.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: "OK" });
  } catch (err) {
    console.error("❌ /api/admin/users/add error:", err);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}
