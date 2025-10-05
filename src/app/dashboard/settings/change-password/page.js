"use client";
import { useState } from "react";
import Link from "next/link";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [msg, setMsg] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setMsg({ type: "error", text: "❌ Hasła nie są takie same" });
      return;
    }

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: form.oldPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: data.message });
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMsg({ type: "error", text: "❌ " + err.message });
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🔑 Zmień hasło</h1>

      {msg && (
        <div
          className={`p-3 rounded mb-4 ${
            msg.type === "success" ? "bg-[#d4edf8] text-black" : "bg-red-100 text-red-800"
          }`}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md p-6 rounded-xl">
        <label className="block">
          <span>Stare hasło</span>
          <input
            type="password"
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded-md p-2"
          />
        </label>

        <label className="block">
          <span>Nowe hasło</span>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded-md p-2"
          />
        </label>

        <label className="block">
          <span>Powtórz nowe hasło</span>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded-md p-2"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold"
        >
          Zapisz nowe hasło
        </button>

        <Link href="/dashboard/settings" className="block text-center text-blue-500 hover:underline mt-4">
          ← Wróć do ustawień
        </Link>
      </form>
    </main>
  );
}
