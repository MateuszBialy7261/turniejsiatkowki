"use client";
import { useState } from "react";
import MapPicker from "@/components/MapPicker";

export default function TournamentForm({ role, user }) {
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
    prizes: "",
    attractions: "",
    requirements: "",
    referees: [],
    mealInfo: "",
    entryFee: "",
    facebookLink: "",
    rules: "",
    travelInfo: "",
    confirmCredit: false,
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
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = (option) => {
    setForm((prev) => {
      const updated = prev.referees.includes(option)
        ? prev.referees.filter((r) => r !== option)
        : [...prev.referees, option];
      return { ...prev, referees: updated };
    });
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Podaj nazwę turnieju.";
    if (!form.category.trim()) return "Wybierz kategorię.";
    if (!form.startDate || !form.endDate)
      return "Podaj daty rozpoczęcia i zakończenia.";
    if (!form.location.trim()) return "Podaj lokalizację.";
    if (!form.confirmCredit)
      return "Musisz potwierdzić, że utworzenie turnieju pobiera jeden kredyt.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/tournaments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, role: user?.role || role }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setStatus(data.status);
      } else {
        setError(data.error || "Wystąpił błąd przy tworzeniu turnieju.");
      }
    } catch {
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 text-gray-800 bg-white p-6 rounded-2xl shadow-md"
    >
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
        Uzupełnij szczegóły turnieju. <br />
        <b>Uwaga:</b> utworzenie turnieju pobiera jeden kredyt z Twojego konta.
      </div>

      {/* Nazwa */}
      <div>
        <label className="block font-semibold mb-2">Nazwa turnieju *</label>
        <input
          type="text"
          name="name"
          placeholder="np. Puchar Wiosny 2025"
          value={form.name}
          onChange={handleChange}
          className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Kategoria */}
      <div>
        <label className="block font-semibold mb-2">Kategoria *</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border rounded-lg w-full p-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">-- wybierz kategorię --</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          W przyszłości możesz skopiować turniej i dodać kolejną kategorię.
        </p>
      </div>

      {/* Daty i godziny */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-2">
            Data i godzina rozpoczęcia *
          </label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="border rounded-lg w-full p-3"
          />
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="border rounded-lg w-full p-3 mt-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">
            Data i godzina zakończenia *
          </label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="border rounded-lg w-full p-3"
          />
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="border rounded-lg w-full p-3 mt-2"
          />
        </div>
      </div>

      {/* Godziny otwarcia i odprawy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-2">
            Godzina otwarcia zawodów
          </label>
          <input
            type="time"
            name="openingTime"
            value={form.openingTime}
            onChange={handleChange}
            className="border rounded-lg w-full p-3"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Odprawa z trenerami</label>
          <input
            type="time"
            name="briefingTime"
            value={form.briefingTime}
            onChange={handleChange}
            className="border rounded-lg w-full p-3"
          />
        </div>
      </div>

      {/* Lokalizacja + mapa */}
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

      {/* Wskazówki dojazdu */}
      <div>
        <label className="block font-semibold mb-2">
          Wskazówki dojazdu i informacje o miejscu
        </label>
        <textarea
          name="travelInfo"
          placeholder="np. Hala sportowa przy SP 4, wejście od ul. Mickiewicza, parking za budynkiem..."
          value={form.travelInfo}
          onChange={handleChange}
          rows="3"
          className="border rounded-lg w-full p-3"
        ></textarea>
      </div>

      {/* Wpisowe */}
      <div>
        <label className="block font-semibold mb-2">
          Wysokość wpisowego (zł)
        </label>
        <input
          type="number"
          name="entryFee"
          placeholder="np. 100"
          value={form.entryFee}
          onChange={handleChange}
          className="border rounded-lg w-full p-3"
        />
      </div>

      {/* Facebook i regulamin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-2">Link do wydarzenia FB</label>
          <input
            type="url"
            name="facebookLink"
            placeholder="https://facebook.com/..."
            value={form.facebookLink}
            onChange={handleChange}
            className="border rounded-lg w-full p-3"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Regulamin turnieju</label>
          <textarea
            name="rules"
            placeholder="Wklej tutaj regulamin lub zasady rozgrywek..."
            value={form.rules}
            onChange={handleChange}
            rows="3"
            className="border rounded-lg w-full p-3"
          ></textarea>
        </div>
      </div>

      {/* Checkbox potwierdzający kredyt */}
      <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 p-3 rounded-lg">
        <input
          type="checkbox"
          name="confirmCredit"
          checked={form.confirmCredit}
          onChange={handleChange}
          className="mt-1 w-5 h-5 accent-blue-600"
        />
        <span className="text-sm text-gray-700">
          Potwierdzam, że utworzenie turnieju pobiera{" "}
          <b>1 kredyt</b> z mojego konta.
        </span>
      </div>

      {/* Komunikat błędu */}
      {error && (
        <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-center font-medium">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
      >
        {loading ? "⏳ Tworzenie..." : "Utwórz turniej"}
      </button>
    </form>
  );
}
