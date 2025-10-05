"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AdminUserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/admin/users/${id}`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Błąd pobierania");
        setUser(data);
      } catch (e) {
        setErr(e.message);
      }
    }
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Błąd zapisu");
      setMessage("✅ Zapisano zmiany.");
    } catch (e) {
      setMessage("❌ " + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (err) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <button
          onClick={() => router.push("/dashboard/admin/users")}
          className="text-blue-500 hover:underline"
        >
          ← Powrót
        </button>
        <div className="p-3 bg-red-100 text-red-800 rounded mt-4">❌ {err}</div>
      </main>
    );
  }

  if (!user) {
    return <main className="p-6">⏳ Wczytywanie…</main>;
  }

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-4">
      <button
        onClick={() => router.push("/dashboard/admin/users")}
        className="text-blue-500 hover:underline"
      >
        ← Powrót do listy użytkowników
      </button>

      <h1 className="text-2xl font-bold">
        ✏️ Edycja: {user.first_name} {user.last_name}
      </h1>

      {message && (
        <div
          className={`p-3 rounded ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label>
          <span className="text-gray-700">Imię</span>
          <input
            name="first_name"
            value={user.first_name || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded mt-1"
          />
        </label>

        <label>
          <span className="text-gray-700">Nazwisko</span>
          <input
            name="last_name"
            value={user.last_name || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded mt-1"
          />
        </label>

        <label className="md:col-span-2">
          <span className="text-gray-700">E-mail</span>
          <input
            name="email"
            type="email"
            value={user.email || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded mt-1"
          />
        </label>

        <label>
          <span className="text-gray-700">Telefon</span>
          <input
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded mt-1"
          />
        </label>

        <label className="md:col-span-2">
          <span className="text-gray-700">Adres</span>
          <input
            name="address"
            value={user.address || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded mt-1"
          />
        </label>

        <label className="md:col-span-2">
          <span className="text-gray-700">Klub</span>
          <input
            name="club_name"
            value={user.club_name || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded mt-1"
          />
        </label>

        <label>
          <span className="text-gray-700">NIP</span>
          <input
            name="nip"
            value={user.nip || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded mt-1"
          />
        </label>

        <label>
          <span className="text-gray-700">Wiek</span>
          <input
            type="number"
            name="age"
            value={user.age ?? ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded mt-1"
          />
        </label>

        <label className="flex items-center gap-2 md:col-span-2">
          <input
            type="checkbox"
            name="license"
            checked={!!user.license}
            onChange={handleChange}
          />
          <span>Posiada licencję sędziego</span>
        </label>

        <label>
          <span className="text-gray-700">Rola</span>
          <select
            name="role"
            value={user.role || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded mt-1"
          >
            <option value="sedzia">Sędzia</option>
            <option value="organizator">Organizator</option>
            <option value="admin">Administrator</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={!!user.is_active}
            onChange={handleChange}
          />
          <span>Konto aktywne</span>
        </label>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-2 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition disabled:opacity-60"
      >
        💾 Zapisz zmiany
      </button>
    </main>
  );
}
