"use client";
import { useEffect, useState } from "react";

export default function WelcomeBar({ firstName, role }) {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const days = [
        "niedziela",
        "poniedziałek",
        "wtorek",
        "środa",
        "czwartek",
        "piątek",
        "sobota",
      ];
      const months = [
        "stycznia",
        "lutego",
        "marca",
        "kwietnia",
        "maja",
        "czerwca",
        "lipca",
        "sierpnia",
        "września",
        "października",
        "listopada",
        "grudnia",
      ];

      const day = days[now.getDay()];
      const date = now.getDate();
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      setDateTime(`${day}, ${date} ${month} ${year} ${hours}:${minutes}`);
    };

    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  // Styl i ikona dla roli
  const roleDisplay = (role) => {
    switch (role) {
      case "sedzia":
        return { label: "Sędzia", color: "text-green-600", icon: "⚖️" };
      case "organizator":
        return { label: "Organizator", color: "text-blue-600", icon: "🏢" };
      case "admin":
        return { label: "Administrator", color: "text-red-600", icon: "👑" };
      default:
        return { label: "Użytkownik", color: "text-gray-600", icon: "👤" };
    }
  };

  const roleInfo = roleDisplay(role);

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center text-gray-800">
      <h2 className="text-lg sm:text-xl font-semibold">
        Cześć <span className="font-bold">{firstName}</span>, miło nam, że jesteś z nami{" "}
        <span className="inline">{roleInfo.icon}</span>
        <span className="block sm:inline ml-2 text-sm sm:text-base">
          (zalogowano jako{" "}
          <span className={`font-bold ${roleInfo.color}`}>{roleInfo.label}</span>)
        </span>
      </h2>

      <div className="flex items-center gap-4 mt-2 sm:mt-0">
        <span className="text-sm text-gray-600">{dateTime}</span>
        <form action="/api/logout" method="post">
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Wyloguj się
          </button>
        </form>
      </div>
    </div>
  );
}
