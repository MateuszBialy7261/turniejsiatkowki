"use client";
import { useState } from "react";
import MobileHeader from "./MobileHeader";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#d4edf8] text-black shadow-md">
      {/* Desktop header */}
      <nav className="hidden lg:flex container mx-auto justify-between items-center p-4">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Logo Turnieju"
            className="h-24 w-auto transition-transform duration-300 hover:scale-105"
          />
        </a>

        {/* Menu desktopowe */}
        <ul className="flex space-x-8 text-lg transition-all duration-300">
          <li><a href="#" className="hover:text-blue-400 transition-colors">Teraz gramy</a></li>
          <li><a href="#" className="hover:text-blue-400 transition-colors">Historia turniejów</a></li>
          <li><a href="#" className="hover:text-blue-400 transition-colors">Zamów turniej</a></li>
          <li><a href="#" className="hover:text-blue-400 transition-colors">Cennik</a></li>
          <li><a href="#" className="hover:text-blue-400 transition-colors">Kontakt</a></li>
        </ul>

        {/* Prawa sekcja */}
        <div className="flex items-center space-x-6 ml-6">
          <div className="flex flex-col text-right">
            <a href="mailto:sedzia@mateuszbialy.pl" className="hover:text-blue-400 flex items-center space-x-2">
              <span>📧</span><span>sedzia@mateuszbialy.pl</span>
            </a>
            <a href="tel:781166101" className="hover:text-blue-400 flex items-center space-x-2">
              <span>📞</span><span>781-166-101</span>
            </a>
          </div>
          <a href="/login" className="hover:text-blue-400 flex items-center space-x-2">
            <span>🔐</span><span>Logowanie</span>
          </a>
        </div>
      </nav>

      {/* Mobile header */}
      <MobileHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Mobile menu */}
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </header>
  );
}
