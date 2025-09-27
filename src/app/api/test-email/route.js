import nodemailer from "nodemailer";

export async function GET() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true", // 465 -> true, 587 -> false
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // tymczasowo zwiększamy diagnostykę
      logger: true,
      debug: true,
      // jeśli znów trafisz na błąd certyfikatu, na chwilę odkomentuj poniższą linię,
      // sprawdź czy logowanie przejdzie i ZARAZ potem wróć do ustawień bez tego:
      // tls: { rejectUnauthorized: false },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_USER, // wyślemy do siebie na próbę
      subject: "Test SMTP – Turniej Siatkówki",
      text: "SMTP działa 🎉",
    });

    return new Response(JSON.stringify({ ok: true, messageId: info.messageId }), { status: 200 });
  } catch (error) {
    // zwróć pełny komunikat, łatwiej namierzyć przyczynę
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
