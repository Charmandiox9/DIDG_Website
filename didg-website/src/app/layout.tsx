import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google"; 
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthButtons } from "@/components/layout/AuthButtons";
import { EasterEgg } from "@/components/layout/EasterEgg";
import { CommandMenu } from "@/components/layout/CommandMenu";

// Fuentes...
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.danielduran.engineer'),
  title: "DIDG | Developer & Architect",
  description: "Portafolio académico y profesional de desarrollo de software y hardware.",
  openGraph: {
    images: '/og', // <--- Apunta a la ruta que acabamos de crear
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${jetbrains.variable} ${orbitron.variable} font-sans antialiased bg-background text-text-main overflow-x-hidden flex flex-col min-h-screen`}>
        
        {/* CORRECCIÓN AQUÍ: Pasamos los botones DENTRO del Navbar */}
        <Navbar>
           <AuthButtons />
        </Navbar>

        <CommandMenu />
        <EasterEgg />

        <main className="flex-grow pt-16 relative z-10">
          {children}
        </main>

        <Footer />

        <div className="fixed inset-0 z-[-1] bg-background">
          <div className="absolute inset-0 bg-grid opacity-20" />
        </div>
        
      </body>
    </html>
  );
}