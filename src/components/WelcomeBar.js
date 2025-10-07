"use client";
import { useEffect, useState } from "react";

export default function WelcomeBar({ firstName, role }) {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const formatted = now.toLocaleString("pl-PL", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      setDateTime(formatted);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const roleColors = {
    admin: "text-red-600",
    organizator: "text-blue-600",
    sedzia: "text-green-600",
  };

  const roleEmojis = {
    admin: "👑",
    organizator: "📋",
    sedzia: "🦸‍♂️",
  };

  const roleNames = {
    admin: "Administrator",
    organizator: "Organizator",
    sedzia: "Sędzia",
  };

  // ✅ Fallbacky na wypadek braku danych
  const displayName = firstName?.trim() ? firstName : "Użytkowniku";
  const displayRole = roleNames[role] || "Użytkownik";
  const emoji = roleEmojis[role] || "🙂";
  const color = roleColors[role] || "text-gray-700";

  return (
    <div className="flex justify-between items-center bg-white rounded-2xl shadow-md p-4 mb-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Cześć {displayName}, miło nam, że jesteś z nami {emoji}
        </h2>
        <p className={`font-medium ${color}`}>
          {displayRole} • {dateTime}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition cursor-pointer"
      >
        Wyloguj się
      </button>
    </div>
  );
}
