import { Lato } from "next/font/google";
import "./globals.css";
import CookieBanner from "../components/CookieBanner";
import Header from "../components/Header";
import Footer from "../components/Footer";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"], // zwykły i pogrubiony
  variable: "--font-lato",
});

export const metadata = {
  title: "Turniej Siatkówki",
  description: "System do zarządzania turniejami siatkarskimi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body
        className={`${lato.variable} font-sans antialiased flex flex-col min-h-screen bg-[#f5f5f5] text-gray-800`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
