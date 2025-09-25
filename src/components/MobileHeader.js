"use client";
import Link from "next/link";
import Image from "next/image";

export default function MobileHeader({ menuOpen, setMenuOpen }) {
  return (
    <nav className="flex justify-between items-center p-4 container mx-auto">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
          alt="Logo Turnieju"
          width={64}
          height={64}
          className="h-16 w-auto"
        />
      </Link>

      {/* Napis na środku */}
      <div className="text-lg font-semibold">Turnieje minisiatkówki online</div>

      {/* Hamburger */}
      <button
        className="focus:outline-none text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </button>
    </nav>
  );
}
