"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Loader2, Save, AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { changePassword } from "@/core/actions/auth";

// 1. Esquema actualizado: Agregamos currentPassword
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Debes ingresar tu contraseña actual"), // <--- NUEVO
  password: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas nuevas no coinciden",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = async (data: PasswordFormValues) => {
    setLoading(true);
    setMessage(null);

    // 2. Enviamos AMBAS contraseñas a la acción
    const res = await changePassword(data.currentPassword, data.password);

    if (res?.error) {
      setMessage({ type: 'error', text: res.error });
    } else {
      setMessage({ type: 'success', text: "Contraseña actualizada correctamente." });
      reset(); 
    }
    setLoading(false);
  };

  return (
    <div className="bg-surface/30 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Lock className="w-5 h-5 text-primary" />
        Cambiar Contraseña
      </h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* --- CAMPO NUEVO: Contraseña Actual --- */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-text-muted uppercase flex items-center gap-1">
             <KeyRound className="w-3 h-3"/> Contraseña Actual
          </label>
          <input
            {...register("currentPassword")}
            type="password"
            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-secondary focus:outline-none transition-colors"
            placeholder="Ingresa tu clave actual"
          />
          {errors.currentPassword && <p className="text-xs text-error">{errors.currentPassword.message}</p>}
        </div>

        <hr className="border-white/5 my-2" />

        {/* Nueva Contraseña */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-text-muted uppercase">Nueva Contraseña</label>
          <input
            {...register("password")}
            type="password"
            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-primary focus:outline-none transition-colors"
            placeholder="Mínimo 6 caracteres"
          />
          {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
        </div>

        {/* Confirmar Contraseña */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-text-muted uppercase">Confirmar Nueva Contraseña</label>
          <input
            {...register("confirmPassword")}
            type="password"
            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-primary focus:outline-none transition-colors"
            placeholder="Repite la nueva contraseña"
          />
          {errors.confirmPassword && <p className="text-xs text-error">{errors.confirmPassword.message}</p>}
        </div>

        {/* Feedback */}
        {message && (
          <div className={`p-3 rounded-lg text-sm flex items-center gap-2 animate-in fade-in ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4"/> : <AlertCircle className="w-4 h-4"/>}
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-2 rounded-lg border border-white/10 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Actualizar Clave</>}
        </button>
      </form>
    </div>
  );
}