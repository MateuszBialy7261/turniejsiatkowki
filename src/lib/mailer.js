import nodemailer from "nodemailer";

// 🔹 Konfiguracja transportera e-mail
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// 📨 Wysyłka e-maila z danymi logowania lub resetem hasła
export async function sendPasswordEmail(email, password, type = "new", firstName = "") {
  const transporter = createTransporter();

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

// 🆕 Powiadomienia o nowym turnieju
export async function sendTournamentNotification({
  organizerName,
  organizerEmail,
  tournament,
  status,
  recipients,
  type = "admin", // "admin" lub "organizer"
}) {
  const transporter = createTransporter();

  let subject, html;

  if (type === "admin") {
    subject = `📢 Nowy turniej: ${tournament.name}`;
    html = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2>Nowy turniej został utworzony przez ${organizerName} (${organizerEmail})</h2>
        <p><b>Nazwa:</b> ${tournament.name}</p>
        <p><b>Kategoria:</b> ${tournament.category?.join(", ") || "-"}</p>
        <p><b>Data:</b> ${tournament.date_start} – ${tournament.date_end}</p>
        <p><b>Lokalizacja:</b> ${tournament.location}</p>
        <p><b>Status:</b> ${
          status === "active" ? "✅ Aktywny" : "⏳ Oczekuje na akceptację"
        }</p>
        <hr/>
        <p><b>Przewidywane nagrody:</b> ${tournament.prizes || "-"}</p>
        <p><b>Atrakcje:</b> ${tournament.attractions || "-"}</p>
        <p><b>Wymogi:</b> ${tournament.requirements || "-"}</p>
        <p><b>Obsługa sędziowska:</b> ${tournament.referees?.join(", ") || "-"}</p>
        <p><b>Wpisowe:</b> ${tournament.entry_fee ? tournament.entry_fee + " zł" : "-"}</p>
        <p><b>Link do wydarzenia:</b> ${tournament.facebook_link || "-"}</p>
        <p><b>Regulamin:</b> ${tournament.rules || "-"}</p>
        <p><b>Wskazówki dojazdu:</b> ${tournament.travel_info || "-"}</p>
        <br/>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/admin"
           style="display: inline-block; padding: 10px 16px; background: #3b82f6;
           color: white; border-radius: 6px; text-decoration: none;">Przejdź do panelu administratora</a>
      </div>
    `;
  } else {
    subject =
      status === "active"
        ? "✅ Twój turniej został aktywowany"
        : "⏳ Twój turniej oczekuje na akceptację";

    html =
      status === "active"
        ? `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2>Gratulacje! 🎉</h2>
          <p>Twój turniej <b>${tournament.name}</b> został aktywowany i jest już widoczny w systemie.</p>
          <p>Dziękujemy za organizację wydarzenia!</p>
        </div>
      `
        : `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2>Dziękujemy za dodanie turnieju!</h2>
          <p>Twój turniej <b>${tournament.name}</b> został zapisany, ale oczekuje na akceptację administratora.</p>
          <p>Aby przyspieszyć proces, możesz:</p>
          <ul>
            <li>Upewnić się, że masz aktywne środki (kredyty) na koncie.</li>
            <li>Skontaktować się z administratorem.</li>
          </ul>
          <p>Otrzymasz powiadomienie, gdy turniej zostanie zatwierdzony.</p>
        </div>
      `;
  }

  for (const recipient of recipients) {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: recipient,
      subject,
      html,
    });
  }
}
