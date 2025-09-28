"use client";
import { useState, useEffect } from "react";
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3 && value.length <= 6) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    } else if (value.length > 6) {
      value = value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6, 9);
    }
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.email !== formData.confirmEmail) {
      setMessage({ type: "error", text: "❌ Adresy e-mail nie są takie same." });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "❌ Hasła nie są takie same." });
      return;
    }
    if (formData.helperAnswer.trim() !== "5") {
      setMessage({ type: "error", text: "❌ Błędna odpowiedź na pytanie pomocnicze." });
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
          text: "✅ Konto zostało zarejestrowane. Sprawdź e-mail, aby aktywować konto.",
        });
      } else {
        setMessage({ type: "error", text: "❌ Błąd: " + data.error });
      }
    } catch {
      setMessage({ type: "error", text: "❌ Wystąpił błąd połączenia." });
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Rejestracja</h2>

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

        {/* tu idą wszystkie pola formularza tak jak masz */}
        {/* ... */}

        <button
          type="submit"
          className="w-full bg-blue-300 text-white py-2 rounded hover:bg-blue-400 transition cursor-pointer"
        >
          Zarejestruj się
        </button>

        <p className="text-sm text-center mt-4">
          Masz już konto?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Zaloguj się tutaj
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
