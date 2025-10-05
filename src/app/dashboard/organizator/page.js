"use client";
import { useEffect, useState } from "react";
import WelcomeBar from "@/components/WelcomeBar";

export default function OrganizatorDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.loggedIn && data?.role === "organizator") setUser(data);
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {user && <WelcomeBar firstName={user.firstName} />}

      {/* reszta panelu organizatora (Twoje kafelki/sekcje) */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-2">Panel organizatora</h2>
        <p className="text-gray-600">
          Tu wkrótce funkcje dla organizatora (tworzenie turniejów, zgłoszenia, płatności itd.).
        </p>
      </div>
    </main>
  );
}
