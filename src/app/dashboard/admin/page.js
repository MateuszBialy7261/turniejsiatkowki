"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [message, setMessage] = useState(null);

  // Pobierz użytkowników
  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users", { credentials: "include" });
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditedUser({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🧠 zapis zmian po kliknięciu
  const handleSave = async (id) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedUser),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "✅ Zaktualizowano dane użytkownika." });
        setEditingUser(null);
        fetchUsers();
      } else {
        const err = await res.json();
        setMessage({ type: "error", text: "❌ " + err.error });
      }
    } catch {
      setMessage({ type: "error", text: "❌ Błąd połączenia." });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Na pewno chcesz usunąć tego użytkownika?")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const handleResetPassword = async (id) => {
    if (!confirm("Zresetować hasło tego użytkownika?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setMessage({ type: "success", text: "✅ Hasło zresetowane i wysłane e-mailem." });
    } else {
      setMessage({ type: "error", text: "❌ " + data.error });
    }
  };

  const handleAddUser = async () => {
    const first_name = prompt("Imię:");
    const last_name = prompt("Nazwisko:");
    const email = prompt("E-mail:");
    const role = prompt("Rola (sedzia / organizator / admin):", "sedzia");

    if (!first_name || !last_name || !email) return;

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name, last_name, email, role }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage({ type: "success", text: "✅ Użytkownik dodany i e-mail wysłany." });
      fetchUsers();
    } else {
      setMessage({ type: "error", text: "❌ " + data.error });
    }
  };

  return (
    <main className="flex flex-col items-center p-8 w-full text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Panel administratora</h1>

      {message && (
        <div
          className={`mb-6 p-3 rounded shadow-md w-full max-w-3xl text-center ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
          <button
            className="float-right font-bold"
            onClick={() => setMessage(null)}
          >
            ×
          </button>
        </div>
      )}

      <button
        onClick={handleAddUser}
        className="mb-6 bg-blue-400 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded transition"
      >
        ➕ Dodaj użytkownika
      </button>

      {loading ? (
        <p>Ładowanie...</p>
      ) : (
        <div className="w-full max-w-5xl overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Imię</th>
                <th className="p-3 text-left">Nazwisko</th>
                <th className="p-3 text-left">E-mail</th>
                <th className="p-3 text-left">Rola</th>
                <th className="p-3 text-center">Aktywne</th>
                <th className="p-3 text-center">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  {editingUser === user.id ? (
                    <>
                      <td className="p-2">
                        <input
                          name="first_name"
                          value={editedUser.first_name || ""}
                          onChange={handleChange}
                          className="border rounded p-1 w-full"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          name="last_name"
                          value={editedUser.last_name || ""}
                          onChange={handleChange}
                          className="border rounded p-1 w-full"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          name="email"
                          value={editedUser.email || ""}
                          onChange={handleChange}
                          className="border rounded p-1 w-full"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          name="role"
                          value={editedUser.role || ""}
                          onChange={handleChange}
                          className="border rounded p-1 w-full"
                        >
                          <option value="sedzia">Sędzia</option>
                          <option value="organizator">Organizator</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={editedUser.is_active}
                          onChange={handleChange}
                        />
                      </td>
                      <td className="text-center space-x-2">
                        <button
                          onClick={() => handleSave(user.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          💾 Zapisz
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                        >
                          ❌ Anuluj
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2">{user.first_name}</td>
                      <td className="p-2">{user.last_name}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2 capitalize">{user.role}</td>
                      <td className="text-center">
                        {user.is_active ? "✅" : "❌"}
                      </td>
                      <td className="text-center space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-500"
                        >
                          ✏️ Edytuj
                        </button>
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                        >
                          🔑 Resetuj hasło
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500"
                        >
                          🗑️ Usuń
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
