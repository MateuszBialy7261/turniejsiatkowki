export default function MobileMenu({ menuOpen, setMenuOpen }) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-64 bg-[#d4edf8] shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        menuOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Przyciski menu */}
      <ul className="flex flex-col space-y-4 p-6 text-lg">
        <li><a href="#" className="hover:text-blue-400">Teraz gramy</a></li>
        <li><a href="/historia" className="hover:text-blue-400">Historia turniejów</a></li>
        <li><a href="#" className="hover:text-blue-400">Zamów turniej</a></li>
        <li><a href="#" className="hover:text-blue-400">Cennik</a></li>
        <li><a href="#" className="hover:text-blue-400">Kontakt</a></li>
        <li>
          <a href="mailto:sedzia@mateuszbialy.pl" className="hover:text-blue-400 flex items-center space-x-2">
            <span>📧</span><span>sedzia@mateuszbialy.pl</span>
          </a>
        </li>
        <li>
          <a href="tel:781166101" className="hover:text-blue-400 flex items-center space-x-2">
            <span>📞</span><span>781-166-101</span>
          </a>
        </li>
        <li>
          <a href="/login" className="hover:text-blue-400 flex items-center space-x-2">
            <span>🔐</span><span>Logowanie</span>
          </a>
        </li>
      </ul>

      {/* Przycisk zamknięcia */}
      <button
        onClick={() => setMenuOpen(false)}
        className="absolute top-4 right-4 text-2xl focus:outline-none"
      >
        ✖
      </button>
    </div>
  );
}
