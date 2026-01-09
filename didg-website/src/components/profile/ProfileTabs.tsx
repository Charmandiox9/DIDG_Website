"use client";

import { useState } from "react";
import Link from "next/link"; // <--- Importamos Link
import { User, Shield, CreditCard, GraduationCap, Lock, Calculator, ExternalLink } from "lucide-react";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { GradeSimulator } from "@/components/tools/GradeSimulator";
import { cn } from "@/core/utils/cn";

interface ProfileTabsProps {
  profile: any;
  email: string | undefined;
}

export function ProfileTabs({ profile: p, email }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"info" | "grades">("info");

  // Verificar si puede ver notas (Estudiante o Admin)
  const canViewGrades = p?.role === "student" || p?.role === "admin";

  return (
    <div className="space-y-8">
      
      {/* --- HEADER (Avatar + Info + BOTÓN DE NOTAS) --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Lado Izquierdo: Identidad */}
        <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                <span className="text-2xl font-bold text-white uppercase">
                    {p?.full_name?.charAt(0) || "U"}
                </span>
            </div>
            <div>
                <h1 className="text-3xl font-display font-bold text-text-main">
                    {p?.full_name || "Usuario"}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface border border-text-main/10 text-xs font-mono text-text-muted capitalize shadow-sm">
                        <Shield className="w-3 h-3" /> {p?.role === 'admin' ? 'Administrador' : 'Estudiante'}
                    </span>
                </div>
            </div>
        </div>

        {/* Lado Derecho: BOTÓN DE NOTAS OFICIALES */}
        {/* Aquí recuperamos el botón que te faltaba */}
        {canViewGrades && (
            <Link 
              href="/grades" 
              className="group flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold bg-secondary/10 text-secondary border border-secondary/20 rounded-xl hover:bg-secondary/20 transition-all shadow-[0_0_15px_rgba(var(--secondary-rgb),0.2)]"
            >
              <div className="p-1 bg-secondary rounded-full text-white group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-4 h-4" />
              </div>
              <span>Ver Notas Oficiales</span>
              <ExternalLink className="w-3 h-3 opacity-50" />
            </Link>
        )}

      </div>

      {/* --- SELECTOR DE PESTAÑAS --- */}
      <div className="flex items-center gap-2 border-b border-text-main/10 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("info")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
            activeTab === "info"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-main hover:bg-surface/50 rounded-t-lg"
          )}
        >
          <User className="w-4 h-4" />
          Perfil y Seguridad
        </button>

        <button
          onClick={() => setActiveTab("grades")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
            activeTab === "grades"
              ? "border-secondary text-secondary"
              : "border-transparent text-text-muted hover:text-text-main hover:bg-surface/50 rounded-t-lg"
          )}
        >
          <Calculator className="w-4 h-4" />
          Simulador (Herramienta)
        </button>
      </div>

      {/* --- CONTENIDO DE LAS PESTAÑAS --- */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* PESTAÑA 1: INFO & SEGURIDAD */}
        {activeTab === "info" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
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
                        <p className="text-text-main font-medium">{email}</p>
                    </div>
                    <div>
                        <label className="text-xs text-text-muted uppercase block mb-1 font-bold">RUT / Identificador</label>
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-text-muted" />
                            <p className="text-text-main font-medium">{p?.rut || "No registrado"}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-500 flex gap-2">
                    <div className="shrink-0 mt-0.5">ℹ️</div>
                    <div><strong className="font-bold">Nota:</strong> Contacta al admin para cambios de datos sensibles.</div>
                </div>
            </div>

            <div>
                 <div className="bg-surface/50 backdrop-blur-sm border border-text-main/10 rounded-xl p-6 shadow-sm h-full">
                    <h3 className="text-lg font-bold text-text-main flex items-center gap-2 border-b border-text-main/10 pb-4 mb-4">
                        <Lock className="w-5 h-5 text-secondary" /> Contraseña
                    </h3>
                    <ChangePasswordForm />
                 </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: SIMULADOR */}
        {activeTab === "grades" && (
          <div>
            <div className="mb-6 bg-secondary/10 border border-secondary/20 p-4 rounded-xl text-secondary text-sm flex items-center gap-3">
                <Calculator className="w-5 h-5 shrink-0" />
                <p>
                    <strong>Simulador de Escenarios:</strong> Esta herramienta es para proyectar tus notas. 
                    Para ver tus notas reales registradas, usa el botón "Ver Notas Oficiales" arriba.
                </p>
            </div>
            <GradeSimulator />
          </div>
        )}

      </div>
    </div>
  );
}