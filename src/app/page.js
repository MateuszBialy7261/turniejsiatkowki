"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
          setUser({
            ...data,
            firstName: data.first_name || data.firstName || "",
            role: data.role || "",
          });
        }
      })
      .catch(() => setUser(null));
  }, []);

  const roleDisplay = (role) => {
    switch (role) {
      case "sedzia":
        return { label: "sędzia", color: "text-green-600", icon: "⚖️" };
      case "organizator":
        return { label: "organizator", color: "text-blue-600", icon: "🏢" };
      case "admin":
        return { label: "administrator", color: "text-red-600", icon: "👑" };
      default:
        return { label: "gość", color: "text-gray-600", icon: "👤" };
    }
  };

  return (
    <main className="flex-grow w-full p-8 space-y-8 text-gray-800">

   {/* 💬 Kafelek powitalny — RESPONSYWNY */}
{user && (
  <div className="bg-gradient-to-r from-blue-200 to-blue-100 rounded-2xl shadow-md 
                  p-5 sm:p-6 text-center space-y-2 sm:space-y-3 
                  max-w-full overflow-hidden">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 break-words leading-tight">
      👋 Cześć {user.firstName}!
    </h2>

    <p className="text-gray-700 mt-1 sm:mt-2 text-base sm:text-lg flex flex-wrap items-center justify-center gap-2 leading-snug">
      Zalogowano jako{" "}
      <span className={`font-semibold ${roleDisplay(user.role).color} flex items-center gap-1`}>
        <span>{roleDisplay(user.role).icon}</span> {roleDisplay(user.role).label}
      </span>
      <span className="hidden sm:inline">•</span> 
      <span className="block sm:inline">Miło Cię znów widzieć! 🎉</span>
    </p>
  </div>
)}


      {/* 🚀 Animowany przycisk do panelu */}
      {user ? (
        <a
          href={`/dashboard/${user.role}`}
          className="group relative block bg-gradient-to-r from-green-200 to-green-100 rounded-2xl shadow-md p-8 
                     text-center text-2xl font-bold hover:from-green-300 hover:to-green-200 hover:scale-[1.03] 
                     transition-all duration-300"
        >
          {/* 🚀 Rakieta z glow i ciągłym podskakiwaniem */}
          <span className="inline-block animate-bounce-slow relative">
            <span className="absolute inset-0 blur-md bg-green-400 opacity-60 rounded-full animate-pulse-slow"></span>
            <span className="relative z-10">🚀</span>
          </span>{" "}
          {user.role === "sedzia"
            ? "Panel sędziego"
            : user.role === "organizator"
            ? "Panel organizatora"
            : "Panel administratora"}
        </a>
      ) : (
        <a
          href="/login"
          className="block bg-white rounded-2xl shadow-md p-8 text-center text-2xl font-bold 
                     hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300"
        >
          🔐 Logowanie organizatora / sędziego
        </a>
      )}

      {/* 🏐 Sekcja 1 — teraz gramy */}
      <div>
        <a
          href="#"
          className="block bg-white rounded-2xl shadow-md p-8 text-center text-2xl font-bold 
                     hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300"
        >
          🏐 Teraz gramy
        </a>
      </div>

      {/* 📚 Sekcja 2 — dodatkowe linki */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <a
          href="#"
          className="block bg-white rounded-2xl shadow-md p-6 text-center text-xl font-semibold 
                     hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300"
        >
          📖 Historia turniejów
        </a>
        <a
          href="#"
          className="block bg-white rounded-2xl shadow-md p-6 text-center text-xl font-semibold 
                     hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300"
        >
          📝 Zamów turniej
        </a>
        <a
          href="#"
          className="block bg-white rounded-2xl shadow-md p-6 text-center text-xl font-semibold 
                     hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300"
        >
          💰 Cennik
        </a>
        <a
          href="#"
          className="block bg-white rounded-2xl shadow-md p-6 text-center text-xl font-semibold 
                     hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300"
        >
          📩 Kontakt
        </a>
      </div>
    </main>
  );
}
