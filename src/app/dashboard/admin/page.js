"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) setUser(data);
      })
      .catch(() => setUser(null));
  }, []);

  const tiles = [
    {
      title: "👥 Zarządzaj użytkownikami",
      href: "/dashboard/admin/users",
      desc: "Dodawaj, edytuj, aktywuj i resetuj hasła użytkowników.",
    },
    {
      title: "🏐 Utwórz turniej",
      href: "#",
      desc: "Wkrótce: możliwość tworzenia nowych turniejów.",
    },
    {
      title: "⚙️ Ustawienia systemowe",
      href: "#",
      desc: "Wkrótce: ustawienia globalne aplikacji.",
    },
  ];

  return (
    <main className="flex flex-col items-center p-8 text-gray-800 min-h-screen bg-[#f5f5f5]">
      <h1 className="text-3xl font-bold mb-6 text-center">
        👑 Panel administratora
      </h1>

      {user && (
        <p className="text-lg mb-8 text-gray-600">
          Witaj, <span className="font-semibold">{user.firstName}</span>!
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {tiles.map((tile, i) => (
          <a
            key={i}
            href={tile.href}
            className="block bg-white rounded-2xl shadow-md p-8 text-center hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300"
          >
            <h2 className="text-xl font-bold mb-2">{tile.title}</h2>
            <p className="text-gray-600 text-sm">{tile.desc}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
