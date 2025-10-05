"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({ ...user, [name]: type === "checkbox" ? checked : value });
  };

  const handleSave = async () => {
    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  if (!user) return <p className="p-6">Ładowanie danych użytkownika...</p>;

  return (
    <div className="p-6 space-y-4">
      <button
        onClick={() => router.push("/dashboard/admin/users")}
        className="text-blue-500 hover:underline"
      >
        ← Powrót do listy użytkowników
      </button>

      <h1 className="text-2xl font-bold mb-4">
        ✏️ Edycja użytkownika: {user.first_name} {user.last_name}
      </h1>

      {message && (
        <div className="p-3 bg-blue-100 border rounded text-center">{message}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label>
          Imię
          <input
            name="first_name"
            value={user.first_name || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded"
          />
        </label>
        <label>
          Nazwisko
          <input
            name="last_name"
            value={user.last_name || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded"
          />
        </label>
        <label>
          E-mail
          <input
            name="email"
            value={user.email || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded"
          />
        </label>
        <label>
          Telefon
          <input
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded"
          />
        </label>
        <label>
          Adres
          <input
            name="address"
            value={user.address || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded"
          />
        </label>
        <label>
          Klub
          <input
            name="club_name"
            value={user.club_name || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded"
          />
        </label>
        <label>
          NIP
          <input
            name="nip"
            value={user.nip || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded"
          />
        </label>
        <label>
          Wiek
          <input
            type="number"
            name="age"
            value={user.age || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded"
          />
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="license"
            checked={user.license || false}
            onChange={handleChange}
          />
          Posiada licencję sędziego
        </label>
        <label>
          Rola
          <select
            name="role"
            value={user.role || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded"
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
            checked={user.is_active || false}
            onChange={handleChange}
          />
          Konto aktywne
        </label>
      </div>

      <button
        onClick={handleSave}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
      >
        💾 Zapisz zmiany
      </button>
    </div>
  );
}
