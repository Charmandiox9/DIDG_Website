"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Menu, X, Cpu, BookOpen, User } from "lucide-react"; // Agregué Menu y X para móvil
import { cn } from "@/core/utils/cn";

export function Navbar({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Proyectos", href: "/projects", icon: Cpu },
    { name: "Ayudantías", href: "/courses", icon: BookOpen },
    { name: "Sobre Mí", href: "/about", icon: User },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* 1. LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded bg-primary/10 border border-primary/20 group-hover:border-primary/50 transition-colors">
              <Terminal className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-wider text-text-main group-hover:text-primary transition-colors">
              DIDG
            </span>
          </Link>

          {/* 2. MENU ESCRITORIO (Central) */}
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
          </div>

          {/* 3. ZONA DE BOTONES (Aquí se renderiza AuthButtons que viene del layout) */}
          <div className="hidden md:block border-l border-white/10 pl-6">
            {children}
          </div>

          {/* 4. BOTÓN HAMBURGUESA (Móvil) */}
          <button 
            className="md:hidden p-2 text-text-muted hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* 5. MENÚ MÓVIL DESPLEGABLE */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-white/10 p-4 flex flex-col gap-4 animate-in slide-in-from-top-5 shadow-2xl">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-sm font-mono text-text-muted hover:text-primary p-2 rounded hover:bg-white/5"
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
          
          {/* Renderizamos los botones también en móvil */}
          <div className="pt-4 border-t border-white/10 flex justify-center">
            {children}
          </div>
        </div>
      )}
    </nav>
  );
}