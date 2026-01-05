import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google"; // Importamos fuentes
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// 1. Fuente Principal (Texto corrido)
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

// 2. Fuente Código (Técnico)
const jetbrains = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-jetbrains" 
});

// 3. Fuente Display (Títulos Futuristas)
const orbitron = Orbitron({ 
  subsets: ["latin"], 
  variable: "--font-orbitron" 
});

export const metadata: Metadata = {
  title: "DIDG | Developer & Architect",
  description: "Portafolio académico y profesional de desarrollo de software y hardware.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${jetbrains.variable} ${orbitron.variable} font-sans antialiased bg-background text-text-main overflow-x-hidden flex flex-col min-h-screen`}>
        
        {/* Navbar fijo arriba */}
        <Navbar />

        {/* Contenido principal con padding-top para no quedar debajo del Navbar */}
        <main className="flex-grow pt-16 relative z-10">
          {children}
        </main>

        {/* Footer al final */}
        <Footer />
        
      </body>
    </html>
  );
}