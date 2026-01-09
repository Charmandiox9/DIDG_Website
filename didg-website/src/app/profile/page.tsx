import { createClient } from "@/infrastructure/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Shield, CreditCard, GraduationCap } from "lucide-react";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CharmanderPet } from "@/components/home/CharmanderPet";

// 1. Definimos la interfaz para evitar usar 'any'
interface ProfileData {
  full_name: string | null;
  rut: string | null;
  role: 'admin' | 'student' | 'user';
  email?: string; // El email viene de auth.user, no de la tabla profiles a veces
}

export default async function ProfilePage() {
  const supabase = await createClient();

  // 2. Verificar Sesión
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 3. Obtener datos del perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const p = profile as unknown as ProfileData;

  // Determinar si puede ver notas
  const canViewGrades = p?.role === "student" || p?.role === "admin";

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-4xl mx-auto animate-in fade-in">
        <CharmanderPet />
      
      <Breadcrumbs items={[{ label: "Mi Perfil" }]} />

      {/* HEADER: Avatar + Info + Botón de Acción */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
        
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <span className="text-2xl font-bold text-white uppercase">
                {p?.full_name?.charAt(0) || "U"}
            </span>
        </div>
        
        {/* Info Principal */}
        <div className="flex-1">
            <h1 className="text-3xl font-display font-bold text-text-main">
                {p?.full_name || "Usuario"}
            </h1>
            <div className="flex items-center gap-3 mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface border border-text-main/10 text-xs font-mono text-text-muted capitalize shadow-sm">
                    <Shield className="w-3 h-3" /> {p?.role === 'admin' ? 'Administrador' : 'Estudiante'}
                </span>
            </div>
        </div>

        {/* CORRECCIÓN: El botón "Notas" ahora está aquí arriba, visible y accesible */}
        {canViewGrades && (
            <Link 
              href="/grades" 
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-secondary/10 text-secondary border border-secondary/20 rounded-xl hover:bg-secondary/20 transition-all shadow-[0_0_15px_rgba(var(--secondary-rgb),0.2)]"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Ver Mis Notas</span>
            </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* COLUMNA 1: Datos Informativos */}
        <div className="space-y-6">
            {/* Card de Datos */}
            <div className="bg-surface/50 backdrop-blur-sm border border-text-main/10 rounded-xl p-6 space-y-4 shadow-sm">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2 border-b border-text-main/10 pb-2">
                    <User className="w-5 h-5 text-primary" /> Datos Personales
                </h3>
                
                <div>
                    <label className="text-xs text-text-muted uppercase block mb-1 font-bold">Nombre Completo</label>
                    <p className="text-text-main font-medium">{p?.full_name || "-"}</p>
                </div>

                <div>
                    <label className="text-xs text-text-muted uppercase block mb-1 font-bold">Correo Electrónico</label>
                    <p className="text-text-main font-medium">{user.email}</p>
                </div>

                <div>
                    <label className="text-xs text-text-muted uppercase block mb-1 font-bold">RUT / Identificador</label>
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-text-muted" />
                        <p className="text-text-main font-medium">{p?.rut || "No registrado"}</p>
                    </div>
                </div>
            </div>

            {/* Nota Informativa */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-500 flex gap-2">
                <div className="shrink-0 mt-0.5">ℹ️</div>
                <div>
                    <strong className="font-bold">Nota:</strong> Si necesitas corregir tu nombre o RUT, por favor contacta directamente al administrador.
                </div>
            </div>
        </div>

        {/* COLUMNA 2: Cambio de Clave */}
        <div className="h-full">
            <ChangePasswordForm />
        </div>

      </div>
    </div>
  );
}