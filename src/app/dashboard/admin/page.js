"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [me, setMe] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        if (!data.loggedIn || data.role !== "admin") {
          window.location.href = "/"; // guard
          return;
        }
        setMe(data);
      } catch (_) {
        window.location.href = "/";
      } finally {
        setChecked(true);
      }
    })();
  }, []);

  if (!checked) return null;

  return (
    <main className="flex-grow w-full p-8 space-y-8 text-gray-800">
      <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          👑 Panel administratora
        </h1>
        <div className="text-sm text-gray-600">
          {me?.firstName ? `Zalogowano jako: ${me.firstName}` : ""}
        </div>
      </div>

      {/* Kafelki */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/dashboard/admin/users"
          className="block bg-white rounded-2xl shadow-md p-6 text-center text-xl font-semibold hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300"
        >
          👥 Zarządzaj użytkownikami
        </Link>

        <Link
          href="/dashboard/admin/users/add"
          className="block bg-white rounded-2xl shadow-md p-6 text-center text-xl font-semibold hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300"
        >
          ➕ Dodaj użytkownika
        </Link>

        <div className="block bg-white rounded-2xl shadow-md p-6 text-center text-xl font-semibold opacity-70">
          🏆 Utwórz turniej (wkrótce)
        </div>

        <div className="block bg-white rounded-2xl shadow-md p-6 text-center text-xl font-semibold opacity-70">
          🏟️ Hale / lokalizacje (wkrótce)
        </div>

        <div className="block bg-white rounded-2xl shadow-md p-6 text-center text-xl font-semibold opacity-70">
          ⚙️ Ustawienia (wkrótce)
        </div>
      </div>
    </main>
  );
}
