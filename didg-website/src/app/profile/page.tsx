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

  // 2. Obtener datos del perfil
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
        {/* Avatar: El texto dentro sigue siendo blanco porque el fondo es un gradiente fuerte */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <span className="text-2xl font-bold text-white uppercase">
                {p?.full_name?.charAt(0) || "U"}
            </span>
        </div>
        <div>
            {/* Título adaptable */}
            <h1 className="text-3xl font-display font-bold text-text-main">
                {p?.full_name || "Usuario"}
            </h1>
            {/* Badge adaptable: bg-surface y border-text-main/10 */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface border border-text-main/10 text-xs font-mono text-text-muted capitalize shadow-sm">
                <Shield className="w-3 h-3" /> {p?.role === 'admin' ? 'Administrador' : 'Estudiante'}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* COLUMNA 1: Datos Informativos */}
        <div className="space-y-6">
            {/* Card: bg-surface/50 y border-text-main/10 */}
            <div className="bg-surface/50 backdrop-blur-sm border border-text-main/10 rounded-xl p-6 space-y-4 shadow-sm">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2 border-b border-text-main/10 pb-2">
                    <User className="w-5 h-5 text-secondary" /> Datos Personales
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

            {/* Nota Azul: texto ajustado para contraste universal */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-500">
                <strong className="font-bold">Nota:</strong> Si necesitas corregir tu nombre o RUT, por favor contacta directamente al administrador.
            </div>
        </div>

        {/* COLUMNA 2: Cambio de Clave */}
        {/* Asumo que ChangePasswordForm ya tiene inputs/botones adaptados. 
            Si no, recuerda aplicarle bg-surface/50, text-text-main, etc. */}
        <div>
            <ChangePasswordForm />
        </div>

      </div>
    </div>
  );
}