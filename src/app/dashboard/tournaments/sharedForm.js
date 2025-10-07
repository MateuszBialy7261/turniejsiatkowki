"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

export default function TournamentForm({
  role,
  user,
  mode = "create",            // "create" | "edit"
  tournamentId = null,        // w trybie "edit" wymagane
}) {
  const isOrganizer = (user?.role || role) === "organizator";
  const isAdmin = (user?.role || role) === "admin";

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
    confirmCredit: false, // tylko przy create dla organizatora
  });

  const [status, setStatus] = useState(null);     // active | pending | finished
  const [loading, setLoading] = useState(false);
  const [actLoading, setActLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Rzucanka","Single","Dwójki dziewcząt","Dwójki chłopców","Trójki dziewcząt","Trójki chłopców",
    "Czwórki dziewcząt","Czwórki chłopców","Młodziczki","Młodzicy","Kadetki","Kadeci",
    "Juniorki","Juniorzy","Seniorki","Seniorzy",
  ];
  const refereeOptions = ["Sędziowie licencjonowani", "Sędziowie klubowi"];

  // helper: time from "HH:MM:SS" -> "HH:MM"
  const t5 = (t) => (t ? String(t).slice(0, 5) : "");

  // 🔹 W trybie EDIT ładujemy dane turnieju
  useEffect(() => {
    let ignore = false;
    async function load() {
      if (mode !== "edit" || !tournamentId) return;
      try {
        const res = await fetch(`/api/tournaments/${tournamentId}`, { credentials: "include" });
        const data = await res.json();
        if (!res.ok) {
          setError(data?.error || "Nie udało się pobrać danych turnieju.");
          return;
        }
        if (ignore) return;

        setForm({
          name: data.name || "",
          category: Array.isArray(data.category) ? (data.category[0] || "") : (data.category || ""),
          startDate: data.date_start || "",
          startTime: t5(data.start_time),
          endDate: data.date_end || "",
          endTime: t5(data.end_time),
          openingTime: t5(data.opening_time),
          briefingTime: t5(data.briefing_time),
          location: data.location || "",
          latitude: data.latitude ?? "",
          longitude: data.longitude ?? "",
          prizes: data.prizes || "",
          attractions: data.attractions || "",
          requirements: data.requirements || "",
          referees: data.referees || [],
          mealInfo: data.meal_info || "",
          entryFee: data.entry_fee ?? "",
          facebookLink: data.facebook_link || "",
          rules: data.rules || "",
          travelInfo: data.travel_info || "",
          confirmCredit: false,
        });
        setStatus(data.status || null);
      } catch {
        setError("Błąd połączenia.");
      }
    }
    load();
    return () => { ignore = true; };
  }, [mode, tournamentId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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
    if (!form.startDate || !form.endDate) return "Podaj daty rozpoczęcia i zakończenia.";
    if (!form.location.trim()) return "Podaj lokalizację.";

    // tylko w CREATE dla organizatora
    if (mode === "create" && isOrganizer && !form.confirmCredit) {
      return "Musisz potwierdzić, że utworzenie turnieju pobiera jeden kredyt.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const v = validateForm();
    if (v) {
      setError(v);
      setLoading(false);
      return;
    }

    try {
      const url =
        mode === "edit" && tournamentId
          ? `/api/tournaments/${tournamentId}`
          : "/api/tournaments/create";

      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, role: user?.role || role }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Wystąpił błąd podczas zapisu.");
      } else {
        setSuccess(true);
        if (data.status) setStatus(data.status);
      }
    } catch {
      setError("Błąd połączenia z serwerem.");
    }
    setLoading(false);
  };

  // 🔸 AKTYWACJA (status -> active)
  const handleActivate = async () => {
    if (!tournamentId) return;
    setError("");
    setActLoading(true);
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "active" }), // częściowy update
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Nie udało się aktywować turnieju.");
      } else {
        setStatus("active");
      }
    } catch {
      setError("Błąd połączenia podczas aktywacji.");
    }
    setActLoading(false);
  };

  if (success && mode === "create") {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-green-600 mb-2">
          ✅ Turniej został utworzony! Możesz go już edytować w panelu organizatora.
        </h2>
        {status === "pending" ? (
          <p className="text-yellow-600">
            Turniej utworzony, jednak musieliśmy go od razu zablokować —
            <b> brak kredytów</b>. Skontaktuj się z administratorem lub dokup kredyty i aktywuj turniej.
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
      {/* Informacja */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
        Uzupełnij szczegóły turnieju. <br />
        {isOrganizer ? (
          <span><b>Uwaga:</b> utworzenie/aktywacja turnieju pobiera jeden kredyt.</span>
        ) : (
          <span>Jako administrator możesz aktywować turnieje bez kredytów.</span>
        )}
        {mode === "edit" && (
          <div className="mt-2 text-gray-700">
            Status:{" "}
            <span className={`font-semibold ${status === "active" ? "text-green-600" : status === "pending" ? "text-amber-600" : "text-gray-600"}`}>
              {status || "—"}
            </span>
          </div>
        )}
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
          <label className="block font-semibold mb-2">Data i godzina rozpoczęcia *</label>
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
          <label className="block font-semibold mb-2">Data i godzina zakończenia *</label>
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
          <label className="block font-semibold mb-2">Godzina otwarcia zawodów</label>
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
        <label className="block font-semibold mb-2">Wskazówki dojazdu i informacje o miejscu</label>
        <textarea
          name="travelInfo"
          placeholder="np. Hala SP 4, wejście od ul. Mickiewicza, parking za szkołą..."
          value={form.travelInfo}
          onChange={handleChange}
          rows="3"
          className="border rounded-lg w-full p-3"
        ></textarea>
      </div>

      {/* Nagrody / Atrakcje */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-2">Przewidywane nagrody</label>
          <textarea
            name="prizes"
            placeholder="np. Puchary, medale, vouchery..."
            value={form.prizes}
            onChange={handleChange}
            rows="3"
            className="border rounded-lg w-full p-3"
          ></textarea>
        </div>
        <div>
          <label className="block font-semibold mb-2">Atrakcje i udogodnienia</label>
          <textarea
            name="attractions"
            placeholder="np. strefa kibica, grill, muzyka..."
            value={form.attractions}
            onChange={handleChange}
            rows="3"
            className="border rounded-lg w-full p-3"
          ></textarea>
        </div>
      </div>

      {/* Wymogi */}
      <div>
        <label className="block font-semibold mb-2">Wymogi organizatora</label>
        <textarea
          name="requirements"
          placeholder="np. własne piłki, obowiązkowe zgłoszenie do 10 maja..."
          value={form.requirements}
          onChange={handleChange}
          rows="3"
          className="border rounded-lg w-full p-3"
        ></textarea>
      </div>

      {/* Obsługa sędziowska */}
      <div>
        <label className="block font-semibold mb-2">Obsługa sędziowska</label>
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

      {/* Obiad */}
      <div>
        <label className="block font-semibold mb-2">Informacje o obiedzie dla zespołów</label>
        <textarea
          name="mealInfo"
          placeholder="np. Obiad w stołówce szkolnej o 13:00..."
          value={form.mealInfo}
          onChange={handleChange}
          rows="2"
          className="border rounded-lg w-full p-3"
        ></textarea>
      </div>

      {/* Wpisowe / FB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-2">Wpisowe (zł)</label>
          <input
            type="number"
            name="entryFee"
            placeholder="np. 100"
            value={form.entryFee}
            onChange={handleChange}
            className="border rounded-lg w-full p-3"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Link do wydarzenia (np. Facebook)</label>
          <input
            type="text"
            name="facebookLink"
            placeholder="https://facebook.com/..."
            value={form.facebookLink}
            onChange={handleChange}
            className="border rounded-lg w-full p-3"
          />
        </div>
      </div>

      {/* Regulamin */}
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

      {/* Checkbox kredytowy — tylko w CREATE dla organizatora */}
      {mode === "create" && isOrganizer && (
        <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 p-3 rounded-lg">
          <input
            type="checkbox"
            name="confirmCredit"
            checked={form.confirmCredit}
            onChange={handleChange}
            className="mt-1 w-5 h-5 accent-blue-600"
            required
          />
          <span className="text-sm text-gray-700">
            Potwierdzam, że utworzenie turnieju pobierze <b>1 kredyt</b> z mojego konta.
          </span>
        </div>
      )}

      {/* Błędy */}
      {error && (
        <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-center font-medium">
          {error}
        </p>
      )}

      {/* Przyciski akcji */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-xl transition disabled:opacity-50"
        >
          {loading ? "⏳ Przetwarzanie..." : mode === "edit" ? "Zapisz zmiany" : "Utwórz turniej"}
        </button>

        {mode === "edit" && status !== "active" && (
          <button
            type="button"
            onClick={handleActivate}
            disabled={actLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-5 rounded-xl transition disabled:opacity-50"
          >
            {actLoading ? "⏳ Aktywuję..." : isAdmin ? "Aktywuj (bez kredytu)" : "Aktywuj turniej"}
          </button>
        )}
      </div>
    </form>
  );
}
