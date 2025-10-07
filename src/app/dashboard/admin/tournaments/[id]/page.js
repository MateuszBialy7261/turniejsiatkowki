"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AdminEditTournamentPage() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadTournament = async () => {
      const res = await fetch(`/api/tournaments/${id}`);
      const data = await res.json();
      setForm(data);
      setLoading(false);
    };
    loadTournament();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/tournaments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) setMessage("✅ Zmiany zapisane pomyślnie!");
      else setMessage(data.error || "Wystąpił błąd");
    } catch {
      setMessage("❌ Błąd połączenia z serwerem");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async () => {
    const newStatus = form.status === "active" ? "pending" : "active";
    setSaving(true);
    try {
      const res = await fetch(`/api/tournaments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setForm((prev) => ({ ...prev, status: newStatus }));
        setMessage(`✅ Status zmieniono na ${newStatus === "active" ? "Aktywny" : "Oczekuje"}`);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500 mt-10">Ładowanie...</p>;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">✏️ Edycja turnieju</h1>

      {message && (
        <p
          className={`text-center p-3 mb-4 rounded-lg ${
            message.includes("✅")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-2">Nazwa turnieju</label>
            <input
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Lokalizacja</label>
            <input
              name="location"
              value={form.location || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Data rozpoczęcia</label>
            <input
              type="date"
              name="date_start"
              value={form.date_start || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Godzina rozpoczęcia</label>
            <input
              type="time"
              name="start_time"
              value={form.start_time || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Status</label>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                form.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {form.status === "active" ? "Aktywny" : "Oczekuje"}
            </span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            💾 Zapisz zmiany
          </button>
          <button
            onClick={toggleStatus}
            disabled={saving}
            className={`px-5 py-2 rounded-xl border transition ${
              form.status === "active"
                ? "border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                : "border-green-500 text-green-700 hover:bg-green-50"
            }`}
          >
            {form.status === "active" ? "🚫 Dezaktywuj" : "✅ Aktywuj"}
          </button>
        </div>
      </div>
    </main>
  );
}
