"use client";

import { useEffect, useState } from "react";

export default function AdminAddUserPage() {
  const [meChecked, setMeChecked] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    phone: "",
    address: "",
    club_name: "",
    nip: "",
    age: "",
    license: false,
  });
  const [msg, setMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // guard
  useEffect(() => {
    (async () => {
      try {
        const m = await (await fetch("/api/me", { credentials: "include" })).json();
        if (!m.loggedIn || m.role !== "admin") {
          window.location.href = "/";
          return;
        }
        setMeChecked(true);
      } catch {
        window.location.href = "/";
      }
    })();
  }, []);

  if (!meChecked) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);

    try {
      const res = await fetch("/api/admin/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Błąd dodawania użytkownika");

      setMsg({ type: "success", text: "✅ Użytkownik dodany. Wysłano e-mail z hasłem i linkiem aktywacyjnym." });
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        role: "",
        phone: "",
        address: "",
        club_name: "",
        nip: "",
        age: "",
        license: false,
      });
    } catch (e) {
      setMsg({ type: "error", text: "❌ " + e.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">➕ Dodaj użytkownika</h1>

      {msg && (
        <div
          className={`mb-4 p-3 rounded ${msg.type === "success" ? "bg-[#d4edf8] text-black" : "bg-red-100 text-red-800"}`}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={submit} className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-gray-700">Imię</span>
            <input
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Nazwisko</span>
            <input
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-gray-700">E-mail</span>
            <input
              type="email"
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Rola</span>
            <select
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">Wybierz rolę</option>
              <option value="sedzia">Sędzia</option>
              <option value="organizator">Organizator</option>
              <option value="admin">Administrator</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Telefon</span>
            <input
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-gray-700">Adres</span>
            <input
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Nazwa klubu</span>
            <input
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
              name="club_name"
              value={form.club_name}
              onChange={handleChange}
            />
          </label>

          <label className="block">
            <span className="text-gray-700">NIP</span>
            <input
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
              name="nip"
              value={form.nip}
              onChange={handleChange}
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Wiek</span>
            <input
              type="number"
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
              name="age"
              value={form.age}
              onChange={handleChange}
            />
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="license"
              checked={form.license}
              onChange={handleChange}
              className="h-5 w-5 text-blue-400 border-gray-300 rounded cursor-pointer"
            />
            <span className="text-gray-700">Licencja sędziego</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold disabled:opacity-60"
        >
          {submitting ? "Dodawanie..." : "Dodaj użytkownika"}
        </button>
      </form>
    </main>
  );
}
