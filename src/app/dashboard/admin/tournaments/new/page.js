"use client";

import { useEffect, useState } from "react";
import TournamentForm from "@/app/dashboard/tournaments/sharedForm";

export default function AdminNewTournamentPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
          setUser(data);
        }
      })
      .catch((err) => console.error("❌ Błąd podczas pobierania danych użytkownika:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="p-6 text-center text-gray-500">
        Ładowanie danych użytkownika...
      </main>
    );
  }

  if (!user) {
    return (
      <main className="p-6 text-center text-red-600">
        Nie udało się załadować danych użytkownika. Zaloguj się ponownie.
      </main>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
          🏆 Utwórz nowy turniej
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Turnieje tworzone przez administratora są aktywne natychmiast po dodaniu.
        </p>

        <TournamentForm user={user} role={user.role || "admin"} />
      </div>
    </main>
  );
}
