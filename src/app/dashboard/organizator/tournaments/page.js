"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrganizerTournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const resUser = await fetch("/api/me", { credentials: "include" });
        const userData = await resUser.json();

        if (!userData?.loggedIn) {
          setError("Brak autoryzacji. Zaloguj się ponownie.");
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/tournaments/list?organizer=${userData.id}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Nie udało się pobrać listy turniejów.");
        setTournaments(data.tournaments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  // 🔸 Status czasowy (trwa / zaplanowany / odbył się)
  const getTimeStatus = (start, end) => {
    if (!start || !end) return "Nieznany";
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (now < startDate) return "Zaplanowany";
    if (now >= startDate && now <= endDate) return "Trwa";
    return "Odbył się";
  };

  const getTimeStatusStyle = (status) => {
    switch (status) {
      case "Trwa":
        return "bg-green-100 text-green-700";
      case "Zaplanowany":
        return "bg-blue-100 text-blue-700";
      case "Odbył się":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        📋 Moje turnieje
      </h1>

      {loading && <p className="text-gray-500 text-center">Ładowanie turniejów...</p>}
      {error && (
        <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-center font-medium">
          {error}
        </p>
      )}

      {!loading && !error && tournaments.length === 0 && (
        <p className="text-center text-gray-500">
          Nie masz jeszcze żadnych turniejów.{" "}
          <Link href="/dashboard/organizator/tournaments/new" className="text-blue-600 underline">
            Utwórz pierwszy turniej
          </Link>
          .
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((t) => {
          const timeStatus = getTimeStatus(t.date_start, t.date_end);
          const formattedDate = t.date_start
            ? new Date(t.date_start).toLocaleDateString("pl-PL")
            : "brak daty";
          const formattedTime = t.start_time
            ? t.start_time.slice(0, 5)
            : "—";

          return (
            <div
              key={t.id}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{t.name}</h2>
                <p className="text-gray-600 text-sm mb-1">
                  🎯 {t.category?.join(", ") || "brak kategorii"}
                </p>
                <p className="text-gray-500 text-sm">
                  📅 {formattedDate} o {formattedTime}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                {/* 🔹 Status administracyjny */}
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    t.status === "active"
                      ? "bg-green-100 text-green-700"
                      : t.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {t.status === "active"
                    ? "Aktywny"
                    : t.status === "pending"
                    ? "Oczekuje"
                    : "Zakończony"}
                </span>

                {/* 🔹 Status czasowy */}
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${getTimeStatusStyle(
                    timeStatus
                  )}`}
                >
                  {timeStatus}
                </span>

                {/* 🔹 Edycja */}
                <Link
                  href={`/dashboard/organizator/tournaments/${t.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-auto"
                >
                  ✏️ Edytuj
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
