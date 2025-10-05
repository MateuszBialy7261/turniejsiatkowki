"use client";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
  });
  const [message, setMessage] = useState(null);

  // 🔹 Pobieranie listy użytkowników
  useEffect(() => {
    fetch("/api/admin/users", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("❌ Fetch users error:", err));
  }, []);

  // 🔹 Dodawanie nowego użytkownika
  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!newUser.first_name || !newUser.last_name || !newUser.email || !newUser.role) {
      setMessage({ type: "error", text: "❌ Wypełnij wszystkie pola." });
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "✅ Użytkownik dodany pomyślnie. Hasło wysłano e-mailem.",
        });
        setUsers([...users, data.user]);
        setNewUser({ first_name: "", last_name: "", email: "", role: "" });
      } else {
        setMessage({ type: "error", text: "❌ " + data.error });
      }
    } catch {
      setMessage({ type: "error", text: "❌ Błąd połączenia z serwerem." });
    }
  };

  // 🔹 Usuwanie użytkownika
  const handleDelete = async (id) => {
    if (!confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
      } else {
        const err = await res.json();
        alert("❌ Błąd: " + err.error);
      }
    } catch {
      alert("❌ Błąd połączenia z serwerem.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold mb-6">👥 Zarządzanie użytkownikami</h1>

      {/* Komunikat */}
      {message && (
        <div
          className={`mb-4 p-3 rounded relative shadow-md ${
            message.type === "success"
              ? "bg-[#d4edf8] text-black"
              : "bg-red-100 text-red-800"
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            type="button"
            className="absolute top-2 right-2 text-lg font-bold hover:opacity-70"
          >
            ×
          </button>
        </div>
      )}

      {/* Formularz dodawania */}
      <form
        onSubmit={handleAddUser}
        className="bg-white rounded-xl shadow-lg p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <input
          type="text"
          placeholder="Imię"
          value={newUser.first_name}
          onChange={(e) =>
            setNewUser({ ...newUser, first_name: e.target.value })
          }
          className="border p-2 rounded-md w-full"
          required
        />
        <input
          type="text"
          placeholder="Nazwisko"
          value={newUser.last_name}
          onChange={(e) =>
            setNewUser({ ...newUser, last_name: e.target.value })
          }
          className="border p-2 rounded-md w-full"
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border p-2 rounded-md w-full"
          required
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="border p-2 rounded-md w-full"
          required
        >
          <option value="">Rola</option>
          <option value="sedzia">Sędzia</option>
          <option value="organizator">Organizator</option>
          <option value="admin">Administrator</option>
        </select>

        <button
          type="submit"
          className="col-span-full bg-blue-300 text-white font-semibold py-2 rounded hover:bg-blue-400 transition"
        >
          ➕ Dodaj użytkownika
        </button>
      </form>

      {/* Lista użytkowników */}
      <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Imię</th>
              <th className="border p-2 text-left">Nazwisko</th>
              <th className="border p-2 text-left">E-mail</th>
              <th className="border p-2 text-left">Rola</th>
              <th className="border p-2 text-left">Aktywne</th>
              <th className="border p-2 text-center">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{u.first_name}</td>
                  <td className="p-2">{u.last_name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2 capitalize">{u.role}</td>
                  <td className="p-2 text-center">
                    {u.is_active ? "✅" : "❌"}
                  </td>
                  <td className="p-2 text-center space-x-2">
                    <a
                      href={`/dashboard/admin/users/${u.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Edytuj
                    </a>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-red-600 hover:underline"
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center text-gray-500 p-4 italic"
                >
                  Brak użytkowników w bazie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
