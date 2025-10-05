"use client";
import { useEffect, useState } from "react";
import WelcomeBar from "@/components/WelcomeBar";

export default function SedziaDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.loggedIn && data?.role === "sedzia") setUser(data);
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {user && <WelcomeBar firstName={user.firstName} />}

      {/* reszta panelu sędziego (Twoje kafelki/sekcje) */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-2">Panel sędziego</h2>
        <p className="text-gray-600">
          Tu wkrótce Twoje funkcje sędziowskie (przydziały meczów, terminarze, rozliczenia itd.).
        </p>
      </div>
    </main>
  );
}
