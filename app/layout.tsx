import type { Metadata } from "next";
import { Roboto_Condensed, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GalaxyBackground from "@/components/GalaxyBackground";

// Configuración de Roboto Condensed para texto normal
const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Configuración de Roboto Mono para código o elementos que requieran monospace
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Carlos Boyzo Oregón",
  description: "Artista y Desarrollador UX",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${robotoCondensed.variable} ${robotoMono.variable} font-roboto-condensed antialiased`}>
        <Navbar />
        <GalaxyBackground />
        {children}
        
        <Footer />
      </body>
    </html>
  );
}