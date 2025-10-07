"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminAllTournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await fetch("/api/tournaments/admin-list");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Nie udało się pobrać listy turniejów.");
        setTournaments(data.tournaments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
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

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">🌍 Wszystkie turnieje</h1>

      {loading && <p className="text-center text-gray-500">Ładowanie...</p>}
      {error && <p className="text-red-600 text-center bg-red-50 p-3 rounded-lg">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white border border-gray-100 rounded-2xl shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3">Nazwa</th>
                <th className="px-4 py-3">Kategoria</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Lokalizacja</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Etap</th>
                <th className="px-4 py-3 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.map((t) => {
                const timeStatus = getTimeStatus(t.date_start, t.date_end);
                const date = t.date_start
                  ? new Date(t.date_start).toLocaleDateString("pl-PL")
                  : "—";
                const time = t.start_time ? t.start_time.slice(0, 5) : "—";

                return (
                  <tr key={t.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-800">{t.name}</td>
                    <td className="px-4 py-3">{t.category?.join(", ") || "—"}</td>
                    <td className="px-4 py-3">{date} o {time}</td>
                    <td className="px-4 py-3">{t.location || "—"}</td>
                    <td className="px-4 py-3">
                      {t.status === "active"
                        ? <span className="text-green-600 font-semibold">Aktywny</span>
                        : t.status === "pending"
                        ? <span className="text-yellow-600 font-semibold">Oczekuje</span>
                        : <span className="text-gray-500 font-semibold">Zakończony</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{timeStatus}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/dashboard/admin/tournaments/${t.id}`} className="text-blue-600 hover:text-blue-800">
                        ✏️ Edytuj
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
