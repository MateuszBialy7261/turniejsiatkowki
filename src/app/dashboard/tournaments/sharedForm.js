"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// 🔹 MapPicker tylko po stronie klienta (nie wywoła "window is not defined")
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
    entryFee: "",
    facebookLink: "",
    rules: "",
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
  const [creditConsent, setCreditConsent] = useState(false);


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
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 leading-relaxed">
        <p>
          Uzupełnij szczegóły turnieju. Pamiętaj, że{" "}
          <strong>turniej może mieć kilka kategorii</strong> (np. „dwójki
          chłopców”, „trójki dziewcząt” itd.).
        </p>
        <p className="mt-1">
          Każda kategoria to osobny wpis – możesz później{" "}
          <strong>skopiować istniejący turniej</strong> w panelu organizatora i
          dodać nową kategorię.
        </p>
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
          <label className="block font-semibold mb-2">Godzina otwarcia *</label>
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

      {/* 🔹 Lokalizacja i mapa */}
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
        {/* 🔹 Wskazówki dojazdu i informacje o lokalizacji */}
        <div>
          <label className="block font-semibold mb-2">
            Wskazówki dojazdu i informacje o lokalizacji
          </label>
          <textarea
            name="directions"
            placeholder="np. Turniej rozgrywany w hali SP 7 przy ul. Poplińskiego 4. Parking dla autokarów od strony ul. Szkolnej. Wejście główne od strony boiska. W pobliżu stacja benzynowa i sklep spożywczy."
            value={form.directions || ""}
            onChange={handleChange}
            rows="3"
            className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
          <p className="text-sm text-gray-500 mt-1">
            Możesz podać nazwę hali, parking, wejście główne, udogodnienia dla gości lub inne ważne informacje.
          </p>
        </div>



      {/* 🔹 Wpisowe + link FB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-2">
            Wysokość wpisowego (od zespołu)
          </label>
          <input
            type="text"
            name="entryFee"
            placeholder="np. 100 zł / drużyna"
            value={form.entryFee}
            onChange={handleChange}
            className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Link do wydarzenia (Facebook)</label>
          <input
            type="url"
            name="facebookLink"
            placeholder="np. https://facebook.com/events/..."
            value={form.facebookLink}
            onChange={handleChange}
            className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* 🔹 Regulamin */}
      <div>
        <label className="block font-semibold mb-2">Regulamin turnieju</label>
        <textarea
          name="rules"
          placeholder="Wklej treść regulaminu lub jego główne punkty..."
          value={form.rules}
          onChange={handleChange}
          rows="4"
          className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        ></textarea>
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


     {/* 🔹 Potwierdzenie wykorzystania kredytu */}
{role === "organizer" && (
  <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    <input
      type="checkbox"
      id="creditConsent"
      checked={creditConsent}
      onChange={(e) => setCreditConsent(e.target.checked)}
      className="mt-1 w-5 h-5 accent-yellow-500 cursor-pointer"
      required
    />
    <label htmlFor="creditConsent" className="text-sm text-yellow-800">
      Potwierdzam utworzenie turnieju i rozumiem, że z mojego konta zostanie
      pobrany <span className="font-semibold">1 kredyt</span> za jego aktywację.
    </label>
  </div>
)}

{/* 🔹 Komunikaty błędów */}
{error && (
  <p className="text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg p-3 text-center">
    {error}
  </p>
)}

{/* 🔹 Przycisk */}
<button
  type="submit"
  disabled={loading || (role === "organizer" && !creditConsent)}
  className={`${
    loading || (role === "organizer" && !creditConsent)
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  } text-white font-semibold py-3 rounded-xl transition`}
>
  {loading ? "⏳ Tworzenie..." : "Utwórz turniej"}
</button>

    </form>
  );
}
