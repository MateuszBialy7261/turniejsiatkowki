"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("❌ Błąd pobierania użytkowników:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👥 Zarządzanie użytkownikami</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Link
            key={user.id}
            href={`/dashboard/admin/users/${user.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-blue-50 p-4 transition"
          >
            <h2 className="text-lg font-semibold">{user.first_name} {user.last_name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm mt-2">
              <span
                className={`font-semibold ${
                  user.role === "admin"
                    ? "text-red-600"
                    : user.role === "organizator"
                    ? "text-blue-600"
                    : "text-green-600"
                }`}
              >
                {user.role}
              </span>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
