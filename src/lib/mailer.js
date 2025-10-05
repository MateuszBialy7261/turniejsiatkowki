// src/lib/mailer.js
import nodemailer from "nodemailer";

export async function sendPasswordEmail(email, password, type = "new", firstName = "") {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  let subject, html;

  if (type === "new") {
    subject = "🎉 Twoje konto zostało utworzone!";
    html = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2>Witaj ${firstName || ""}!</h2>
        <p>Twoje konto w systemie <b>Turniej Siatkówki</b> zostało utworzone.</p>
        <p>Możesz zalogować się przy użyciu poniższych danych:</p>
        <p><b>Login:</b> ${email}</p>
        <p><b>Hasło:</b> ${password}</p>
        <p style="margin-top: 20px;">Po zalogowaniu zalecamy zmianę hasła w Twoim panelu użytkownika.</p>
        <br/>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/login"
           style="display: inline-block; padding: 10px 16px; background: #3b82f6;
           color: white; border-radius: 6px; text-decoration: none;">Zaloguj się</a>
      </div>
    `;
  } else {
    subject = "🔐 Twoje hasło zostało zresetowane";
    html = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2>Witaj ${firstName || ""}!</h2>
        <p>Administrator systemu <b>Turniej Siatkówki</b> zresetował Twoje hasło.</p>
        <p>Twoje nowe hasło to:</p>
        <p><b>${password}</b></p>
        <p style="margin-top: 20px;">Po zalogowaniu zalecamy zmianę hasła w Twoim panelu.</p>
        <br/>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/login"
           style="display: inline-block; padding: 10px 16px; background: #3b82f6;
           color: white; border-radius: 6px; text-decoration: none;">Zaloguj się</a>
      </div>
    `;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    html,
  });
}
