"use client";

export default function MobileHeader({ menuOpen, setMenuOpen }) {
  return (
    <nav className="flex lg:hidden container mx-auto justify-between items-center p-4">
      {/* Logo */}
      <a href="/" className="flex items-center">
        <img
          src="/logo.png"
          alt="Logo Turnieju"
          className="h-16 w-auto transition-transform duration-300 hover:scale-105"
        />
      </a>

      {/* Napis na środku */}
      <span className="text-md font-semibold text-gray-700">
        Turnieje minisiatkówki online
      </span>

      {/* Hamburger */}
      <button
        className="focus:outline-none text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>
    </nav>
  );
}
