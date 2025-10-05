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
      role,
      phone,
      age,
      clubName,
      nip,
      address,
      license,
    } = body;

    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { error: "Brak wymaganych pól." },
        { status: 400 }
      );
    }

    // sprzątacz: ""/undefined -> null
    const clean = (v) =>
      v === "" || v === undefined ? null : v;

    const hashedPassword = await bcrypt.hash(password, 10);

    // budujemy rekord zależnie od roli (bez śmieciowych pól)
    const toInsert = {
      first_name: firstName,
      last_name: lastName,
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
      toInsert.club_name = clean(clubName);
      toInsert.nip = clean(nip);
      toInsert.address = clean(address);
      toInsert.phone = clean(phone);
    }

    const { error: insertError } = await supabase.from("users").insert([toInsert]);

    if (insertError) {
      console.error("❌ Insert error:", insertError);
      return NextResponse.json(
        { error: insertError.message || "Błąd podczas rejestracji." },
        { status: 400 }
      );
    }

    // token aktywacyjny i link z ORIGIN żądania (nie polegam na env)
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "72h" });
    const safeToken = encodeURIComponent(token);
    const baseUrl = new URL(req.url).origin; // ✅ zawsze poprawna domena
    const activationLink = `${baseUrl}/api/activate?token=${safeToken}`;

    // SMTP
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
      subject: "Aktywacja konta – Turniej Siatkówki",
      html: `
        <div style="font-family:Arial,sans-serif;color:#333;padding:12px">
          <h2>Witaj ${firstName}!</h2>
          <p>Dziękujemy za rejestrację w systemie <b>Turniej Siatkówki</b>.</p>
          <p>Kliknij przycisk, aby aktywować swoje konto:</p>
          <p>
            <a href="${activationLink}"
               style="background:#3b82f6;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600">
               Aktywuj konto
            </a>
          </p>
          <hr style="border:0;border-top:1px solid #eee;margin:16px 0"/>
          <p style="font-size:12px;color:#555;line-height:1.5">
            Klikając w link aktywacyjny, wyrażasz zgodę na przetwarzanie danych osobowych przez
            <b>Smart Web Solutions Mateusz Biały</b> w celach utworzenia konta i realizacji zadań turniejowych.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: "✅ Konto utworzone. Sprawdź e-mail i aktywuj konto." });
  } catch (err) {
    console.error("❌ /api/register error:", err);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}
