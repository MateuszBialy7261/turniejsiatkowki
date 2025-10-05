"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "organizator",
  });
  const [message, setMessage] = useState(null);

  // Pobierz użytkowników
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) setUsers(data);
      else console.error(data.error);
    } catch (err) {
      console.error("Błąd pobierania użytkowników:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Obsługa formularza
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Dodaj użytkownika
  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!form.first_name || !form.last_name || !form.email) {
      setMessage({ type: "error", text: "❌ Wypełnij wszystkie pola." });
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "✅ Użytkownik dodany! Na e-mail wysłano dane logowania.",
        });
        setForm({
          first_name: "",
          last_name: "",
          email: "",
          role: "organizator",
        });
        fetchUsers(); // odśwież listę
      } else {
        setMessage({ type: "error", text: "❌ " + data.error });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "❌ Wystąpił błąd połączenia." });
    }
  };

  // Zmień dane użytkownika (np. e-mail, imię, nazwisko, rola, aktywność)
  const handleUpdateUser = async (id, field, value) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error("Błąd aktualizacji:", err);
    }
  };

  // Resetuj hasło
  const handleResetPassword = async (id) => {
    if (!confirm("Na pewno zresetować hasło użytkownika?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: "✅ Hasło zresetowane i wysłane e-mailem.",
        });
      } else {
        setMessage({ type: "error", text: "❌ " + data.error });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "❌ Błąd połączenia." });
    }
  };

  // Usuń użytkownika
  const handleDelete = async (id) => {
    if (!confirm("Czy na pewno chcesz usunąć użytkownika?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchUsers();
        setMessage({ type: "success", text: "✅ Użytkownik został usunięty." });
      }
    } catch (err) {
      console.error("Błąd usuwania:", err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">👥 Zarządzanie użytkownikami</h1>

      {/* Komunikaty */}
      {message && (
        <div
          className={`mb-4 p-3 rounded relative shadow-md ${
            message.type === "success"
              ? "bg-green-100 text-green-900"
              : "bg-red-100 text-red-800"
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="absolute top-2 right-3 text-lg font-bold hover:opacity-70"
          >
            ×
          </button>
        </div>
      )}

      {/* Formularz dodania użytkownika */}
      <form
        onSubmit={handleAddUser}
        className="bg-white shadow-md rounded-xl p-4 mb-8 space-y-4"
      >
        <h2 className="text-xl font-semibold mb-2">➕ Dodaj nowego użytkownika</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="Imię"
            className="border rounded-md p-2"
            required
          />
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Nazwisko"
            className="border rounded-md p-2"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="E-mail"
            className="border rounded-md p-2"
            required
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border rounded-md p-2"
            required
          >
            <option value="organizator">Organizator</option>
            <option value="sedzia">Sędzia</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded transition"
        >
          ➕ Dodaj użytkownika
        </button>
      </form>

      {/* Lista użytkowników */}
      <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">📋 Lista użytkowników</h2>

        {loading ? (
          <p>Ładowanie...</p>
        ) : users.length === 0 ? (
          <p>Brak użytkowników w systemie.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Imię</th>
                <th className="p-2 border">Nazwisko</th>
                <th className="p-2 border">E-mail</th>
                <th className="p-2 border">Rola</th>
                <th className="p-2 border">Aktywne</th>
                <th className="p-2 border">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    <input
                      className="w-full p-1 border rounded"
                      value={u.first_name || ""}
                      onChange={(e) =>
                        handleUpdateUser(u.id, "first_name", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      className="w-full p-1 border rounded"
                      value={u.last_name || ""}
                      onChange={(e) =>
                        handleUpdateUser(u.id, "last_name", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      className="w-full p-1 border rounded"
                      value={u.email || ""}
                      onChange={(e) =>
                        handleUpdateUser(u.id, "email", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2 border">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleUpdateUser(u.id, "role", e.target.value)
                      }
                      className="border rounded p-1"
                    >
                      <option value="organizator">Organizator</option>
                      <option value="sedzia">Sędzia</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </td>
                  <td className="p-2 border text-center">
                    <input
                      type="checkbox"
                      checked={u.is_active}
                      onChange={(e) =>
                        handleUpdateUser(u.id, "is_active", e.target.checked)
                      }
                    />
                  </td>
                  <td className="p-2 border text-center space-x-2">
                    <button
                      onClick={() => handleResetPassword(u.id)}
                      className="bg-yellow-300 hover:bg-yellow-400 text-white py-1 px-2 rounded text-sm"
                    >
                      🔑 Resetuj hasło
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="bg-red-400 hover:bg-red-500 text-white py-1 px-2 rounded text-sm"
                    >
                      🗑 Usuń
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
