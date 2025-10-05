"use client";
import { useState, useRef } from "react";
import AuthLayout from "@/components/AuthLayout";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
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
    helperAnswer: "",
    rodo: false,
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [message, setMessage] = useState(null);
  const topRef = useRef(null);

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

    if (formData.email !== formData.confirmEmail) {
      setMessage({ type: "error", text: "❌ Adresy e-mail nie są takie same." });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "❌ Hasła nie są takie same." });
      return;
    }

    if (formData.helperAnswer.trim() !== "5") {
      setMessage({
        type: "error",
        text: "❌ Błędna odpowiedź na pytanie pomocnicze.",
      });
      return;
    }

    if (!formData.rodo) {
      setMessage({
        type: "error",
        text: "❌ Musisz wyrazić zgodę na przetwarzanie danych osobowych.",
      });
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "✅ Konto utworzone! Sprawdź skrzynkę e-mail, aby aktywować konto.",
        });
        if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
      } else {
        setMessage({ type: "error", text: "❌ " + (data.error || "Błąd rejestracji.") });
      }
    } catch {
      setMessage({ type: "error", text: "❌ Wystąpił błąd połączenia z serwerem." });
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
        <h2 className="text-2xl font-bold mb-4 text-center">📝 Rejestracja</h2>

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

        {/* Potwierdzenie e-maila */}
        <label className="block">
          <span className="text-gray-700">Potwierdź adres e-mail</span>
          <input
            type="email"
            name="confirmEmail"
            value={formData.confirmEmail}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
            required
          />
        </label>

        {/* Hasło */}
        <label className="block">
          <span className="text-gray-700">Hasło</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
            required
          />
        </label>

        {/* Potwierdzenie hasła */}
        <label className="block">
          <span className="text-gray-700">Potwierdź hasło</span>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
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
          </select>
        </label>

        {/* Pola specyficzne dla ról */}
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
              <span>Posiadam licencję sędziego</span>
            </label>
          </>
        )}

        {formData.role === "organizator" && (
          <>
            <label className="block">
              <span className="text-gray-700">Nazwa klubu / organizacji</span>
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
          </>
        )}

        {/* Pytanie pomocnicze */}
        <label className="block">
          <span className="text-gray-700 font-semibold">
            Pytanie pomocnicze: Ile to jest 2 + 3?
          </span>
          <input
            type="text"
            name="helperAnswer"
            value={formData.helperAnswer}
            onChange={handleChange}
            placeholder="Twoja odpowiedź"
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
            required
          />
        </label>

        {/* RODO */}
        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            name="rodo"
            checked={formData.rodo}
            onChange={handleChange}
            className="h-5 w-5 text-blue-400 border-gray-300 rounded cursor-pointer mt-1"
            required
          />
          <span className="text-xs text-gray-600">
            Wyrażam zgodę na przetwarzanie moich danych osobowych przez{" "}
            <strong>Smart Web Solutions Mateusz Biały</strong> w celach
            utworzenia konta i realizacji zadań turniejowych.
          </span>
        </label>

        <button
          type="submit"
          className="w-full bg-blue-300 text-white py-2 rounded hover:bg-blue-400 transition cursor-pointer"
        >
          Zarejestruj się
        </button>
      </form>
    </AuthLayout>
  );
}
