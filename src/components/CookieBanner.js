"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
  };

  const declineCookies = () => {
    // jeśli ktoś nie zgadza się, przekierowujemy go poza stronę
    window.location.href = "https://google.com";
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm mb-2 sm:mb-0">
          Ta strona korzysta z plików cookies niezbędnych do prawidłowego działania. 
          Jeśli nie wyrażasz zgody – opuść stronę. 
          Szczegóły znajdziesz w{" "}
          <Link href="/polityka-prywatnosci" className="underline text-blue-300 hover:text-blue-400">
            polityce prywatności
          </Link>.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={acceptCookies}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Akceptuję
          </button>
          <button
            onClick={declineCookies}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Nie zgadzam się
          </button>
        </div>
      </div>
    </div>
  );
}
