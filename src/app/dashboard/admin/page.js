"use client";
import { useEffect, useState } from "react";
import WelcomeBar from "@/components/WelcomeBar";
import Link from "next/link";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        if (data.loggedIn) setUser(data);
      } catch {
        setUser(null);
      }
    }
    loadUser();
  }, []);

  if (!user) return <p className="text-center mt-10 text-gray-500">Ładowanie...</p>;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <WelcomeBar firstName={user.first_name} role={user.role} />

      <h1 className="text-3xl font-bold mb-6">👑 Panel administratora</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/dashboard/admin/users"
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center"
        >
          <span className="text-2xl">👥</span>
          <p className="font-semibold text-lg mt-2">Zarządzaj użytkownikami</p>
        </Link>

        <Link
          href="/dashboard/admin/add-user"
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center"
        >
          <span className="text-2xl">➕</span>
          <p className="font-semibold text-lg mt-2">Dodaj użytkownika</p>
        </Link>

        <div className="bg-white p-6 rounded-2xl shadow-md text-center opacity-60">
          <span className="text-2xl">🏆</span>
          <p className="font-semibold text-lg mt-2">Utwórz turniej (wkrótce)</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md text-center opacity-60">
          <span className="text-2xl">🏟️</span>
          <p className="font-semibold text-lg mt-2">Hale / lokalizacje (wkrótce)</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md text-center opacity-60">
          <span className="text-2xl">⚙️</span>
          <p className="font-semibold text-lg mt-2">Ustawienia (wkrótce)</p>
        </div>
      </div>
    </main>
  );
}
