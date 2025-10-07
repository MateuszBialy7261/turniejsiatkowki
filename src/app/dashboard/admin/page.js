"use client";

import WelcomeBar from "@/components/WelcomeBar";
import Link from "next/link";

export default function AdminDashboard() {
  const user = { firstName: "Mateusz", role: "admin" };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <WelcomeBar firstName={user.firstName} role={user.role} />

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        👑 Panel administratora
      </h1>

      {/* 🔹 SEKCJA: Turnieje */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          🏐 Turnieje
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ✅ Utwórz nowy turniej */}
          <Link
            href="/dashboard/admin/tournaments/new"
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center hover:-translate-y-1"
          >
            <span className="text-2xl">➕</span>
            <p className="font-semibold text-lg mt-2 text-blue-600">
              Utwórz turniej
            </p>
          </Link>

          {/* 🧾 Moje turnieje */}
          <Link
            href="/dashboard/admin/tournaments/my"
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center hover:-translate-y-1"
          >
            <span className="text-2xl">🧾</span>
            <p className="font-semibold text-lg mt-2">Moje turnieje</p>
          </Link>

          {/* 🌍 Wszystkie turnieje */}
          <Link
            href="/dashboard/admin/tournaments/all"
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center hover:-translate-y-1"
          >
            <span className="text-2xl">🌍</span>
            <p className="font-semibold text-lg mt-2">Wszystkie turnieje</p>
          </Link>
        </div>
      </section>

      {/* 🔹 SEKCJA: Użytkownicy */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          👥 Użytkownicy
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/dashboard/admin/users"
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center"
          >
            <span className="text-2xl">📋</span>
            <p className="font-semibold text-lg mt-2">Zarządzaj użytkownikami</p>
          </Link>

          <Link
            href="/dashboard/admin/add"
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center"
          >
            <span className="text-2xl">➕</span>
            <p className="font-semibold text-lg mt-2">Dodaj użytkownika</p>
          </Link>
        </div>
      </section>

      {/* 🔹 SEKCJA: Inne */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          ⚙️ Inne
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Moje konto */}
          <Link
            href="/dashboard/settings"
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center"
          >
            <span className="text-2xl">🧍‍♂️</span>
            <p className="font-semibold text-lg mt-2">Moje konto</p>
          </Link>

          {/* Hale / lokalizacje */}
          <div className="bg-white p-6 rounded-2xl shadow-md text-center opacity-60">
            <span className="text-2xl">🏟️</span>
            <p className="font-semibold text-lg mt-2">
              Hale / lokalizacje (wkrótce)
            </p>
          </div>

          {/* Ustawienia */}
          <div className="bg-white p-6 rounded-2xl shadow-md text-center opacity-60">
            <span className="text-2xl">⚙️</span>
            <p className="font-semibold text-lg mt-2">
              Ustawienia (wkrótce)
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
