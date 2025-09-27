"use client";

import { useSearchParams } from "next/navigation";

export default function ActivatedPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md">
        {status === "success" ? (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-4">✅ Konto aktywowane!</h2>
            <p className="mb-6">Twoje konto zostało pomyślnie aktywowane. Możesz się teraz zalogować.</p>
            <a
              href="/login"
              className="bg-blue-300 text-white px-6 py-2 rounded hover:bg-blue-400 transition"
            >
              Przejdź do logowania
            </a>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Błąd aktywacji</h2>
            <p className="mb-6">Link aktywacyjny jest nieprawidłowy lub wygasł.</p>
            <a
              href="/register"
              className="bg-blue-300 text-white px-6 py-2 rounded hover:bg-blue-400 transition"
            >
              Spróbuj ponownie
            </a>
          </>
        )}
      </div>
    </div>
  );
}
