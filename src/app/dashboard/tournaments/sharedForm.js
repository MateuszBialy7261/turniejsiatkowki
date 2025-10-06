"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// 🔹 MapPicker dynamicznie – działa tylko w przeglądarce
const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="border rounded-xl bg-gray-50 p-6 text-center text-gray-500">
      Wczytywanie mapy...
    </div>
  ),
});

export default function TournamentForm({ role }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    openingTime: "",
    briefingTime: "",
    location: "",
    latitude: "",
    longitude: "",
    teamsCount: "",
    description: "",
    prizes: "",
    attractions: "",
    requirements: "",
    referees: [],
    mealInfo: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  const categories = [
    "Rzucanka",
    "Single",
    "Dwójki dziewcząt",
    "Dwójki chłopców",
    "Trójki dziewcząt",
    "Trójki chłopców",
    "Czwórki dziewcząt",
    "Czwórki chłopców",
    "Młodziczki",
    "Młodzicy",
    "Kadetki",
    "Kadeci",
    "Juniorki",
    "Juniorzy",
    "Seniorki",
    "Seniorzy",
  ];

  const refereeOptions = ["Sędziowie licencjonowani", "Sędziowie klubowi"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (option) => {
    setForm((prev) => {
      const updated = prev.referees.includes(option)
        ? prev.referees.filter((r) => r !== option)
        : [...prev.referees, option];
      return { ...prev, referees: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/tournaments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, role }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setStatus(data.status);
      } else {
        setError(data.error || "Wystąpił błąd przy tworzeniu turnieju.");
      }
    } catch (err) {
      setError("Błąd połączenia z serwerem.");
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-green-600 mb-2">
          ✅ Turniej został utworzony!
        </h2>
        {status === "pending" ? (
          <p className="text-yellow-600">
            Turniej oczekuje na akceptację administratora.
          </p>
        ) : (
          <p className="text-green-700">Turniej jest aktywny.</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-gray-800">
      {/* 🔹 Sekcja informacyjna */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
        Uzupełnij szczegóły turnieju. Wszystkie dane możesz później edytować.
      </div>

      {/* 🔹 Nazwa */}
      <div>
        <label className="block font-semibold mb-2">Nazwa turnieju *</label>
        <input
          type="text"
          name="name"
          placeholder="np. Puchar Wiosny 2025"
          value={form.name}
          onChange={handleChange}
          required
          className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* 🔹 Kategoria */}
      <div>
        <label className="block font-semibold mb-2">Kategoria *</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="border rounded-lg w-full p-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">-- wybierz kategorię --</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 🔹 Daty i godziny */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-2">Data rozpoczęcia *</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
            className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
            className="border rounded-lg w-full p-3 mt-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Data zakończenia *</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
            className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
            className="border rounded-lg w-full p-3 mt-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* 🔹 Godziny otwarcia i odprawy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-2">Godzina otwarcia zawodów *</label>
          <input
            type="time"
            name="openingTime"
            value={form.openingTime}
            onChange={handleChange}
            required
            className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Odprawa z trenerami *</label>
          <input
            type="time"
            name="briefingTime"
            value={form.briefingTime}
            onChange={handleChange}
            required
            className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* 🔹 Lokalizacja z mapą (tylko w przeglądarce) */}
      <div>
        <label className="block font-semibold mb-2">Lokalizacja turnieju *</label>
        <MapPicker
          location={form.location}
          setLocation={(loc) => setForm((prev) => ({ ...prev, location: loc }))}
          setCoords={({ lat, lng }) =>
            setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }))
          }
        />
      </div>

      {/* 🔹 Nagrody i atrakcje */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-2">Przewidywane nagrody</label>
          <textarea
            name="prizes"
            placeholder="np. Puchary, medale, upominki rzeczowe..."
            value={form.prizes}
            onChange={handleChange}
            rows="3"
            className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
        </div>
        <div>
          <label className="block font-semibold mb-2">
            Atrakcje i udogodnienia
          </label>
          <textarea
            name="attractions"
            placeholder="np. Strefa kibica, grill, muzyka, konkursy..."
            value={form.attractions}
            onChange={handleChange}
            rows="3"
            className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
        </div>
      </div>

      {/* 🔹 Wymogi organizatora */}
      <div>
        <label className="block font-semibold mb-2">Wymogi organizatora</label>
        <textarea
          name="requirements"
          placeholder="np. Własne piłki, zgłoszenie do 10 maja, obowiązkowy strój jednolity..."
          value={form.requirements}
          onChange={handleChange}
          rows="3"
          className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        ></textarea>
      </div>

      {/* 🔹 Obsługa sędziowska */}
      <div>
        <label className="block font-semibold mb-2">Obsługa sędziowska *</label>
        <div className="flex flex-col gap-2">
          {refereeOptions.map((opt) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.referees.includes(opt)}
                onChange={() => handleCheckboxChange(opt)}
                className="w-4 h-4"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 🔹 Obiad */}
      <div>
        <label className="block font-semibold mb-2">
          Informacje o obiedzie dla zespołów
        </label>
        <textarea
          name="mealInfo"
          placeholder="np. Obiad przewidziany w stołówce szkolnej o 13:00..."
          value={form.mealInfo}
          onChange={handleChange}
          rows="2"
          className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        ></textarea>
      </div>

      {/* 🔹 Komunikaty błędów */}
      {error && (
        <p className="text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          {error}
        </p>
      )}

      {/* 🔹 Przycisk */}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
      >
        {loading ? "⏳ Tworzenie..." : "Utwórz turniej"}
      </button>
    </form>
  );
}
