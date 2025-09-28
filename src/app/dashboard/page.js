"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) setUser(data);
      });

    const today = new Date();
    const formatted = today.toLocaleDateString("pl-PL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setDateString(formatted.charAt(0).toUpperCase() + formatted.slice(1));
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Ładowanie...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/"; // wracamy na stronę główną
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      <header className="flex justify-between items-center bg-white shadow rounded-xl p-4">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">
          Cześć {user.firstName}, miło nam, że jesteś z nami 😎
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm sm:text-base">
            {`Dzisiaj jest ${dateString}`}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-400 hover:bg-red-500 text-white px-4 py-1 rounded transition"
          >
            Wyloguj się
          </button>
        </div>
      </header>

      <main className="mt-6">
        <p className="text-gray-700">
          🚀 Tutaj w przyszłości będzie panel {user.role}.
        </p>
      </main>
    </div>
  );
}
