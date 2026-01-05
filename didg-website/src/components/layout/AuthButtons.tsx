import { createClient } from "@/infrastructure/supabase/server";
import Link from "next/link";
import { LayoutDashboard, GraduationCap, LogIn, LogOut } from "lucide-react";
import { signOutAction } from "@/core/actions/auth"; // <--- 1. IMPORTAR LA ACCIÓN

export async function AuthButtons() {
  const supabase = await createClient();

  // 1. Verificamos usuario
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link 
        href="/login" 
        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-background bg-white rounded-full hover:bg-gray-200 transition-colors"
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
    <div className="flex items-center gap-4">
      
      {/* BOTÓN ADMIN: Dashboard */}
      {p?.role === "admin" && (
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold border border-primary text-primary rounded-full hover:bg-primary/10 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
      )}

      {/* BOTÓN ESTUDIANTE: Mis Notas */}
      {/* Aparece si eres 'student' o 'admin' (para probar) */}
      {(p?.role === "student" || p?.role === "admin") && (
        <Link 
          href="/grades" 
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold border border-secondary text-secondary rounded-full hover:bg-secondary/10 transition-colors"
        >
          <GraduationCap className="w-4 h-4" />
          Mis Notas
        </Link>
      )}

      {/* 2. USAR LA ACCIÓN EN EL FORMULARIO */}
      <form action={signOutAction}>
          <button 
            type="submit"
            className="p-2 text-text-muted hover:text-error transition-colors" 
            title="Cerrar Sesión"
          >
              <LogOut className="w-4 h-4" />
          </button>
      </form>
    </div>
  );
}