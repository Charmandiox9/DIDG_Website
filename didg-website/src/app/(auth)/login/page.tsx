"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/infrastructure/supabase/client";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

// 1. ESQUEMA: Volvemos a validar que sea un EMAIL real
const loginSchema = z.object({
  email: z.string().email("Debes ingresar un correo válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // 2. LÓGICA DIRECTA: Sin transformaciones raras
      // Enviamos el correo y la contraseña tal cual los escribió el usuario.
      
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email.trim().toLowerCase(), // Limpiamos espacios y mayúsculas por si acaso
        password: data.password, // Se envía tal cual (El alumno debe escribir su RUT)
      });

      if (error) {
        throw error;
      }

      router.push("/");
      router.refresh();
      
    } catch (err: any) {
      console.error(err);
      setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden group w-full max-w-md mx-auto">
      
      {/* Decoración Cyber */}
      <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 transition-colors duration-500 rounded-2xl pointer-events-none" />
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 border border-primary/20">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-display font-bold text-white tracking-wide">
          ACCESO DENEGADO
        </h1>
        <p className="text-text-muted text-sm mt-2 font-mono">
          Identifícate para ingresar al sistema.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
        
        {/* Input EMAIL */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-primary uppercase tracking-wider">
            Correo Institucional
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              {...register("email")}
              type="email"
              placeholder="nombre@dominio.cl"
              className="w-full bg-background/50 border border-white/10 rounded px-10 py-3 text-sm text-white placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-error font-mono flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Input PASSWORD */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-primary uppercase tracking-wider">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full bg-background/50 border border-white/10 rounded px-10 py-3 text-sm text-white placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-error font-mono flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.password.message}
            </p>
          )}
          {/* MENSAJE DE AYUDA CLAVE */}
          <div className="flex justify-end">
             <p className="text-[10px] text-text-muted opacity-70 italic">
               Estudiantes: Usar RUT sin puntos ni guion como contraseña.
             </p>
          </div>
        </div>

        {/* Mensaje de Error General */}
        {error && (
          <div className="p-3 rounded bg-error/10 border border-error/20 text-error text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-background font-bold py-3 rounded hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              ENTRANDO...
            </>
          ) : (
            "INICIAR SESIÓN"
          )}
        </button>

        <div className="text-center">
          <Link href="/" className="text-xs text-text-muted hover:text-white transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </form>
    </div>
  );
}