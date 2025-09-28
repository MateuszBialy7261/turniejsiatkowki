"use client";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("📡 Wysyłam do /api/login:", formData);

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("📡 Odpowiedź HTTP:", res.status);

      const data = await res.json();
      console.log("🔎 API /api/login response:", data);

      if (res.ok) {
        setMessage({
          type: "success",
          text: "✅ Zalogowano pomyślnie! Przekierowanie...",
        });

        setTimeout(() => {
          window.location.href = `/dashboard/${data.role}`;
        }, 2000);
      } else {
        setMessage({ type: "error", text: "❌ " + data.error });
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setMessage({ type: "error", text: "❌ Błąd połączenia." });
    }
  };

  useEffect(() => {
    if (message && message.type !== "success") {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex justify-center items-start pt-20 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 sm:p-8 max-w-md w-full space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Logowanie</h2>

        {message && (
          <div
            className={`p-3 rounded relative shadow-md ${
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

        <button
          type="submit"
          className="w-full bg-blue-300 text-white py-2 rounded hover:bg-blue-400 transition cursor-pointer"
        >
          Zaloguj się
        </button>

        <p className="text-sm text-center mt-4">
          Nie masz jeszcze konta?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Zarejestruj się tutaj
          </a>
        </p>
      </form>
    </div>
  );
}
