import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] text-gray-800">
      <Header />

      <main className="flex-grow container mx-auto p-8 space-y-8">
        {/* Kafelek 1 */}
        <div>
          <a href="#" className="block bg-white rounded-2xl shadow-md p-8 text-center text-2xl font-bold hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300">
            🏐 Teraz gramy
          </a>
        </div>

        {/* Kafelki 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <a href="#" className="block bg-white rounded-2xl shadow-md p-6 text-center text-xl font-semibold hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300">📖 Historia turniejów</a>
          <a href="#" className="block bg-white rounded-2xl shadow-md p-6 text-center text-xl font-semibold hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300">📝 Zamów turniej</a>
          <a href="#" className="block bg-white rounded-2xl shadow-md p-6 text-center text-xl font-semibold hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300">💰 Cennik</a>
          <a href="#" className="block bg-white rounded-2xl shadow-md p-6 text-center text-xl font-semibold hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300">📩 Kontakt</a>
        </div>

        {/* Kafelek 3 */}
        <div>
          <a href="/login" className="block bg-white rounded-2xl shadow-md p-8 text-center text-2xl font-bold hover:bg-blue-100 hover:scale-[1.02] transition-transform duration-300">
            🔐 Logowanie organizatora / sędziego
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
