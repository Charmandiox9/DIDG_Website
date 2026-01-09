import { createClient } from "@/infrastructure/supabase/server";
import Link from "next/link";
import { LayoutDashboard, GraduationCap, LogIn, LogOut, UserCog } from "lucide-react";
import { signOutAction } from "@/core/actions/auth";

export async function AuthButtons() {
  const supabase = await createClient();

  // 1. Verificamos usuario
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link 
        href="/login" 
        // CAMBIO CRÍTICO: bg-text-main text-background
        // Light Mode: Botón NEGRO con texto BLANCO.
        // Dark Mode: Botón BLANCO con texto NEGRO.
        // Esto asegura máximo contraste siempre.
        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-background bg-text-main rounded-full hover:opacity-80 transition-opacity shadow-sm"
      >
        <LogIn className="w-4 h-4" />
        Login
      </Link>
    );
  }

  // 2. Verificamos Rol
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const p = profile as any;

  return (
    <div className="flex items-center gap-3 md:gap-4">
      
      {/* BOTÓN ADMIN: Dashboard */}
      {/* Mantiene primary, funciona bien en ambos temas */}
      {p?.role === "admin" && (
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-bold border border-primary text-primary rounded-full hover:bg-primary/10 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden md:inline">Dashboard</span>
        </Link>
      )}

      {/* BOTÓN PERFIL */}
      {/* CAMBIO: border-text-main/20 y hover:text-text-main */}
      <Link 
        href="/profile" 
        className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-bold border border-text-main/20 text-text-muted hover:text-text-main rounded-full hover:bg-text-main/5 transition-colors"
      >
        <UserCog className="w-4 h-4" />
        <span className="hidden md:inline">Perfil</span>
      </Link>

      {/* BOTÓN ESTUDIANTE: Mis Notas */}
      {/* Mantiene secondary, funciona bien en ambos temas */}
      {/*
      {(p?.role === "student" || p?.role === "admin") && (
        <Link 
          href="/grades" 
          className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-bold border border-secondary text-secondary rounded-full hover:bg-secondary/10 transition-colors"
        >
          <GraduationCap className="w-4 h-4" />
          <span className="hidden md:inline">Notas</span>
        </Link>
      )}*/}

      {/* BOTÓN LOGOUT */}
      <form action={signOutAction}>
          <button 
            type="submit"
            // CAMBIO: hover:text-red-500 en vez de error para asegurar color
            className="p-2 text-text-muted hover:text-red-500 transition-colors" 
            title="Cerrar Sesión"
          >
              <LogOut className="w-4 h-4" />
          </button>
      </form>
    </div>
  );
}