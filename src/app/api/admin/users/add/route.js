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

    const clean = (v) => (v === "" || v === undefined ? null : v);

    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const toInsert = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role,
      is_active: false,
    };

    if (role === "sedzia") {
      toInsert.phone = clean(phone);
      toInsert.age = clean(age);
      toInsert.license = !!license;
    } else if (role === "organizator") {
      toInsert.club_name = clean(club_name);
      toInsert.nip = clean(nip);
      toInsert.address = clean(address);
      toInsert.phone = clean(phone);
    }

    const { error: insertError } = await supabase.from("users").insert([toInsert]);

    if (insertError) {
      console.error("❌ insert error:", insertError);
      return NextResponse.json(
        { error: insertError.message || "Nie udało się dodać użytkownika." },
        { status: 400 }
      );
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "72h" });
    const safeToken = encodeURIComponent(token);
    const baseUrl = new URL(req.url).origin; // ✅ niezależne od env
    const activationLink = `${baseUrl}/api/activate?token=${safeToken}`;

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
      subject: "Twoje konto – aktywacja i hasło (Turniej Siatkówki)",
      html: `
        <div style="font-family:Arial,sans-serif;color:#333;padding:12px">
          <h2>Witaj ${first_name}!</h2>
          <p>Administrator utworzył dla Ciebie konto w systemie <b>Turniej Siatkówki</b>.</p>
          <p><b>Login:</b> ${email}<br/><b>Tymczasowe hasło:</b> ${generatedPassword}</p>
          <p>Kliknij poniższy przycisk, aby aktywować konto i potwierdzić zgodę na przetwarzanie danych:</p>
          <p>
            <a href="${activationLink}"
               style="background:#3b82f6;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:600">
               Aktywuj konto
            </a>
          </p>
          <hr/>
          <p style="font-size:12px;color:#555;">
            Klikając w link aktywacyjny, wyrażasz zgodę na przetwarzanie danych osobowych przez
            <b>Smart Web Solutions Mateusz Biały</b>.
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
