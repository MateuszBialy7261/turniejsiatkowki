"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) setUser(data);
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
        return { label: role, color: "text-gray-600", icon: "👤" };
    }
  };

  return (
    <main className="flex-grow w-full p-8 space-y-8 text-gray-800">

      {/* Powitalny kafelek */}
      {user && (
        <div className="bg-gradient-to-r from-blue-200 to-blue-100 rounded-2xl shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            👋 Cześć {user.firstName}!
          </h2>
          <p className="text-gray-700 mt-2 text-lg flex items-center justify-center gap-2">
            Zalogowano jako{" "}
            <span
              className={`font-semibold ${roleDisplay(user.role).color}`}
            >
              {roleDisplay(user.role).icon} {roleDisplay(user.role).label}
            </span>
            . Baw się dobrze na turnieju! 🎉
          </p>
        </div>
      )}

      {/* Kafelek 1 */}
      <div>
        <a
          href="#"
          className="block bg-white rounded-2xl shadow-md p-8 text-center text-2xl font-bold hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300"
        >
          🏐 Teraz gramy
        </a>
      </div>

      {/* Kafelki 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <a
          href="#"
          className="block bg-white rounded-2xl shadow-md p-6 text-center text-xl font-semibold hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300"
        >
          📖 Historia turniejów
        </a>
        <a
          href="#"
          className="block bg-white rounded-2xl shadow-md p-6 text-center text-xl font-semibold hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300"
        >
          📝 Zamów turniej
        </a>
        <a
          href="#"
          className="block bg-white rounded-2xl shadow-md p-6 text-center text-xl font-semibold hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300"
        >
          💰 Cennik
        </a>
        <a
          href="#"
          className="block bg-white rounded-2xl shadow-md p-6 text-center text-xl font-semibold hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300"
        >
          📩 Kontakt
        </a>
      </div>

      {/* Kafelek 3 */}
      <div>
        {user ? (
          <a
            href={`/dashboard/${user.role}`}
            className="block bg-green-100 rounded-2xl shadow-md p-8 text-center text-2xl font-bold hover:bg-green-200 hover:scale-[1.02] transition-transform duration-300"
          >
            🚀 {user.role === "sedzia"
              ? "Panel sędziego"
              : user.role === "organizator"
              ? "Panel organizatora"
              : "Panel administratora"}
          </a>
        ) : (
          <a
            href="/login"
            className="block bg-white rounded-2xl shadow-md p-8 text-center text-2xl font-bold hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300"
          >
            🔐 Logowanie organizatora / sędziego
          </a>
        )}
      </div>
    </main>
  );
}
