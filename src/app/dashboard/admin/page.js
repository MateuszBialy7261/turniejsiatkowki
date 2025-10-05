"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import WelcomeBar from "@/components/WelcomeBar";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.loggedIn && data?.role === "admin") setUser(data);
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {user && <WelcomeBar firstName={user.firstName} role={user.role} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <Link
          href="/dashboard/admin/users"
          className="block bg-white rounded-2xl shadow-md p-8 text-center text-2xl font-bold hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300"
        >
          👥 Zarządzanie użytkownikami
        </Link>

        <Link
          href="#"
          className="block bg-white rounded-2xl shadow-md p-8 text-center text-2xl font-bold hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300"
        >
          🏐 Zarządzanie turniejami
        </Link>

        <Link
          href="#"
          className="block bg-white rounded-2xl shadow-md p-8 text-center text-2xl font-bold hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300"
        >
          ⚙️ Ustawienia systemowe
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
        <h2 className="text-xl font-bold mb-2">Wkrótce więcej funkcji</h2>
        <p className="text-gray-600">
          Tutaj pojawią się kolejne narzędzia administracyjne, m.in. logi,
          statystyki i zarządzanie treściami.
        </p>
      </div>
    </main>
  );
}
