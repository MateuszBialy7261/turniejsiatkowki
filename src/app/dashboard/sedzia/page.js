"use client";
import WelcomeBar from "@/components/WelcomeBar";

export default function SedziaDashboard() {
  const user = { firstName: "Mateusz", role: "sedzia" };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <WelcomeBar firstName={user.firstName} role={user.role} />

      <h1 className="text-3xl font-bold mb-6">🦸‍♂️ Panel sędziego</h1>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <p className="text-gray-600">
          Tu wkrótce Twoje funkcje sędziowskie (przydziały meczów, terminarze, rozliczenia itd.).
        </p>
      </div>
    </main>
  );
}
