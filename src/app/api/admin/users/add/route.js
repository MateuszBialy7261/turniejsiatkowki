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

    // 🔐 Generowanie losowego hasła (8 znaków)
    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // 🧩 Tworzymy nieaktywnego użytkownika
    const { data, error } = await supabase.from("users").insert([
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
        is_active: false, // domyślnie nieaktywne konto
      },
    ]);

    if (error) {
      console.error("❌ Błąd dodawania użytkownika:", error);
      return NextResponse.json(
        { error: "Nie udało się dodać użytkownika." },
        { status: 400 }
      );
    }

    // 🔗 Generujemy link aktywacyjny (72h ważny)
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "72h",
    });
    const activationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/activate?token=${token}`;

    // 📧 Wysyłamy e-mail aktywacyjny
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Turniej Siatkówki" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Twoje konto w systemie Turniej Siatkówki",
      html: `
        <div style="font-family:Arial, sans-serif; color:#333;">
          <h2>👋 Witaj ${first_name}!</h2>
          <p>Administrator utworzył dla Ciebie konto w systemie <strong>Turniej Siatkówki</strong>.</p>

          <p><strong>Twój tymczasowy login:</strong> ${email}</p>
          <p><strong>Twoje hasło:</strong> ${generatedPassword}</p>

          <p>Aby aktywować konto i potwierdzić zgodę na przetwarzanie danych osobowych, kliknij poniższy link:</p>
          <p>
            <a href="${activationLink}" 
               style="display:inline-block; background-color:#007bff; color:white; padding:10px 20px; 
                      border-radius:6px; text-decoration:none;">
              🔗 Aktywuj konto
            </a>
          </p>

          <hr>
          <p style="font-size: 13px; color: #555;">
            Klikając w link aktywacyjny, wyrażasz zgodę na przetwarzanie danych osobowych przez 
            <strong>Smart Web Solutions Mateusz Biały</strong> w celach utworzenia konta i realizacji zadań turniejowych.
            W razie wątpliwości prosimy o kontakt: 
            <a href="mailto:turniej@smartwebsolutions.pl">turniej@smartwebsolutions.pl</a>.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`📧 Wysłano e-mail aktywacyjny do ${email}`);

    return NextResponse.json({
      message: "Użytkownik dodany i e-mail aktywacyjny wysłany.",
    });
  } catch (err) {
    console.error("❌ Błąd w /api/admin/users/add:", err);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}
