import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google"; 
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthButtons } from "@/components/layout/AuthButtons";
import { EasterEgg } from "@/components/layout/EasterEgg";
import { CommandMenu } from "@/components/layout/CommandMenu";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { GlobalRequestButton } from "@/components/feedback/GlobalRequestButton";
import { HideUIToggle } from "@/components/ui/HideUIToggle";
import { Analytics } from "@vercel/analytics/react"

import { FloatingUIProvider } from "@/context/FloatingUIContext"; 

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
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable} ${orbitron.variable} font-sans antialiased bg-background text-text-main overflow-x-hidden flex flex-col min-h-screen`}>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
            <FloatingUIProvider>
            
                <Navbar>
                   <AuthButtons />
                </Navbar>

                <HideUIToggle />
                <CommandMenu />
                <GlobalRequestButton />
                <EasterEgg />

                <main className="flex-grow pt-16 relative z-10">
                  {children}
                </main>
                
                <Footer />

                <div className="fixed inset-0 z-[-1] bg-background transition-colors duration-300">
                  <div className="absolute inset-0 bg-grid opacity-20" />
                </div>

            </FloatingUIProvider>
            <Analytics />
            
        </ThemeProvider>
      </body>
    </html>
  );
}