"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [dateTime, setDateTime] = useState("");

  // Pobranie użytkownika
  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) setUser(data);
      })
      .catch(() => setUser(null));
  }, []);

  // Aktualizacja daty i godziny
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("pl-PL", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(now);
      setDateTime(formatted);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60 * 1000); // aktualizacja co minutę
    return () => clearInterval(interval);
  }, []);

  // Wylogowanie
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">Ładowanie...</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-6 p-8">
      {/* Pasek górny */}
      <div className="flex justify-between items-center bg-white shadow-md rounded-xl p-4">
        <div>
          <h1 className="text-xl font-bold">
            👋 Cześć {user.firstName}, miło nam że jesteś z nami 😎
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{dateTime}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Wyloguj się
          </button>
        </div>
      </div>

      {/* Treść panelu */}
      <div className="bg-gray-50 rounded-xl shadow p-6 text-center">
        <h2 className="text-2xl font-bold">
          🚀 Panel {user.role === "sedzia"
            ? "sędziego"
            : user.role === "organizator"
            ? "organizatora"
            : "administratora"}
        </h2>
        <p className="text-gray-600 mt-2">
          Tutaj w przyszłości pojawią się Twoje funkcje panelu.
        </p>
      </div>
    </main>
  );
}
