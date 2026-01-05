"use client";

import { useState, useEffect } from "react"; // <-- Importamos hooks
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Terminal, User, BookOpen, Cpu, LogOut } from "lucide-react";
import { createClient } from "@/infrastructure/supabase/client"; // <-- Importamos cliente
import { cn } from "@/core/utils/cn";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null); // Estado para el usuario

  // Verificar sesión al cargar
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    
    checkUser();

    // Escuchar cambios en la autenticación (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const navItems = [
    { name: "Proyectos", href: "/projects", icon: Cpu },
    { name: "Ayudantías", href: "/courses", icon: BookOpen },
    { name: "Sobre Mí", href: "/about", icon: User },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded bg-primary/10 border border-primary/20 group-hover:border-primary/50 transition-colors">
              <Terminal className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-wider text-text-main group-hover:text-primary transition-colors">
              DIDG
            </span>
          </Link>

          {/* MENU ESCRITORIO */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-mono transition-all duration-200 hover:text-primary",
                    isActive ? "text-primary" : "text-text-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}

            {/* ZONA DE USUARIO / LOGIN */}
            {user ? (
              <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                <div className="text-right hidden lg:block">
                  <p className="text-xs text-text-muted font-mono">Conectado como</p>
                  <p className="text-sm font-bold text-primary truncate max-w-[150px]">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded transition-all"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 text-sm font-bold bg-primary text-background rounded hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300 clip-path-polygon"
              >
                ACCESO_SYSTEM
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}