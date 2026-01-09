"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/infrastructure/supabase/client";
import { Lock, User, Terminal, Save, ShieldCheck, AlertCircle, Loader2, RefreshCw, Database, HardDrive } from "lucide-react";
import { checkBotStatus } from "@/core/actions/telegram";
// 1. IMPORTAMOS LA NUEVA ACCIÓN
import { getSystemStatus } from "@/core/actions/system";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const supabase = createClient();

  // --- LÓGICA DE PASSWORD (Igual que antes) ---
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

  // --- ESTADOS DE MONITOREO ---
  const [checking, setChecking] = useState(true);
  // Telegram
  const [botStatus, setBotStatus] = useState<'online' | 'offline'>('offline');
  const [botName, setBotName] = useState("");
  // Database
  const [dbStatus, setDbStatus] = useState<{ status: string, latency: number, count: number }>({ status: 'offline', latency: 0, count: 0 });
  // Storage
  const [storageStatus, setStorageStatus] = useState<{ status: string, buckets: number }>({ status: 'offline', buckets: 0 });
  // Usuario
  const [userEmail, setUserEmail] = useState("Cargando...");
  const [lastSignIn, setLastSignIn] = useState("");

  // Efecto inicial
  useEffect(() => {
    checkAllSystems();
    getUserInfo();
  }, []);

  const checkAllSystems = async () => {
    setChecking(true);
    
    // 1. Ejecutar promesas en paralelo para mayor velocidad
    const [botRes, systemRes] = await Promise.all([
        checkBotStatus(),
        getSystemStatus()
    ]);

    // 2. Actualizar Telegram
    if (botRes.ok) {
      setBotStatus('online');
      setBotName(botRes.username || "Bot Activo");
    } else {
      setBotStatus('offline');
    }

    // 3. Actualizar DB y Storage (Datos reales)
    setDbStatus({
        status: systemRes.db.status,
        latency: systemRes.db.latency,
        count: systemRes.db.count
    });

    setStorageStatus({
        status: systemRes.storage.status,
        buckets: systemRes.storage.buckets
    });

    setChecking(false);
  };

  const getUserInfo = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        setUserEmail(user.email || "Sin Email");
        // Formatear fecha de último login
        if (user.last_sign_in_at) {
            const date = new Date(user.last_sign_in_at);
            setLastSignIn(date.toLocaleString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }));
        }
    }
  };

  // Componente auxiliar para el Badge de estado
  const StatusBadge = ({ status, label }: { status: string, label?: string }) => {
    if (checking) {
        return (
            <span className="flex items-center gap-2 text-xs text-text-muted font-bold uppercase bg-text-main/5 px-2 py-1 rounded">
                <Loader2 className="w-3 h-3 animate-spin" /> Verificando...
            </span>
        );
    }
    if (status === 'online') {
        return (
            <span className="flex items-center gap-2 text-xs text-emerald-500 font-bold uppercase bg-emerald-500/10 px-2 py-1 rounded">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {label || "Online"}
            </span>
        );
    }
    return (
        <span className="flex items-center gap-2 text-xs text-red-500 font-bold uppercase bg-red-500/10 px-2 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Offline
        </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-text-main">Configuración del Sistema</h1>
        <p className="text-text-muted font-mono text-sm">Gestiona la seguridad y monitorea la infraestructura.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TARJETA 1: SEGURIDAD */}
        <div className="bg-surface/50 border border-text-main/10 p-6 rounded-xl space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-text-main/5 pb-4">
            <div className="p-2 bg-primary/10 rounded text-primary">
               <Lock className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-bold text-text-main">Seguridad</h3>
                <p className="text-xs text-text-muted">Actualizar credenciales</p>
            </div>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase font-bold">Nueva Contraseña</label>
                <input name="password" type="password" placeholder="••••••••" className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors" />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase font-bold">Confirmar Contraseña</label>
                <input name="confirm" type="password" placeholder="••••••••" className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors" />
            </div>

            {message && (
                <div className={`p-3 rounded text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {message.type === 'success' ? <ShieldCheck className="w-4 h-4"/> : <AlertCircle className="w-4 h-4"/>}
                    {message.text}
                </div>
            )}

            <button disabled={loading} className="w-full bg-background border border-text-main/10 text-text-main hover:bg-text-main/5 py-2 rounded font-mono text-sm transition-colors flex items-center justify-center gap-2 font-bold shadow-sm">
                {loading ? "Actualizando..." : <><Save className="w-4 h-4 text-primary" /> Guardar Cambios</>}
            </button>
          </form>
        </div>

        {/* TARJETA 2: ESTADO DEL SISTEMA (Real) */}
        <div className="space-y-6">
            
            <div className="bg-surface/50 border border-text-main/10 p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 border-b border-text-main/5 pb-4 mb-4">
                    <div className="p-2 bg-secondary/10 rounded text-secondary">
                        <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-text-main">Estado de Servicios</h3>
                        <p className="text-xs text-text-muted">Monitor de infraestructura en tiempo real</p>
                    </div>
                    <button onClick={checkAllSystems} disabled={checking} className="p-2 hover:bg-text-main/5 rounded-full text-text-muted transition-colors ml-auto">
                        <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* 1. DATABASE */}
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded border border-text-main/5">
                        <div className="flex items-center gap-3">
                            <Database className="w-4 h-4 text-text-muted" />
                            <div className="flex flex-col">
                                <span className="text-sm text-text-muted font-mono font-bold">Base de Datos</span>
                                {!checking && dbStatus.status === 'online' && (
                                    <span className="text-[10px] text-text-muted">
                                        Latencia: {dbStatus.latency}ms | Reg: {dbStatus.count}
                                    </span>
                                )}
                            </div>
                        </div>
                        <StatusBadge status={dbStatus.status} />
                    </div>

                    {/* 2. TELEGRAM */}
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded border border-text-main/5">
                        <div className="flex items-center gap-3">
                            <Terminal className="w-4 h-4 text-text-muted" />
                            <div className="flex flex-col">
                                <span className="text-sm text-text-muted font-mono font-bold">Telegram Bot</span>
                                {!checking && botStatus === 'online' && (
                                    <span className="text-[10px] text-text-muted">@{botName}</span>
                                )}
                            </div>
                        </div>
                        <StatusBadge status={botStatus} />
                    </div>

                    {/* 3. STORAGE */}
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded border border-text-main/5">
                        <div className="flex items-center gap-3">
                            <HardDrive className="w-4 h-4 text-text-muted" />
                            <div className="flex flex-col">
                                <span className="text-sm text-text-muted font-mono font-bold">Storage</span>
                                {!checking && storageStatus.status === 'online' && (
                                    <span className="text-[10px] text-text-muted">Buckets: {storageStatus.buckets}</span>
                                )}
                            </div>
                        </div>
                        <StatusBadge status={storageStatus.status} label="Disponible" />
                    </div>
                </div>
            </div>

            {/* Información de Perfil */}
            <div className="bg-surface/50 border border-text-main/10 p-6 rounded-xl flex items-center justify-between gap-4 shadow-sm group hover:border-text-main/20 transition-colors">
                
                <div className="flex items-center gap-4">
                    {/* Avatar con indicador de estado */}
                    <div className="relative">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                            <User className="w-6 h-6" />
                        </div>
                        {/* Puntito verde de "Online" */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-surface rounded-full"></div>
                    </div>
                    
                    <div>
                        {/* Email Real */}
                        <h4 className="text-text-main font-bold text-sm">{userEmail}</h4>
                        
                        {/* Último Login */}
                        <p className="text-[10px] text-text-muted font-mono mt-1 flex items-center gap-1">
                            <Terminal className="w-3 h-3" />
                            Acceso: {lastSignIn || "Ahora"}
                        </p>
                    </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}