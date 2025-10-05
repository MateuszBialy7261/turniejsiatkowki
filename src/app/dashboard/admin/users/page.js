"use client";
import { useEffect, useMemo, useState } from "react";

export default function AdminUsersPage() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);

  // Form dodawania
  const [openAdd, setOpenAdd] = useState(false);
  const [addData, setAddData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "sedzia",
    is_active: true,
  });
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!d.loggedIn || d.role !== "admin") {
          window.location.href = "/login";
        } else {
          setMe(d);
        }
      })
      .catch(() => (window.location.href = "/login"));
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?q=${encodeURIComponent(q)}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.items || []);
        setCount(data.count || 0);
      } else {
        setMsg({ type: "error", text: data.error || "Nie udało się pobrać użytkowników." });
      }
    } catch {
      setMsg({ type: "error", text: "Błąd pobierania." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (me) fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]);

  const onAddChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const submitAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(addData),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: "Użytkownik dodany." });
        setOpenAdd(false);
        setAddData({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          role: "sedzia",
          is_active: true,
        });
        fetchUsers();
      } else {
        setMsg({ type: "error", text: data.error || "Błąd dodawania." });
      }
    } catch {
      setMsg({ type: "error", text: "Błąd połączenia przy dodawaniu." });
    }
  };

  const updateUser = async (id, patch) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: "Zapisano zmiany." });
        setUsers((prev) => prev.map((u) => (u.id === id ? data.user : u)));
      } else {
        setMsg({ type: "error", text: data.error || "Błąd zapisu." });
      }
    } catch {
      setMsg({ type: "error", text: "Błąd połączenia przy edycji." });
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Na pewno usunąć użytkownika?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: "Użytkownik usunięty." });
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setCount((c) => Math.max(0, c - 1));
      } else {
        setMsg({ type: "error", text: data.error || "Błąd usuwania." });
      }
    } catch {
      setMsg({ type: "error", text: "Błąd połączenia przy usuwaniu." });
    }
  };

  const roleLabel = useMemo(
    () => (role) =>
      role === "sedzia" ? "Sędzia" : role === "organizator" ? "Organizator" : "Administrator",
    []
  );

  if (!me) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Ładowanie…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      <div className="bg-white shadow rounded-xl p-4 mb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold">Zarządzanie użytkownikami</h1>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Szukaj (imię, nazwisko, e-mail)…"
            className="border rounded-md p-2 w-64"
          />
          <button
            onClick={fetchUsers}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            Szukaj
          </button>
          <button
            onClick={() => setOpenAdd((v) => !v)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
          >
            {openAdd ? "Zamknij" : "Dodaj użytkownika"}
          </button>
        </div>
      </div>

      {msg && (
        <div
          className={`mb-4 p-3 rounded relative shadow-md ${
            msg.type === "success" ? "bg-[#d4edf8] text-black" : "bg-red-100 text-red-800"
          }`}
        >
          <span>{msg.text}</span>
          <button
            onClick={() => setMsg(null)}
            className="absolute top-2 right-3 font-bold"
            aria-label="zamknij"
          >
            ×
          </button>
        </div>
      )}

      {openAdd && (
        <form
          onSubmit={submitAdd}
          className="bg-white shadow rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm text-gray-700">Imię</label>
            <input
              name="first_name"
              value={addData.first_name}
              onChange={onAddChange}
              className="mt-1 w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Nazwisko</label>
            <input
              name="last_name"
              value={addData.last_name}
              onChange={onAddChange}
              className="mt-1 w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">E-mail</label>
            <input
              type="email"
              name="email"
              value={addData.email}
              onChange={onAddChange}
              className="mt-1 w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Hasło</label>
            <input
              type="password"
              name="password"
              value={addData.password}
              onChange={onAddChange}
              className="mt-1 w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Rola</label>
            <select
              name="role"
              value={addData.role}
              onChange={onAddChange}
              className="mt-1 w-full border rounded-md p-2"
            >
              <option value="sedzia">Sędzia</option>
              <option value="organizator">Organizator</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="is_active"
              type="checkbox"
              name="is_active"
              checked={addData.is_active}
              onChange={onAddChange}
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Konto aktywne
            </label>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              Dodaj
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2">Imię</th>
              <th className="text-left px-4 py-2">Nazwisko</th>
              <th className="text-left px-4 py-2">E-mail</th>
              <th className="text-left px-4 py-2">Rola</th>
              <th className="text-left px-4 py-2">Aktywne</th>
              <th className="text-left px-4 py-2">Utworzono</th>
              <th className="text-left px-4 py-2">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-4" colSpan={7}>
                  Ładowanie…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td className="px-4 py-4" colSpan={7}>
                  Brak wyników.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-2">{u.first_name}</td>
                  <td className="px-4 py-2">{u.last_name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">
                    <select
                      value={u.role}
                      onChange={(e) => updateUser(u.id, { role: e.target.value })}
                      className="border rounded-md p-1"
                    >
                      <option value="sedzia">Sędzia</option>
                      <option value="organizator">Organizator</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => updateUser(u.id, { is_active: !u.is_active })}
                      className={`px-3 py-1 rounded-lg text-white ${
                        u.is_active ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 hover:bg-gray-500"
                      }`}
                    >
                      {u.is_active ? "Aktywne" : "Nieaktywne"}
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    {u.created_at
                      ? new Date(u.created_at).toLocaleString("pl-PL")
                      : "-"}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {/* TODO: Pełna edycja w modal/stronie – etap 2 */}
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="px-4 py-3 text-sm text-gray-600">
          Razem: {count}
        </div>
      </div>
    </div>
  );
}
