"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import WelcomeBar from "@/components/WelcomeBar";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const topRef = useRef(null);

  // 🧠 Pobranie danych użytkownika
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        if (!data.loggedIn) {
          window.location.href = "/login";
          return;
        }
        const res2 = await fetch(`/api/admin/users/${data.id}`, {
          cache: "no-store",
        });
        const userData = await res2.json();
        setUser(userData);
        setFormData(userData);
      } catch (err) {
        console.error("❌ loadUser error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3 && value.length <= 6)
      value = value.slice(0, 3) + "-" + value.slice(3);
    else if (value.length > 6)
      value =
        value.slice(0, 3) +
        "-" +
        value.slice(3, 6) +
        "-" +
        value.slice(6, 9);
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Błąd aktualizacji danych.");
      setMessage({
        type: "success",
        text: "✅ Dane zostały zapisane pomyślnie.",
      });
    } catch (err) {
      setMessage({ type: "error", text: "❌ " + err.message });
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Ładowanie...</p>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div ref={topRef}></div>
      <WelcomeBar firstName={user?.first_name} role={user?.role} />

      {/* Nagłówek */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">⚙️ Ustawienia konta</h1>
        <Link
          href={`/dashboard/${user.role}`}
          className="text-blue-500 hover:underline font-medium"
        >
          ⬅️ Powrót do panelu
        </Link>
      </div>

      {/* Komunikat */}
      {message && (
        <div
          className={`mb-6 p-3 rounded relative shadow-md text-center ${
            message.type === "success"
              ? "bg-[#d4edf8] text-black"
              : "bg-red-100 text-red-800"
          }`}
        >
          <span className="block font-medium">{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            type="button"
            className="absolute top-2 right-3 text-lg font-bold hover:opacity-70"
          >
            ×
          </button>
        </div>
      )}

      {/* Formularz */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-gray-700">Imię</span>
            <input
              type="text"
              name="first_name"
              value={formData.first_name || ""}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Nazwisko</span>
            <input
              type="text"
              name="last_name"
              value={formData.last_name || ""}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-gray-700">Adres e-mail</span>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Telefon</span>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handlePhoneChange}
              placeholder="123-456-789"
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Wiek</span>
            <input
              type="number"
              name="age"
              value={formData.age || ""}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-gray-700">Adres</span>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-gray-700">Nazwa klubu / organizacji</span>
            <input
              type="text"
              name="club_name"
              value={formData.club_name || ""}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-gray-700">NIP</span>
            <input
              type="text"
              name="nip"
              value={formData.nip || ""}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </label>

          {user.role === "sedzia" && (
            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                name="license"
                checked={formData.license || false}
                onChange={handleChange}
                className="h-5 w-5 text-blue-400 border-gray-300 rounded cursor-pointer"
              />
              <span>Posiadam licencję sędziego</span>
            </label>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition"
        >
          💾 Zapisz zmiany
        </button>
      </form>

      {/* KAFELKI */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          <p className="font-semibold text-lg mt-2">Usuń konto</p>
        </Link>
      </div>
    </main>
  );
}
