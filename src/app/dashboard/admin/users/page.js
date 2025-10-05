"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminUsersListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // guard
  useEffect(() => {
    (async () => {
      try {
        const m = await (await fetch("/api/me", { credentials: "include" })).json();
        if (!m.loggedIn || m.role !== "admin") {
          window.location.href = "/";
          return;
        }
      } catch {
        window.location.href = "/";
        return;
      }
      // load users
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
    })();
  }, []);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">👥 Zarządzanie użytkownikami</h1>
        <Link
          href="/dashboard/admin/users/add"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
        >
          ➕ Dodaj użytkownika
        </Link>
      </div>

      {loading && <p className="text-gray-500">⏳ Ładowanie…</p>}
      {err && <div className="p-3 bg-red-100 text-red-800 rounded mb-4">❌ {err}</div>}

      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-100 text-gray-800">
            <tr>
              <th className="py-3 px-4">Imię</th>
              <th className="py-3 px-4">Nazwisko</th>
              <th className="py-3 px-4">E-mail</th>
              <th className="py-3 px-4">Rola</th>
              <th className="py-3 px-4">Aktywne</th>
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
                    {u.role === "admin" ? (
                      <span className="text-red-600">Administrator</span>
                    ) : u.role === "organizator" ? (
                      <span className="text-blue-600">Organizator</span>
                    ) : (
                      <span className="text-green-600">Sędzia</span>
                    )}
                  </td>
                  <td className="py-3 px-4">{u.is_active ? "✔️" : "—"}</td>
                  <td className="py-3 px-4 text-center">
                    <Link
                      href={`/dashboard/admin/users/${u.id}`}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Szczegóły / Edytuj
                    </Link>
                    {/* jeśli masz już endpoint DELETE, możesz dodać też przycisk usuń tutaj */}
                  </td>
                </tr>
              ))
            ) : (
              !loading &&
              !err && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
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
