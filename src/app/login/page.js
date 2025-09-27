"use client";

import { useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dane logowania:", formData);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Logowanie</h2>

        {/* Email */}
        <label className="block">
          <span className="text-gray-700">Adres e-mail</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-300 focus:border-blue-300"
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
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-300 focus:border-blue-300"
            required
          />
        </label>

        {/* Przycisk logowania */}
        <button
          type="submit"
          className="w-full bg-blue-300 text-white py-2 rounded hover:bg-blue-400 transition cursor-pointer"
        >
          Zaloguj się
        </button>

        {/* Link do rejestracji */}
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
