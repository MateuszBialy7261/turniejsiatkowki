"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import WelcomeBar from "@/components/WelcomeBar";

export default function SedziaDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        if (data.loggedIn) {
          // 🔹 Normalizacja, żeby zawsze było firstName
          setUser({
            ...data,
            firstName: data.first_name || data.firstName || "",
          });
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Ładowanie...</p>;

  if (!user)
    return (
      <p className="text-center mt-10 text-red-500">
        Brak danych użytkownika. Zaloguj się ponownie.
      </p>
    );

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <WelcomeBar firstName={user.firstName} role={user.role} />

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🦸‍♂️ Panel sędziego
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Link
          href="/dashboard/settings"
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center hover:-translate-y-1"
        >
          <span className="text-2xl">⚙️</span>
          <p className="font-semibold text-lg mt-2">Moje konto</p>
        </Link>

        <div className="bg-white p-6 rounded-2xl shadow-md text-center opacity-60">
          <span className="text-2xl">📋</span>
          <p className="font-semibold text-lg mt-2">Terminarz (wkrótce)</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md text-center opacity-60">
          <span className="text-2xl">📊</span>
          <p className="font-semibold text-lg mt-2">Statystyki (wkrótce)</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <p className="text-gray-600">
          Tu wkrótce Twoje funkcje sędziowskie (przydziały meczów, terminarze,
          rozliczenia itd.).
        </p>
      </div>
    </main>
  );
}
