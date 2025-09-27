"use client";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Walidacja emaila
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage({ type: "error", text: "❌ Podaj poprawny adres e-mail." });
      return;
    }

    if (!formData.password) {
      setMessage({ type: "error", text: "❌ Wpisz hasło." });
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.status === "inactive") {
          setMessage({
            type: "error",
            text: "❌ Twoje konto nie jest jeszcze aktywne. Sprawdź skrzynkę e-mail i kliknij link aktywacyjny.",
          });
        } else {
          setMessage({
            type: "success",
            text: "✅ Zalogowano pomyślnie! Przekierowuję...",
          });
          // np. w przyszłości:
          // router.push("/panel")
        }
      } else {
        if (data.error === "not_found") {
          setMessage({
            type: "error",
            text: (
              <>
                ❌ Nie znaleziono konta.{" "}
                <a
                  href="/register"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  Zarejestruj się tutaj
                </a>
                .
              </>
            ),
          });
        } else {
          setMessage({ type: "error", text: "❌ Błędny login lub hasło." });
        }
      }
    } catch (err) {
      setMessage({ type: "error", text: "❌ Błąd połączenia z serwerem." });
    }
  };

  // autozamknięcie komunikatu po 5s
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4">Logowanie</h2>

        {/* Komunikaty */}
        {message && (
          <div
            className={`mb-4 p-3 rounded relative shadow-md ${
              message.type === "success"
                ? "bg-[#d4edf8] text-black"
                : "bg-red-100 text-red-800"
            }`}
          >
            <span>{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              type="button"
              className="absolute top-2 right-2 text-lg font-bold hover:opacity-70"
            >
              ×
            </button>
          </div>
        )}

        {/* Email */}
        <label className="block">
          <span className="text-gray-700">E-mail</span>
          <input
            type="email"
            name="email"
            value={formData.email}
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

        {/* Przycisk */}
        <button
          type="submit"
          className="w-full bg-blue-300 text-white py-2 rounded hover:bg-blue-400 transition cursor-pointer"
        >
          Zaloguj się
        </button>

        <p className="text-sm text-center mt-4">
          Nie masz konta?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Załóż je tutaj
          </a>
        </p>
      </form>
    </div>
  );
}
