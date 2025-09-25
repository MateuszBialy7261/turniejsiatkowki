import { Lato } from "next/font/google";
import "./globals.css";

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
      <body className={`${lato.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
