"use client";

import { useState } from "react";
import { Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/infrastructure/supabase/client";
import { useRouter } from "next/navigation";

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: "Las contraseñas no coinciden" });
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: "La contraseña debe tener al menos 6 caracteres" });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setMessage({ type: 'success', text: "Contraseña actualizada correctamente" });
      e.currentTarget.reset();
      router.refresh();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || "Error al actualizar la contraseña" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Card Container: bg-surface/50 para adaptarse a Light/Dark
    <div className="bg-surface/50 backdrop-blur-sm border border-text-main/10 rounded-xl p-6 space-y-6 shadow-sm h-full">
      <h3 className="text-lg font-bold text-text-main flex items-center gap-2 border-b border-text-main/10 pb-2">
        <Lock className="w-5 h-5 text-primary" /> Cambiar Contraseña
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="space-y-2">
          <label className="text-xs font-mono text-primary uppercase tracking-wider font-bold">
            Nueva Contraseña
          </label>
          <input 
            name="newPassword" 
            type="password" 
            required
            placeholder="••••••••"
            // Input adaptable: fondo transparente tintado, texto adaptable
            className="w-full bg-background/50 border border-text-main/10 rounded-lg p-3 text-text-main placeholder:text-text-muted/50 focus:border-primary/50 focus:bg-background outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-primary uppercase tracking-wider font-bold">
            Confirmar Contraseña
          </label>
          <input 
            name="confirmPassword" 
            type="password" 
            required
            placeholder="••••••••"
            className="w-full bg-background/50 border border-text-main/10 rounded-lg p-3 text-text-main placeholder:text-text-muted/50 focus:border-primary/50 focus:bg-background outline-none transition-all"
          />
        </div>

        {/* Mensajes de Feedback */}
        {message && (
          <div className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
              : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          // Botón principal: Primary con texto background para contraste
          className="w-full bg-primary text-background font-bold py-3 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-[0_0_15px_var(--primary-glow)]"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Actualizar Clave"
          )}
        </button>

      </form>
    </div>
  );
}