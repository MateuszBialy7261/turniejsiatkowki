"use client";
import { useState, useRef, useEffect } from "react";

export default function AdminAddUserPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    phone: "",
    age: "",
    clubName: "",
    nip: "",
    address: "",
    license: false,
  });

  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const topRef = useRef(null);

  // 🧠 Autoryzacja admina
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        if (!data.loggedIn || data.role !== "admin") {
          window.location.href = "/";
        }
      } catch {
        window.location.href = "/";
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
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
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          role: formData.role,
          phone: formData.phone,
          age: formData.age,
          club_name: formData.clubName,
          nip: formData.nip,
          address: formData.address,
          license: formData.license,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "✅ Użytkownik dodany. Wysłano e-mail z hasłem i linkiem aktywacyjnym.",
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          role: "",
          phone: "",
          age: "",
          clubName: "",
          nip: "",
          address: "",
          license: false,
        });
      } else {
        setMessage({ type: "error", text: "❌ Błąd: " + data.error });
      }
    } catch {
      setMessage({ type: "error", text: "❌ Błąd połączenia z serwerem." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div ref={topRef}></div>

      <h1 className="text-3xl font-bold mb-6 text-center">
        ➕ Dodaj użytkownika
      </h1>

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

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
        {/* Imię */}
        <label className="block">
          <span className="text-gray-700">Imię</span>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
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
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
            required
          />
        </label>

        {/* E-mail */}
        <label className="block">
          <span className="text-gray-700">Adres e-mail</span>
          <input
            type="email"
            name="email"
            value={formData.email}
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
            value={formData.role}
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

        {/* Pola dla sędziego */}
        {formData.role === "sedzia" && (
          <>
            <label className="block">
              <span className="text-gray-700">Numer telefonu</span>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="123-456-789"
                maxLength={11}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Wiek</span>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="license"
                checked={formData.license}
                onChange={handleChange}
                className="h-5 w-5 text-blue-400 border-gray-300 rounded cursor-pointer"
              />
              <span>Czy posiadasz licencję sędziego?</span>
            </label>
          </>
        )}

        {/* Pola dla organizatora */}
        {formData.role === "organizator" && (
          <>
            <label className="block">
              <span className="text-gray-700">Pełna nazwa klubu</span>
              <input
                type="text"
                name="clubName"
                value={formData.clubName}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </label>

            <label className="block">
              <span className="text-gray-700">NIP</span>
              <input
                type="text"
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Adres</span>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Numer telefonu</span>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="123-456-789"
                maxLength={11}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </label>
          </>
        )}

        {/* Przycisk */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {submitting ? "Dodawanie..." : "Dodaj użytkownika"}
        </button>
      </form>
    </main>
  );
}
