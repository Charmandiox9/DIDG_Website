import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google"; 
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthButtons } from "@/components/layout/AuthButtons";
import { EasterEgg } from "@/components/layout/EasterEgg";
import { CommandMenu } from "@/components/layout/CommandMenu";
// 1. IMPORTAR EL PROVIDER
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.danielduran.engineer'),
  title: "DIDG | Developer & Architect",
  description: "Portafolio académico y profesional de desarrollo de software y hardware.",
  openGraph: {
    images: '/og',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. IMPORTANTE: suppressHydrationWarning evita errores de mismatch entre server/client
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable} ${orbitron.variable} font-sans antialiased bg-background text-text-main overflow-x-hidden flex flex-col min-h-screen`}>
        
        {/* 3. ENVOLVER TODO CON EL THEME PROVIDER */}
        {/* attribute="class" es vital para que Tailwind detecte el modo oscuro */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
            <Navbar>
               <AuthButtons />
            </Navbar>

            <CommandMenu />
            <EasterEgg />

            <main className="flex-grow pt-16 relative z-10">
              {children}
            </main>

            <Footer />

            {/* El fondo también va dentro para que reaccione al cambio de color */}
            <div className="fixed inset-0 z-[-1] bg-background transition-colors duration-300">
              <div className="absolute inset-0 bg-grid opacity-20" />
            </div>
            
        </ThemeProvider>
      </body>
    </html>
  );
}