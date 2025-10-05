"use client";

import { useState, useRef, useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";

export default function AdminAddUserPage() {
  const [meChecked, setMeChecked] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    phone: "",
    age: "",
    clubName: "",
    nip: "",
    address: "",
    license: false,
    role: "",
  });
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const topRef = useRef(null);

  // 🔐 sprawdzenie uprawnień
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

  // 🔄 zmiana pól
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3 && value.length <= 6) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    } else if (value.length > 6) {
      value =
        value.slice(0, 3) +
        "-" +
        value.slice(3, 6) +
        "-" +
        value.slice(6, 9);
    }
    setForm({ ...form, phone: value });
  };

  // 📨 wysyłka danych
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });

    if (form.email !== form.confirmEmail) {
      setMessage({ type: "error", text: "❌ Adresy e-mail nie są takie same." });
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "✅ Konto utworzone! Wysłano e-mail z hasłem i linkiem aktywacyjnym.",
        });
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          confirmEmail: "",
          phone: "",
          age: "",
          clubName: "",
          nip: "",
          address: "",
          license: false,
          role: "",
        });
      } else {
        throw new Error(data.error || "Błąd tworzenia użytkownika");
      }
    } catch (err) {
      setMessage({ type: "error", text: "❌ " + err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div ref={topRef}></div>

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          ➕ Dodaj nowego użytkownika
        </h2>

        {/* Imię */}
        <label className="block">
          <span className="text-gray-700">Imię</span>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
            required
          />
        </label>

        {/* Nazwisko */}
        <label className="block">
          <span className="text-gray-700">Nazwisko</span>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
            required
          />
        </label>

        {/* Email */}
        <label className="block">
          <span className="text-gray-700">Adres e-mail</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
            required
          />
        </label>

        {/* Potwierdzenie e-maila */}
        <label className="block">
          <span className="text-gray-700">Potwierdź adres e-mail</span>
          <input
            type="email"
            name="confirmEmail"
            value={form.confirmEmail}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
            required
          />
        </label>

        {/* Rola */}
        <label className="block">
          <span className="text-gray-700">Rola</span>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
            required
          >
            <option value="">Wybierz rolę</option>
            <option value="sedzia">Sędzia</option>
            <option value="organizator">Organizator</option>
            <option value="admin">Administrator</option>
          </select>
        </label>

        {/* Telefon */}
        <label className="block">
          <span className="text-gray-700">Telefon</span>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handlePhoneChange}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </label>

        {/* Adres */}
        <label className="block">
          <span className="text-gray-700">Adres</span>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </label>

        {/* Klub */}
        <label className="block">
          <span className="text-gray-700">Nazwa klubu</span>
          <input
            type="text"
            name="clubName"
            value={form.clubName}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </label>

        {/* NIP */}
        <label className="block">
          <span className="text-gray-700">NIP</span>
          <input
            type="text"
            name="nip"
            value={form.nip}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </label>

        {/* Wiek */}
        <label className="block">
          <span className="text-gray-700">Wiek</span>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </label>

        {/* Licencja */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="license"
            checked={form.license}
            onChange={handleChange}
            className="h-5 w-5 text-blue-400 border-gray-300 rounded cursor-pointer"
          />
          <span className="text-gray-700">Licencja sędziego</span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-300 text-white py-2 rounded hover:bg-blue-400 transition cursor-pointer disabled:opacity-60"
        >
          {submitting ? "Dodawanie..." : "Dodaj użytkownika"}
        </button>
      </form>
    </AuthLayout>
  );
}
