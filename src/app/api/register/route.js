import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email i hasło są wymagane." },
        { status: 400 }
      );
    }

    // Hash hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    // Dodaj użytkownika
    const { data: user, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email,
          password: hashedPassword,
          role,
          is_active: false,
        },
      ])
      .select()
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "Konto o podanym adresie e-mail już istnieje." },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    // 🔑 Token aktywacyjny
    const token = crypto.randomBytes(32).toString("hex");
    const { error: tokenError } = await supabase
      .from("activation_tokens")
      .insert([{ user_id: user.id, token }]);

    if (tokenError) {
      console.error("❌ Token insert error:", tokenError);
      return NextResponse.json(
        { error: "Błąd przy tworzeniu tokenu aktywacyjnego" },
        { status: 500 }
      );
    }

    // 🌍 URL aktywacyjny
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://turniejsiatkowki.vercel.app";
    const verifyUrl = `${siteUrl}/api/activate?token=${token}`;

    // Konfiguracja mailera
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Aktywacja konta - Turniej Siatkówki",
      text: `Witaj ${firstName}!\n\nDziękujemy za rejestrację.\nAby aktywować konto, kliknij w link:\n${verifyUrl}\n\nJeśli to nie Ty zakładałeś(aś) konto, zignoruj tę wiadomość.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2 style="color: #2563eb;">Witaj ${firstName}!</h2>
          <p>Dziękujemy za rejestrację w systemie <b>Turniej Siatkówki</b>.</p>
          <p>Aby aktywować konto, kliknij poniższy przycisk:</p>
          <a href="${verifyUrl}"
             style="display: inline-block; margin-top: 20px; padding: 12px 20px;
             background: #3b82f6; color: white; text-decoration: none;
             border-radius: 6px; font-weight: bold;">
            Aktywuj konto
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            Jeśli przycisk nie działa, skopiuj i wklej ten link do przeglądarki:<br/>
            ${verifyUrl}
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      message: "Użytkownik zarejestrowany. Sprawdź e-mail w celu aktywacji.",
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
