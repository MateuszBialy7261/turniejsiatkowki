"use client";

import WelcomeBar from "@/components/WelcomeBar";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrganizerDashboard() {
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
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <WelcomeBar firstName={user?.firstName || "Organizator"} role={user?.role || "organizer"} />

      <h1 className="text-3xl font-bold mb-6">🏐 Panel organizatora</h1>

      {/* 🔹 Informacja o liczbie kredytów */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-center">
        {loading ? (
          <p className="text-gray-500">Ładowanie danych...</p>
        ) : (
          <>
            <p className="text-gray-700 text-lg">
              Masz obecnie{" "}
              <span className="font-bold text-blue-600">
                {user?.credits ?? 0}
              </span>{" "}
              {user?.credits === 1 ? "kredyt" : user?.credits >= 2 && user?.credits <= 4 ? "kredyty" : "kredytów"}.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Każdy kredyt pozwala utworzyć jeden aktywny turniej.
            </p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* ✅ Utwórz turniej */}
        <Link
          href="/dashboard/organizator/tournaments/new"
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center hover:-translate-y-1"
        >
          <span className="text-2xl">🏆</span>
          <p className="font-semibold text-lg mt-2 text-blue-600">
            Utwórz turniej
          </p>
        </Link>

        {/* Moje turnieje */}
        <Link
          href="/dashboard/organizator/tournaments"
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center"
        >
          <span className="text-2xl">📋</span>
          <p className="font-semibold text-lg mt-2">Moje turnieje</p>
        </Link>

        {/* Moje konto */}
        <Link
          href="/dashboard/settings"
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center"
        >
          <span className="text-2xl">🧍‍♂️</span>
          <p className="font-semibold text-lg mt-2">Moje konto</p>
        </Link>

        {/* Kredyty (wkrótce) */}
        <div className="bg-white p-6 rounded-2xl shadow-md text-center opacity-60">
          <span className="text-2xl">💰</span>
          <p className="font-semibold text-lg mt-2">Historia kredytów (wkrótce)</p>
        </div>

        {/* Powiadomienia (wkrótce) */}
        <div className="bg-white p-6 rounded-2xl shadow-md text-center opacity-60">
          <span className="text-2xl">🔔</span>
          <p className="font-semibold text-lg mt-2">Powiadomienia (wkrótce)</p>
        </div>

        {/* Pomoc / kontakt (wkrótce) */}
        <div className="bg-white p-6 rounded-2xl shadow-md text-center opacity-60">
          <span className="text-2xl">💬</span>
          <p className="font-semibold text-lg mt-2">Pomoc / kontakt (wkrótce)</p>
        </div>
      </div>
    </main>
  );
}
