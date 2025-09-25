"use client";
import { useState } from "react";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
import Image from "next/image";


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#d4edf8] text-black shadow-md">
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
       <Link href="/" className="flex items-center">
            <Image 
                src="/logo.png"
                alt="Logo Turnieju"
                width={100}   // możesz dopasować
                height={100}  // proporcjonalnie
                className="h-24 w-auto transition-transform duration-300 hover:scale-105"
                priority      // logo ładuje się od razu
            />
            </Link>


        {/* Menu desktopowe */}
        <ul className="hidden lg:flex space-x-8 text-lg transition-all duration-300">
          <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Teraz gramy</a></li>
          <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Historia turniejów</a></li>
          <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Zamów turniej</a></li>
          <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Cennik</a></li>
          <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Kontakt</a></li>
        </ul>

        {/* Prawa sekcja */}
        <div className="hidden lg:flex items-center space-x-6 ml-6">
          <div className="flex flex-col text-right">
            <a href="mailto:sedzia@mateuszbialy.pl" className="hover:text-blue-400 transition-colors duration-300 flex items-center space-x-2">
              <span>📧</span><span>sedzia@mateuszbialy.pl</span>
            </a>
            <a href="tel:781166101" className="hover:text-blue-400 transition-colors duration-300 flex items-center space-x-2">
              <span>📞</span><span>781-166-101</span>
            </a>
          </div>
          <a href="/login" className="hover:text-blue-400 transition-colors duration-300 flex items-center space-x-2">
            <span>🔐</span><span>Logowanie</span>
          </a>
        </div>

        {/* Hamburger */}
       <button
            className="lg:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            >
            ☰
        </button>
      </nav>
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </header>
  );
}
