"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/infrastructure/supabase/client";
import { Lock, User, Terminal, Save, ShieldCheck, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { checkBotStatus } from "@/core/actions/telegram";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const supabase = createClient();

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

  // ESTADO PARA EL BOT
  const [botStatus, setBotStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [botName, setBotName] = useState("");

  // Efecto para chequear el bot al montar el componente
  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setBotStatus('loading');
    const res = await checkBotStatus();
    if (res.ok) {
      setBotStatus('online');
      setBotName(res.username || "Bot Activo");
    } else {
      setBotStatus('offline');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div>
        {/* Título adaptable */}
        <h1 className="text-3xl font-display font-bold text-text-main">Configuración del Sistema</h1>
        <p className="text-text-muted font-mono text-sm">Gestiona la seguridad y preferencias del administrador.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TARJETA 1: SEGURIDAD (Cambiar Password) */}
        {/* Container: bg-surface/50 */}
        <div className="bg-surface/50 border border-text-main/10 p-6 rounded-xl space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-text-main/5 pb-4">
            <div className="p-2 bg-primary/10 rounded text-primary">
               <Lock className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-bold text-text-main">Seguridad</h3>
                <p className="text-xs text-text-muted">Actualizar credenciales de acceso</p>
            </div>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase font-bold">Nueva Contraseña</label>
                <input 
                    name="password" 
                    type="password" 
                    placeholder="••••••••" 
                    // Input adaptable
                    className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors"
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase font-bold">Confirmar Contraseña</label>
                <input 
                    name="confirm" 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors"
                />
            </div>

            {message && (
                <div className={`p-3 rounded text-sm flex items-center gap-2 ${
                    message.type === 'success' 
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                    {message.type === 'success' ? <ShieldCheck className="w-4 h-4"/> : <AlertCircle className="w-4 h-4"/>}
                    {message.text}
                </div>
            )}

            <button 
                disabled={loading}
                // Botón adaptable: bg-background border-text-main/10
                className="w-full bg-background border border-text-main/10 text-text-main hover:bg-text-main/5 py-2 rounded font-mono text-sm transition-colors flex items-center justify-center gap-2 font-bold shadow-sm"
            >
                {loading ? "Actualizando..." : <><Save className="w-4 h-4 text-primary" /> Guardar Cambios</>}
            </button>
          </form>
        </div>

        {/* TARJETA 2: ESTADO DEL SISTEMA (Informativo) */}
        <div className="space-y-6">
            
            {/* Estado Servicios */}
            <div className="bg-surface/50 border border-text-main/10 p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 border-b border-text-main/5 pb-4 mb-4">
                    <div className="p-2 bg-secondary/10 rounded text-secondary">
                        <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-text-main">Estado de Servicios</h3>
                        <p className="text-xs text-text-muted">Monitor de integraciones</p>
                    </div>
                    <button onClick={checkStatus} className="p-2 hover:bg-text-main/5 rounded-full text-text-muted transition-colors">
                        <RefreshCw className={`w-4 h-4 ${botStatus === 'loading' ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Item de estado: bg-background/50 */}
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded border border-text-main/5">
                        <span className="text-sm text-text-muted font-mono font-bold">Base de Datos (Supabase)</span>
                        <span className="flex items-center gap-2 text-xs text-emerald-500 font-bold uppercase bg-emerald-500/10 px-2 py-1 rounded">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Conectado
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background/50 rounded border border-text-main/5">
                        <div className="flex flex-col">
                            <span className="text-sm text-text-muted font-mono font-bold">Telegram Bot</span>
                            {botStatus === 'online' && <span className="text-[10px] text-text-muted">@{botName}</span>}
                        </div>
                        
                        {botStatus === 'loading' ? (
                            <span className="flex items-center gap-2 text-xs text-text-muted font-bold uppercase bg-text-main/5 px-2 py-1 rounded">
                                <Loader2 className="w-3 h-3 animate-spin" /> Verificando...
                            </span>
                        ) : botStatus === 'online' ? (
                            <span className="flex items-center gap-2 text-xs text-emerald-500 font-bold uppercase bg-emerald-500/10 px-2 py-1 rounded">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Online
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 text-xs text-red-500 font-bold uppercase bg-red-500/10 px-2 py-1 rounded">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                Offline
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background/50 rounded border border-text-main/5">
                        <span className="text-sm text-text-muted font-mono font-bold">Storage (Imágenes)</span>
                        <span className="flex items-center gap-2 text-xs text-emerald-500 font-bold uppercase bg-emerald-500/10 px-2 py-1 rounded">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Disponible
                        </span>
                    </div>
                </div>
            </div>

            {/* Información de Perfil */}
            <div className="bg-surface/50 border border-text-main/10 p-6 rounded-xl flex items-center gap-4 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                    <User className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="text-text-main font-bold">Cuenta Administrador</h4>
                    <p className="text-xs text-text-muted font-mono">Permisos: ROOT_ACCESS</p>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}