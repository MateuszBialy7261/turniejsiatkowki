"use client";
import Link from "next/link";
import Image from "next/image";

export default function MobileHeader({ menuOpen, setMenuOpen }) {
  return (
    <nav className="flex lg:hidden justify-between items-center p-4 bg-[#d4edf8] shadow-md">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
          alt="Logo Turnieju"
          width={64}
          height={64}
          className="h-12 w-auto"
        />
      </Link>

      {/* Napis na środku */}
      <span className="text-lg font-semibold">Turnieje minisiatkówki online</span>

      {/* Hamburger */}
      <button
        className="lg:hidden text-2xl focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>
    </nav>
  );
}
