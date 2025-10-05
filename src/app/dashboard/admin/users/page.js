"use client";
import { useEffect, useState } from "react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "sedzia",
  });

  const [editingUser, setEditingUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});

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

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "✅ Użytkownik dodany i e-mail wysłany." });
        setNewUser({ first_name: "", last_name: "", email: "", role: "sedzia" });
        fetchUsers();
      } else {
        setMessage({ type: "error", text: "❌ " + data.error });
      }
    } catch {
      setMessage({ type: "error", text: "❌ Błąd połączenia." });
    }
  };

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

  const handleChange = (e, setState) => {
    const { name, value, type, checked } = e.target;
    setState((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

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

  return (
    <main className="flex flex-col items-center p-8 bg-[#f5f5f5] min-h-screen text-gray-800">
      <h1 className="text-3xl font-bold mb-6">👥 Zarządzanie użytkownikami</h1>

      {message && (
        <div
          className={`mb-6 p-3 rounded shadow-md w-full max-w-3xl text-center ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
          <button onClick={() => setMessage(null)} className="float-right font-bold">
            ×
          </button>
        </div>
      )}

      {/* Formularz dodawania użytkownika */}
      <form
        onSubmit={handleAddUser}
        className="bg-white rounded-xl shadow-md p-6 mb-8 w-full max-w-3xl space-y-4"
      >
        <h2 className="text-xl font-bold mb-2">➕ Dodaj nowego użytkownika</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="first_name"
            value={newUser.first_name}
            onChange={(e) => handleChange(e, setNewUser)}
            placeholder="Imię"
            className="border rounded p-2"
            required
          />
          <input
            name="last_name"
            value={newUser.last_name}
            onChange={(e) => handleChange(e, setNewUser)}
            placeholder="Nazwisko"
            className="border rounded p-2"
            required
          />
          <input
            name="email"
            type="email"
            value={newUser.email}
            onChange={(e) => handleChange(e, setNewUser)}
            placeholder="E-mail"
            className="border rounded p-2 sm:col-span-2"
            required
          />
          <select
            name="role"
            value={newUser.role}
            onChange={(e) => handleChange(e, setNewUser)}
            className="border rounded p-2 sm:col-span-2"
          >
            <option value="sedzia">Sędzia</option>
            <option value="organizator">Organizator</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-500 transition"
        >
          Dodaj użytkownika
        </button>
      </form>

      {/* Lista użytkowników */}
      <div className="w-full max-w-5xl overflow-x-auto">
        {loading ? (
          <p>Ładowanie...</p>
        ) : (
          <table className="w-full border-collapse bg-white shadow-md rounded-xl">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Imię</th>
                <th className="p-3">Nazwisko</th>
                <th className="p-3">E-mail</th>
                <th className="p-3">Rola</th>
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
                          onChange={(e) => handleChange(e, setEditedUser)}
                          className="border rounded p-1 w-full"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          name="last_name"
                          value={editedUser.last_name || ""}
                          onChange={(e) => handleChange(e, setEditedUser)}
                          className="border rounded p-1 w-full"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          name="email"
                          value={editedUser.email || ""}
                          onChange={(e) => handleChange(e, setEditedUser)}
                          className="border rounded p-1 w-full"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          name="role"
                          value={editedUser.role || ""}
                          onChange={(e) => handleChange(e, setEditedUser)}
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
                          onChange={(e) => handleChange(e, setEditedUser)}
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
                      <td className="text-center">{user.is_active ? "✅" : "❌"}</td>
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
                          🔑 Resetuj
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
        )}
      </div>
    </main>
  );
}
