"use client";
import Link from "next/link";

export default function MobileMenu({ menuOpen, setMenuOpen }) {
  return (
    <>
      {/* Overlay (klik poza menu zamyka je) */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 lg:hidden z-40
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer z prawej strony */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-[#d4edf8] shadow-xl z-50 lg:hidden
          transform transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu mobilne"
      >
        {/* Zamknij */}
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 text-2xl focus:outline-none"
          aria-label="Zamknij menu"
        >
          ✖
        </button>

        {/* Linki */}
        <nav className="mt-16 p-6">
          <ul className="flex flex-col space-y-4 text-lg">
            <li>
              <Link href="/" className="hover:text-blue-400" onClick={() => setMenuOpen(false)}>
                Teraz gramy
              </Link>
            </li>
            <li>
              <Link href="/historia" className="hover:text-blue-400" onClick={() => setMenuOpen(false)}>
                Historia turniejów
              </Link>
            </li>
            <li>
              <Link href="/zamow" className="hover:text-blue-400" onClick={() => setMenuOpen(false)}>
                Zamów turniej
              </Link>
            </li>
            <li>
              <Link href="/cennik" className="hover:text-blue-400" onClick={() => setMenuOpen(false)}>
                Cennik
              </Link>
            </li>
            <li>
              <Link href="/kontakt" className="hover:text-blue-400" onClick={() => setMenuOpen(false)}>
                Kontakt
              </Link>
            </li>
            <li>
              <a
                href="mailto:sedzia@mateuszbialy.pl"
                className="hover:text-blue-400 flex items-center space-x-2"
                onClick={() => setMenuOpen(false)}
              >
                <span>📧</span><span>sedzia@mateuszbialy.pl</span>
              </a>
            </li>
            <li>
              <a
                href="tel:781166101"
                className="hover:text-blue-400 flex items-center space-x-2"
                onClick={() => setMenuOpen(false)}
              >
                <span>📞</span><span>781-166-101</span>
              </a>
            </li>
            <li>
              <Link href="/login" className="hover:text-blue-400 flex items-center space-x-2" onClick={() => setMenuOpen(false)}>
                <span>🔐</span><span>Logowanie</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
