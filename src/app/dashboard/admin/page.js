"use client";
import { useEffect, useState } from "react";
import AdminTile from "@/components/AdminTile";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.loggedIn) setUser(d);
        else window.location.href = "/login";
      })
      .catch(() => (window.location.href = "/login"));
  }, []);

  useEffect(() => {
    const update = () => {
      const formatted = new Intl.DateTimeFormat("pl-PL", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date());
      setDateTime(formatted);
    };
    update();
    const id = setInterval(update, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Ładowanie…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      {/* Pasek górny */}
      <header className="flex justify-between items-center bg-white shadow rounded-xl p-4">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">
          Cześć {user.firstName}, miło nam, że jesteś z nami 😎
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm sm:text-base">{dateTime}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Wyloguj się
          </button>
        </div>
      </header>

      {/* Kafelki sekcji */}
      <main className="mt-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Panel administratora
        </h2>

        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Zarządzanie</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AdminTile
              href="/dashboard/admin/users"
              icon="👥"
              title="Użytkownicy"
              desc="Dodawaj, edytuj, aktywuj, zmieniaj role, usuwaj"
            />
            <AdminTile
              href="#"
              icon="🏆"
              title="Turnieje"
              desc="(wkrótce) Tworzenie i edycja turniejów"
            />
            <AdminTile
              href="#"
              icon="🧾"
              title="Płatności"
              desc="(wkrótce) Przegląd i rozliczenia"
            />
            <AdminTile
              href="#"
              icon="📋"
              title="Mecze"
              desc="(wkrótce) Harmonogram i wyniki"
            />
            <AdminTile
              href="#"
              icon="🛠️"
              title="Ustawienia"
              desc="(wkrótce) Ustawienia systemu"
            />
            <AdminTile
              href="#"
              icon="📨"
              title="Szablony e-mail"
              desc="(wkrótce) Maile transakcyjne"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
