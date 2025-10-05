"use client";

import WelcomeBar from "@/components/WelcomeBar";
import Link from "next/link";

export default function AdminDashboard() {
  const user = { firstName: "Mateusz", role: "admin" };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <WelcomeBar firstName={user.firstName} role={user.role} />

      <h1 className="text-3xl font-bold mb-6">👑 Panel administratora</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Zarządzanie użytkownikami */}
        <Link
          href="/dashboard/admin/users"
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center"
        >
          <span className="text-2xl">👥</span>
          <p className="font-semibold text-lg mt-2">Zarządzaj użytkownikami</p>
        </Link>

        {/* Dodaj użytkownika */}
        <Link
          href="/dashboard/admin/add"
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center"
        >
          <span className="text-2xl">➕</span>
          <p className="font-semibold text-lg mt-2">Dodaj użytkownika</p>
        </Link>

        {/* Moje konto */}
        <Link
          href="/dashboard/settings"
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center"
        >
          <span className="text-2xl">🧍‍♂️</span>
          <p className="font-semibold text-lg mt-2">Moje konto</p>
        </Link>

        {/* ✅ UTWÓRZ TURNIEJ – aktywny kafelek */}
        <Link
          href="/dashboard/admin/tournaments/new"
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center hover:-translate-y-1"
        >
          <span className="text-2xl">🏆</span>
          <p className="font-semibold text-lg mt-2 text-blue-600">
            Utwórz turniej
          </p>
        </Link>

        {/* Hale / lokalizacje */}
        <div className="bg-white p-6 rounded-2xl shadow-md text-center opacity-60">
          <span className="text-2xl">🏟️</span>
          <p className="font-semibold text-lg mt-2">Hale / lokalizacje (wkrótce)</p>
        </div>

        {/* Ustawienia */}
        <div className="bg-white p-6 rounded-2xl shadow-md text-center opacity-60">
          <span className="text-2xl">⚙️</span>
          <p className="font-semibold text-lg mt-2">Ustawienia (wkrótce)</p>
        </div>
      </div>
    </main>
  );
}
