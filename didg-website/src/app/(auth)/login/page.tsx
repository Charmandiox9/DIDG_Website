"use client";

import { useFormState, useFormStatus } from "react-dom";
import { initiateLogin, completeLogin } from "@/core/actions/auth-2fa";
import { Lock, Mail, KeyRound, Loader2, AlertCircle, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

const initialState = { 
  error: "", 
  step: "login", 
  email: "", 
  password: "" 
};

function SubmitButton({ step }: { step: string }) {
  const { pending } = useFormStatus();
  
  return (
    <button
      disabled={pending}
      className="w-full bg-primary text-background font-bold py-3 rounded hover:bg-primary/90 hover:shadow-[0_0_20px_var(--primary-glow)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {step === "verify_2fa" ? "VERIFICANDO..." : "PROCESANDO..."}
        </>
      ) : (
        step === "verify_2fa" ? (
            <>VERIFICAR CÓDIGO <ShieldCheck className="w-4 h-4" /></>
        ) : (
            <>INICIAR SESIÓN <ArrowRight className="w-4 h-4" /></>
        )
      )}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(async (prev: any, formData: FormData) => {
    if (prev.step === "verify_2fa") {
      return await completeLogin(prev, formData);
    } else {
      return await initiateLogin(prev, formData);
    }
  }, initialState);

  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.step === "verify_2fa") {
      codeInputRef.current?.focus();
    }
  }, [state.step]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
        
      <div className="bg-surface/50 backdrop-blur-xl border border-text-main/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden group w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500">
        
        {/* Decoración Cyber */}
        <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 transition-colors duration-500 rounded-2xl pointer-events-none" />
        
        <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 border shadow-[0_0_15px_var(--primary-glow)] transition-colors duration-500 ${state.step === "verify_2fa" ? "bg-secondary/10 border-secondary/20" : "bg-primary/10 border-primary/20"}`}>
                {state.step === "verify_2fa" ? (
                    <ShieldCheck className="w-6 h-6 text-secondary animate-pulse" />
                ) : (
                    <Lock className="w-6 h-6 text-primary" />
                )}
            </div>
            
            <h1 className="text-2xl font-display font-bold text-text-main tracking-wide">
                {state.step === "verify_2fa" ? "SEGURIDAD 2FA" : "ACCESO DENEGADO"}
            </h1>
            <p className="text-text-muted text-sm mt-2 font-mono">
                {state.step === "verify_2fa" 
                    ? "Hemos enviado un código a tu Telegram." 
                    : "Identifícate para ingresar al sistema."}
            </p>
        </div>

        <form action={formAction} className="space-y-6 relative z-10">
            
            {/* --- PASO 1: CREDENCIALES --- */}
            <div className={state.step === "verify_2fa" ? "hidden" : "space-y-6"}>
                <div className="space-y-2">
                    <label className="text-xs font-mono text-primary uppercase tracking-wider font-bold">
                        Correo Institucional
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            name="email"
                            type="email"
                            placeholder="nombre@dominio.cl"
                            required
                            className="w-full bg-background/50 border border-text-main/10 rounded px-10 py-3 text-sm text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-mono text-primary uppercase tracking-wider font-bold">
                        Contraseña
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="w-full bg-background/50 border border-text-main/10 rounded px-10 py-3 text-sm text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <div className="flex justify-end">
                        <p className="text-[10px] text-text-muted opacity-70 italic">
                            Estudiantes: Usar RUT como contraseña.
                        </p>
                    </div>
                </div>
            </div>

            {/* --- PASO 2: CÓDIGO TELEGRAM --- */}
            {state.step === "verify_2fa" && (
                <div className="space-y-4 animate-in slide-in-from-right duration-300">
                    {/* Inputs ocultos para reenviar las credenciales al completar */}
                    <input type="hidden" name="email" value={state.email} />
                    <input type="hidden" name="password" value={state.password} />

                    <div className="space-y-2">
                        <label className="text-xs font-mono text-secondary uppercase tracking-wider font-bold flex items-center gap-2">
                             <KeyRound className="w-3 h-3" /> Código de Verificación
                        </label>
                        <input
                            ref={codeInputRef}
                            name="code"
                            type="text"
                            placeholder="123456"
                            maxLength={6}
                            autoComplete="one-time-code"
                            className="w-full bg-background/50 border border-secondary/50 rounded p-4 text-center text-2xl tracking-[0.5em] font-mono text-text-main focus:border-secondary outline-none transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                        />
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-text-muted">
                            Revisa el chat con tu Bot de Telegram.
                        </p>
                    </div>
                </div>
            )}

            {/* Mensaje de Error General */}
            {state.error && (
                <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono flex items-center gap-2 animate-pulse">
                    <AlertCircle className="w-4 h-4" />
                    {state.error}
                </div>
            )}

            {/* Botón Submit (Cambia texto según el paso) */}
            <SubmitButton step={state.step ?? "login"} />

            <div className="text-center">
                <Link href="/" className="text-xs text-text-muted hover:text-text-main transition-colors font-medium">
                    ← Volver al inicio
                </Link>
            </div>
        </form>
      </div>
    </div>
  );
}