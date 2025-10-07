"use client";

import { useEffect, useState } from "react";
import TournamentForm from "@/app/dashboard/tournaments/sharedForm";

export default function OrganizerEditTournament({ params }) {
  const { id } = params;
  const [tournament, setTournament] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // 🔹 Pobierz dane użytkownika i turnieju
  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, tourRes] = await Promise.all([
          fetch("/api/me", { credentials: "include" }),
          fetch(`/api/tournaments/${id}`, { credentials: "include" }),
        ]);

        const userData = await userRes.json();
        const tourData = await tourRes.json();

        if (!userData.loggedIn) throw new Error("Brak autoryzacji.");
        setUser(userData);

        if (!tourRes.ok) throw new Error(tourData.error || "Nie udało się pobrać turnieju.");
        setTournament(tourData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  // 🔹 Zapisz zmiany
  const handleSave = async (formData) => {
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/api/tournaments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) setMessage("✅ Zmiany zostały zapisane pomyślnie!");
      else setError(data.error || "Nie udało się zapisać zmian.");
    } catch {
      setError("Błąd połączenia z serwerem.");
    }
  };

  // 🔹 Aktywacja turnieju
  const handleActivate = async () => {
    if (user?.credits <= 0) {
      setError("Nie masz wystarczających kredytów, aby aktywować turniej.");
      return;
    }

    const res = await fetch(`/api/tournaments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: "active" }),
    });
    const data = await res.json();

    if (res.ok) setMessage("✅ Turniej został aktywowany!");
    else setError(data.error || "Nie udało się aktywować turnieju.");
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Ładowanie...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        ✏️ Edycja turnieju
      </h1>

      <TournamentForm
        user={user}
        role={user.role}
        initialData={tournament}
        onSubmit={handleSave}
        buttonLabel="💾 Zapisz zmiany"
      />

      <div className="mt-6 text-center">
        {user.role === "organizator" && (
          <>
            {user.credits <= 0 && (
              <p className="text-red-600 font-medium mb-3">
                Brak kredytów! Zakup kredyty, aby aktywować turniej.
              </p>
            )}
            <button
              onClick={handleActivate}
              disabled={user.credits <= 0}
              className={`${
                user.credits > 0
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white font-semibold py-2 px-6 rounded-xl transition`}
            >
              🚀 Aktywuj turniej
            </button>
          </>
        )}
        {message && <p className="text-green-600 font-medium mt-4">{message}</p>}
      </div>
    </main>
  );
}
