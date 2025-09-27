"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileHeader from "./MobileHeader";
import MobileMenu from "./MobileMenu";
import { FaFacebook } from "react-icons/fa";


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#d4edf8] text-black shadow-md">
      {/* Desktop header */}
      <nav className="hidden lg:flex container mx-auto justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo Turnieju"
            width={96}
            height={96}
            className="h-24 w-auto transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Menu desktopowe */}
        <ul className="flex space-x-8 text-lg transition-all duration-300">
          <li><Link href="#" className="hover:text-blue-400 transition-colors">Teraz gramy</Link></li>
          <li><Link href="#" className="hover:text-blue-400 transition-colors">Historia turniejów</Link></li>
          <li><Link href="#" className="hover:text-blue-400 transition-colors">Zamów turniej</Link></li>
          <li><Link href="#" className="hover:text-blue-400 transition-colors">Cennik</Link></li>
          <li><Link href="#" className="hover:text-blue-400 transition-colors">Kontakt</Link></li>
        </ul>

        {/* Prawa sekcja */}
      {/* Prawa sekcja */}
    <div className="flex items-center space-x-6 ml-6">
      <div className="flex flex-col text-right">
        <a
          href="mailto:sedzia@mateuszbialy.pl"
          className="hover:text-blue-400 flex items-center space-x-2 transition-colors duration-300"
        >
          <span>📧</span><span>sedzia@mateuszbialy.pl</span>
        </a>
        <a
          href="tel:781166101"
          className="hover:text-blue-400 flex items-center space-x-2 transition-colors duration-300"
        >
          <span>📞</span><span>781-166-101</span>
        </a>
      </div>

      <Link
        href="/login"
        className="hover:text-blue-400 flex items-center space-x-2 transition-colors duration-300"
      >
        <span>🔐</span><span>Logowanie</span>
      </Link>

      <a
        href="https://www.facebook.com/profile.php?id=61556020260341"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-blue-400 transition-colors duration-300"
      >
        <FaFacebook className="text-2xl" />
      </a>
    </div>

      </nav>

      {/* Mobile header + menu */}
      <div className="lg:hidden">
        <MobileHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </div>
    </header>
  );
}
