"use client";

import { useState } from "react";
import { createClient } from "@/infrastructure/supabase/client";
import { Lock, User, Terminal, Save, ShieldCheck, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const supabase = createClient();

  // Función para cambiar contraseña
  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setMessage({ type: 'error', text: "Las contraseñas no coinciden." });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
        setMessage({ type: 'error', text: "La contraseña debe tener al menos 6 caracteres." });
        setLoading(false);
        return;
    }

    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: "Contraseña actualizada correctamente." });
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Configuración del Sistema</h1>
        <p className="text-text-muted font-mono text-sm">Gestiona la seguridad y preferencias del administrador.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TARJETA 1: SEGURIDAD (Cambiar Password) */}
        <div className="bg-surface/50 border border-white/10 p-6 rounded-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="p-2 bg-primary/10 rounded text-primary">
               <Lock className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-bold text-white">Seguridad</h3>
                <p className="text-xs text-text-muted">Actualizar credenciales de acceso</p>
            </div>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase">Nueva Contraseña</label>
                <input 
                    name="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-background/50 border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none"
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase">Confirmar Contraseña</label>
                <input 
                    name="confirm" 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-background/50 border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none"
                />
            </div>

            {message && (
                <div className={`p-3 rounded text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {message.type === 'success' ? <ShieldCheck className="w-4 h-4"/> : <AlertCircle className="w-4 h-4"/>}
                    {message.text}
                </div>
            )}

            <button 
                disabled={loading}
                className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-2 rounded font-mono text-sm transition-colors flex items-center justify-center gap-2"
            >
                {loading ? "Actualizando..." : <><Save className="w-4 h-4" /> Guardar Cambios</>}
            </button>
          </form>
        </div>

        {/* TARJETA 2: ESTADO DEL SISTEMA (Informativo) */}
        <div className="space-y-6">
            
            {/* Estado Servicios */}
            <div className="bg-surface/50 border border-white/10 p-6 rounded-xl">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
                    <div className="p-2 bg-secondary/10 rounded text-secondary">
                        <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Estado de Servicios</h3>
                        <p className="text-xs text-text-muted">Monitor de integraciones</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/5">
                        <span className="text-sm text-text-muted font-mono">Base de Datos (Supabase)</span>
                        <span className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase bg-emerald-500/10 px-2 py-1 rounded">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Conectado
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/5">
                        <span className="text-sm text-text-muted font-mono">Telegram Bot</span>
                        <span className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase bg-emerald-500/10 px-2 py-1 rounded">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Activo
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/5">
                        <span className="text-sm text-text-muted font-mono">Storage (Imágenes)</span>
                        <span className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase bg-emerald-500/10 px-2 py-1 rounded">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Disponible
                        </span>
                    </div>
                </div>
            </div>

            {/* Información de Perfil */}
            <div className="bg-surface/50 border border-white/10 p-6 rounded-xl flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                    <User className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="text-white font-bold">Cuenta Administrador</h4>
                    <p className="text-xs text-text-muted font-mono">Permisos: ROOT_ACCESS</p>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}