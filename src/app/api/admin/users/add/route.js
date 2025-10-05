import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { first_name, last_name, email, role, phone, club_name, nip, address, age, license } = body;

    // Generuj hasło i token
    const plainPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "48h" });

    // Zapis do bazy
    const { error } = await supabase.from("users").insert([
      {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        role,
        phone,
        club_name,
        nip,
        address,
        age,
        license,
        is_active: false,
      },
    ]);

    if (error) {
      console.error("❌ Błąd zapisu użytkownika:", error);
      return NextResponse.json({ error: "Błąd zapisu użytkownika." }, { status: 400 });
    }

    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/activate?token=${token}`;

    // Wysyłka maila
    await resend.emails.send({
      from: "Turniej Siatkówki <no-reply@turniejsiatkowki.pl>",
      to: email,
      subject: "Aktywuj swoje konto – Turniej Siatkówki",
      html: `
        <h2>Cześć ${first_name}!</h2>
        <p>Administrator utworzył dla Ciebie konto w systemie <strong>Turniej Siatkówki</strong>.</p>
        <p><strong>Twój login:</strong> ${email}</p>
        <p><strong>Twoje tymczasowe hasło:</strong> ${plainPassword}</p>
        <p>Aby aktywować konto, kliknij poniższy przycisk:</p>
        <p><a href="${verifyUrl}" style="display:inline-block;background:#3b82f6;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">Aktywuj konto</a></p>
        <hr/>
        <p>Klikając „Aktywuj konto”, wyrażasz zgodę na przetwarzanie swoich danych osobowych przez 
        <strong>Smart Web Solutions Mateusz Biały</strong> w celach realizacji zadań turniejowych,
        zgodnie z obowiązującymi przepisami RODO.</p>
        <p>W razie pytań skontaktuj się z nami poprzez 
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/kontakt">formularz kontaktowy</a>.</p>
      `,
    });

    return NextResponse.json({ message: "Użytkownik utworzony i e-mail wysłany." });
  } catch (err) {
    console.error("❌ Błąd:", err);
    return NextResponse.json({ error: "Błąd tworzenia użytkownika." }, { status: 500 });
  }
}
