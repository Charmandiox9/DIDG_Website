"use client";

import { registerStudent } from "@/core/actions/students";
import { UserPlus, Mail, IdCard, User, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";

// Estado inicial del formulario
const initialState = {
  success: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-primary text-background font-bold py-3 rounded hover:bg-primary/90 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
      {pending ? "Registrando..." : "Registrar Estudiante"}
    </button>
  );
}

export function StudentRegisterForm() {
  // Hook mágico de Next.js para manejar Server Actions sin try/catch manual
  const [state, formAction] = useFormState(registerStudent, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Si fue exitoso, limpiamos el formulario
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div className="bg-surface/50 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <UserPlus className="w-5 h-5 text-primary" />
        Matricular Nuevo Alumno
      </h3>

      <form ref={formRef} action={formAction} className="space-y-4">
        
        {/* ... INPUTS (Mismo código de antes: Nombre, Email, RUT) ... */}
        <div className="space-y-1">
          <label className="text-xs font-mono text-text-muted uppercase">Nombre Completo</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
            <input name="full_name" required placeholder="Ej: Juan Pérez" className="w-full bg-background/50 border border-white/10 rounded pl-9 p-2 text-sm text-white focus:border-primary/50 outline-none" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-text-muted uppercase">Correo Institucional</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
            <input name="email" type="email" required placeholder="alumno@instituto.cl" className="w-full bg-background/50 border border-white/10 rounded pl-9 p-2 text-sm text-white focus:border-primary/50 outline-none" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-text-muted uppercase">RUT (Será su contraseña)</label>
          <div className="relative">
            <IdCard className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
            <input name="rut" required placeholder="12.345.678-9" className="w-full bg-background/50 border border-white/10 rounded pl-9 p-2 text-sm text-white focus:border-primary/50 outline-none" />
          </div>
        </div>

        {/* --- ZONA DE MENSAJES DE ESTADO --- */}
        
        {/* Mensaje de Error */}
        {state.message && !state.success && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded flex items-center gap-2 text-red-200 text-sm animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {state.message}
          </div>
        )}

        {/* Mensaje de Éxito */}
        {state.success && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded flex items-center gap-2 text-green-200 text-sm animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {state.message}
          </div>
        )}

        <SubmitButton />
        
        <p className="text-[10px] text-text-muted text-center mt-2">
          El estudiante podrá iniciar sesión usando este Email y su RUT como contraseña.
        </p>
      </form>
    </div>
  );
}