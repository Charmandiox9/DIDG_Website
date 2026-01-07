import { createClient } from "@/infrastructure/supabase/server";
import { redirect } from "next/navigation";
import { User, Shield, CreditCard } from "lucide-react";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default async function ProfilePage() {
  const supabase = await createClient();

  // 1. Verificar Sesión
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Obtener datos del perfil (tabla profiles)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const p = profile as any;

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-4xl mx-auto animate-in fade-in">
      
      <Breadcrumbs 
        items={[{ label: "Mi Perfil" }]} 
      />

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-2xl font-bold text-white uppercase">
                {p?.full_name?.charAt(0) || "U"}
            </span>
        </div>
        <div>
            <h1 className="text-3xl font-display font-bold text-white">
                {p?.full_name || "Usuario"}
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-xs font-mono text-text-muted capitalize">
                <Shield className="w-3 h-3" /> {p?.role === 'admin' ? 'Administrador' : 'Estudiante'}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* COLUMNA 1: Datos Informativos */}
        <div className="space-y-6">
            <div className="bg-surface/30 border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                    <User className="w-5 h-5 text-secondary" /> Datos Personales
                </h3>
                
                <div>
                    <label className="text-xs text-text-muted uppercase block mb-1">Nombre Completo</label>
                    <p className="text-white font-medium">{p?.full_name || "-"}</p>
                </div>

                <div>
                    <label className="text-xs text-text-muted uppercase block mb-1">Correo Electrónico</label>
                    <p className="text-white font-medium">{user.email}</p>
                </div>

                <div>
                    <label className="text-xs text-text-muted uppercase block mb-1">RUT / Identificador</label>
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-text-muted" />
                        <p className="text-white font-medium">{p?.rut || "No registrado"}</p>
                    </div>
                </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-200">
                <strong>Nota:</strong> Si necesitas corregir tu nombre o RUT, por favor contacta directamente al administrador.
            </div>
        </div>

        {/* COLUMNA 2: Cambio de Clave */}
        <div>
            <ChangePasswordForm />
        </div>

      </div>
    </div>
  );
}