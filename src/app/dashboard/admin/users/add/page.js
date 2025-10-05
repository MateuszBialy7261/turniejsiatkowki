"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddUserPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    phone: "",
    club_name: "",
    nip: "",
    address: "",
    age: "",
    license: false,
  });
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Błąd dodawania użytkownika.");

      setMessage({ type: "success", text: "✅ Użytkownik został dodany i otrzymał e-mail aktywacyjny." });
      setTimeout(() => router.push("/dashboard/admin/users"), 2500);
    } catch (err) {
      setMessage({ type: "error", text: "❌ " + err.message });
    }
  };

  return (
    <main className="p-8 max-w-3xl mx-auto bg-white shadow-md rounded-xl">
      <h1 className="text-3xl font-bold mb-6">➕ Dodaj nowego użytkownika</h1>

      {message && (
        <div
          className={`p-3 mb-4 rounded shadow ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label>
            <span className="block text-gray-700">Imię</span>
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </label>
          <label>
            <span className="block text-gray-700">Nazwisko</span>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </label>
        </div>

        <label>
          <span className="block text-gray-700">Adres e-mail</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </label>

        <label>
          <span className="block text-gray-700">Rola</span>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Wybierz rolę</option>
            <option value="sedzia">Sędzia</option>
            <option value="organizator">Organizator</option>
            <option value="admin">Administrator</option>
          </select>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="license"
            checked={form.license}
            onChange={handleChange}
            className="h-5 w-5 border-gray-300 rounded"
          />
          <span>Czy posiada licencję?</span>
        </label>

        <button
          type="submit"
          className="bg-blue-400 text-white py-2 px-6 rounded hover:bg-blue-500 transition"
        >
          Utwórz użytkownika
        </button>
      </form>
    </main>
  );
}
