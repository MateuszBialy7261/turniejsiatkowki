"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminMyTournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUser = await fetch("/api/me", { credentials: "include" });
        const userData = await resUser.json();

        if (!userData?.loggedIn) {
          setError("Brak autoryzacji. Zaloguj się ponownie.");
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/tournaments/admin-list?adminId=${userData.id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Nie udało się pobrać turniejów.");
        setTournaments(data.tournaments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTimeStatus = (start, end) => {
    if (!start || !end) return "Nieznany";
    const now = new Date();
    const s = new Date(start);
    const e = new Date(end);
    if (now < s) return "Zaplanowany";
    if (now >= s && now <= e) return "Trwa";
    return "Odbył się";
  };

  const getStyle = (status) => {
    switch (status) {
      case "Trwa": return "bg-green-100 text-green-700";
      case "Zaplanowany": return "bg-blue-100 text-blue-700";
      case "Odbył się": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-50 text-gray-500";
    }
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">📋 Moje turnieje</h1>

      {loading && <p className="text-center text-gray-500">Ładowanie...</p>}
      {error && <p className="text-red-600 text-center bg-red-50 p-3 rounded-lg">{error}</p>}
      {!loading && !error && tournaments.length === 0 && (
        <p className="text-center text-gray-500">Nie utworzyłeś jeszcze żadnych turniejów.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((t) => {
          const timeStatus = getTimeStatus(t.date_start, t.date_end);
          const date = t.date_start ? new Date(t.date_start).toLocaleDateString("pl-PL") : "—";
          const time = t.start_time ? t.start_time.slice(0, 5) : "—";
          return (
            <div key={t.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:shadow-md transition">
              <h2 className="text-xl font-semibold mb-1 text-gray-800">{t.name}</h2>
              <p className="text-sm text-gray-600 mb-1">🎯 {t.category?.join(", ") || "brak kategorii"}</p>
              <p className="text-sm text-gray-600 mb-1">📍 {t.location || "brak lokalizacji"}</p>
              <p className="text-sm text-gray-500">📅 {date} o {time}</p>

              <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  t.status === "active"
                    ? "bg-green-100 text-green-700"
                    : t.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {t.status === "active" ? "Aktywny" : t.status === "pending" ? "Oczekuje" : "Zakończony"}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStyle(timeStatus)}`}>
                  {timeStatus}
                </span>
                <Link href={`/dashboard/admin/tournaments/${t.id}`} className="text-blue-600 text-sm font-medium ml-auto hover:text-blue-800">
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
