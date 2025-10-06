"use client";

import TournamentForm from "@/app/dashboard/tournaments/sharedForm";

export default function AdminNewTournamentPage() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
          🏆 Utwórz nowy turniej
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Turnieje tworzone przez administratora są aktywne natychmiast po dodaniu.
        </p>

        <TournamentForm role="admin" />
      </div>
    </main>
  );
}
