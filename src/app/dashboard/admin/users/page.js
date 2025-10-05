"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminUsersListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Błąd pobierania");
        setUsers(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">👥 Zarządzanie użytkownikami</h1>

      {loading && <p className="text-gray-500">⏳ Ładowanie…</p>}
      {err && (
        <div className="p-3 bg-red-100 text-red-800 rounded mb-4">
          ❌ {err}
        </div>
      )}

      <Link
      href="/dashboard/admin/users/add"
      className="inline-block mb-4 bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
    >
      ➕ Dodaj użytkownika
    </Link>


      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-100 text-gray-800">
            <tr>
              <th className="py-3 px-4">Imię</th>
              <th className="py-3 px-4">Nazwisko</th>
              <th className="py-3 px-4">E-mail</th>
              <th className="py-3 px-4">Rola</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{u.first_name}</td>
                  <td className="py-3 px-4">{u.last_name}</td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4 font-medium">
                    {u.role === "admin" && (
                      <span className="text-red-600">Administrator</span>
                    )}
                    {u.role === "organizator" && (
                      <span className="text-blue-600">Organizator</span>
                    )}
                    {u.role === "sedzia" && (
                      <span className="text-green-600">Sędzia</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {u.is_active ? (
                      <span className="text-green-600 font-semibold">
                        Aktywne
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Nieaktywne
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Link
                      href={`/dashboard/admin/users/${u.id}`}
                      className="text-blue-500 hover:underline font-semibold"
                    >
                      Szczegóły / Edytuj
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              !loading &&
              !err && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500"
                  >
                    Brak użytkowników w bazie.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
