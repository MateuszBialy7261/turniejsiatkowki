"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function UserSettingsPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    club_name: "",
    nip: "",
    license: false,
  });
  const [role, setRole] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pobierz dane zalogowanego użytkownika
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        if (!data.loggedIn) {
          window.location.href = "/login";
          return;
        }

        setRole(data.role);

        const userRes = await fetch(`/api/user`, { cache: "no-store" });
        const userData = await userRes.json();
        if (userRes.ok) setForm(userData);
      } catch (err) {
        console.error("❌ Błąd pobierania danych:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Obsługa zmian w formularzu
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  // Zapis zmian
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: "✅ Dane zostały zapisane pomyślnie" });
    } catch (err) {
      setMsg({ type: "error", text: "❌ " + err.message });
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">⏳ Ładowanie danych...</p>
    );

  // 🔁 Adres powrotu w zależności od roli
  const backToDashboard =
    role === "admin"
      ? "/dashboard/admin"
      : role === "organizator"
      ? "/dashboard/organizator"
      : "/dashboard/sedzia";

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">⚙️ Moje konto</h1>

      {msg && (
        <div
          className={`mb-4 p-3 rounded ${
            msg.type === "success"
              ? "bg-[#d4edf8]"
              : "bg-red-100 text-red-800"
          }`}
        >
          {msg.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label>
            <span className="text-gray-700">Imię</span>
            <input
              name="first_name"
              value={form.first_name || ""}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </label>

          <label>
            <span className="text-gray-700">Nazwisko</span>
            <input
              name="last_name"
              value={form.last_name || ""}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="text-gray-700">Telefon</span>
            <input
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              placeholder="123-456-789"
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="text-gray-700">Adres</span>
            <input
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </label>

          {role === "organizator" && (
            <>
              <label>
                <span className="text-gray-700">Nazwa klubu / organizacji</span>
                <input
                  name="club_name"
                  value={form.club_name || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                />
              </label>

              <label>
                <span className="text-gray-700">NIP</span>
                <input
                  name="nip"
                  value={form.nip || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                />
              </label>
            </>
          )}

          {role === "sedzia" && (
            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                name="license"
                checked={form.license || false}
                onChange={handleChange}
                className="h-5 w-5 text-blue-400 border-gray-300 rounded cursor-pointer"
              />
              <span className="text-gray-700">Posiadam licencję sędziego</span>
            </label>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
        >
          💾 Zapisz zmiany
        </button>
      </form>

      {/* 🔹 KAFELKI AKCJI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        <Link
          href="/dashboard/settings/change-password"
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center"
        >
          <span className="text-2xl">🔑</span>
          <p className="font-semibold text-lg mt-2">Zmień hasło</p>
        </Link>

        <Link
          href="/dashboard/settings/delete"
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center"
        >
          <span className="text-2xl">🗑️</span>
          <p className="font-semibold text-lg mt-2 text-red-600">Usuń konto</p>
        </Link>
      </div>

      {/* 🔙 Powrót */}
      <div className="text-center mt-10">
        <Link
          href={backToDashboard}
          className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-semibold transition"
        >
          ⬅️ Wróć do panelu głównego
        </Link>
      </div>
    </main>
  );
}
