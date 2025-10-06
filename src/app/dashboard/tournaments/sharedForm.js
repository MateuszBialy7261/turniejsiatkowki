"use client";

import { useState } from "react";

export default function TournamentForm({ role }) {
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    location: "",
    teamsCount: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    console.log("📤 Wysyłanie formularza:", form);

    const res = await fetch("/api/tournaments/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...form, role }),
    });

    console.log("📥 Odpowiedź z serwera:", res.status);
    const data = await res.json();
    console.log("📦 Dane zwrócone:", data);

    if (res.ok) {
      setSuccess(true);
      setStatus(data.status);
    } else {
      setError(data.error || "Wystąpił błąd przy tworzeniu turnieju.");
    }
  } catch (err) {
    console.error("❌ Błąd połączenia:", err);
    setError("Błąd połączenia z serwerem.");
  }

  setLoading(false);
};


  if (success) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-md text-center">
        <h2 className="text-2xl font-bold mb-3">✅ Turniej został utworzony!</h2>
        {status === "pending" ? (
          <p className="text-yellow-600">
            Turniej oczekuje na akceptację administratora.
          </p>
        ) : (
          <p className="text-green-600">Turniej został aktywowany.</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        name="name"
        placeholder="Nazwa turnieju"
        value={form.name}
        onChange={handleChange}
        required
        className="border rounded-lg p-2"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          required
          className="border rounded-lg p-2"
        />
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          required
          className="border rounded-lg p-2"
        />
      </div>

      <input
        type="text"
        name="location"
        placeholder="Lokalizacja"
        value={form.location}
        onChange={handleChange}
        required
        className="border rounded-lg p-2"
      />

      <input
        type="number"
        name="teamsCount"
        placeholder="Liczba drużyn"
        value={form.teamsCount}
        onChange={handleChange}
        required
        className="border rounded-lg p-2"
      />

      <textarea
        name="description"
        placeholder="Opis (opcjonalny)"
        value={form.description}
        onChange={handleChange}
        className="border rounded-lg p-2"
      ></textarea>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition"
      >
        {loading ? "Tworzenie..." : "Utwórz turniej"}
      </button>
    </form>
  );
}
