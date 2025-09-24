"use client";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* GÓRNE MENU */}
      <header className="bg-blue-600 text-white">
        <nav className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-xl font-bold">Turniej Siatkówki</h1>

          {/* Linki na duże ekrany */}
          <ul className="hidden md:flex space-x-6">
            <li><a href="#" className="hover:underline">Teraz gramy</a></li>
            <li><a href="#" className="hover:underline">Historia</a></li>
            <li><a href="#" className="hover:underline">Zamów turniej</a></li>
            <li><a href="#" className="hover:underline">Cennik</a></li>
            <li><a href="#" className="hover:underline">Kontakt</a></li>
            <li><a href="#" className="hover:underline">Logowanie</a></li>
          </ul>

          {/* Ikona hamburgera na telefonie */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </nav>

        {/* Menu rozwijane na telefonie */}
        {menuOpen && (
          <ul className="md:hidden bg-blue-700 p-4 space-y-2">
            <li><a href="#" className="block hover:underline">Teraz gramy</a></li>
            <li><a href="#" className="block hover:underline">Historia</a></li>
            <li><a href="#" className="block hover:underline">Zamów turniej</a></li>
            <li><a href="#" className="block hover:underline">Cennik</a></li>
            <li><a href="#" className="block hover:underline">Kontakt</a></li>
            <li><a href="#" className="block hover:underline">Logowanie</a></li>
          </ul> 
        )}
      </header>

      {/* TREŚĆ STRONY */}
      <main className="flex-grow container mx-auto p-8">
        <h2 className="text-3xl font-semibold mb-4">Witamy w systemie turniejowym</h2>
        <p className="text-lg">
          Wybierz jedną z dostępnych opcji z menu powyżej.
        </p>
      </main>

      {/* STOPKA */}
      <footer className="bg-gray-200 text-center p-4">
        <p>© 2025 Turniej Siatkówki</p>
      </footer>
    </div>
  );
}
