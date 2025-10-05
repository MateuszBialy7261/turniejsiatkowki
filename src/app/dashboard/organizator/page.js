"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import WelcomeBar from "@/components/WelcomeBar";

export default function OrganizatorDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        if (data.loggedIn) setUser(data);
      } catch {
        setUser(null);
      }
    }
    loadUser();
  }, []);

  if (!user) return <p className="text-center mt-10 text-gray-500">Ładowanie...</p>;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <WelcomeBar firstName={user.first_name} role={user.role} />

      <h1 className="text-3xl font-bold mb-6">📋 Panel organizatora</h1>

      <Link
        href="/dashboard/settings"
        className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center"
      >
        <span className="text-2xl">🧍‍♂️</span>
        <p className="font-semibold text-lg mt-2">Moje konto</p>
      </Link>


      <div className="bg-white p-6 rounded-2xl shadow-md">
        <p className="text-gray-600">
          Tu wkrótce pojawią się Twoje funkcje organizacyjne
          (tworzenie turniejów, zarządzanie sędziami, halami, wynikami itd.).
        </p>
      </div>
    </main>
  );
}
