"use client";

import { sendMessage } from "@/core/actions/contact";
import { Github, MapPin, Send, Loader2, CheckCircle2, Terminal } from "lucide-react";
import { useState, useRef } from "react";
import Link from "next/link";
import { CharmanderPet } from "@/components/home/CharmanderPet";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await sendMessage(formData);
      setIsSuccess(true);
      formRef.current?.reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      alert("Error al enviar el mensaje. Inténtalo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 max-w-5xl mx-auto flex items-center justify-center animate-in fade-in duration-700">
      <CharmanderPet />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
        
        {/* Columna Izquierda */}
        <div className="space-y-8">
          <div>
            {/* Título adaptable */}
            <h1 className="text-4xl font-display font-bold text-text-main mb-4">
              Iniciar <span className="text-primary drop-shadow-sm">Transmisión</span>
            </h1>
            <p className="text-text-muted text-lg font-light">
              ¿Tienes un proyecto en mente o quieres colaborar? El canal está abierto y el bot está a la escucha.
            </p>
          </div>

          <div className="space-y-6">
            <Link 
                href="https://github.com/Charmandiox9" 
                target="_blank"
                className="flex items-center gap-4 text-text-muted hover:text-text-main transition-colors group"
            >
              <div className="p-3 rounded-lg bg-surface border border-text-main/10 group-hover:border-primary/50 transition-colors shadow-sm">
                <Github className="w-5 h-5 text-primary" />
              </div>
              <span className="font-mono text-sm group-hover:underline decoration-primary underline-offset-4">
                GitHub
              </span>
            </Link>
            
            <div className="flex items-center gap-4 text-text-muted hover:text-text-main transition-colors">
              <div className="p-3 rounded-lg bg-surface border border-text-main/10 shadow-sm">
                <MapPin className="w-5 h-5 text-secondary" />
              </div>
              <span className="font-mono text-sm">Coquimbo, Chile (Remoto)</span>
            </div>
          </div>

          {/* Terminal Decorativa: bg-surface para adaptarse a ambos temas */}
          <div className="p-6 rounded-xl bg-surface border border-text-main/10 font-mono text-xs text-primary/80 mt-10 relative overflow-hidden shadow-inner">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 animate-pulse"></div>
            <div className="space-y-2">
                <div className="flex gap-2">
                    <Terminal className="w-3 h-3 mt-0.5" />
                    <span>Bot_Listener: ONLINE</span>
                </div>
                <p>{`> Establishing secure handshake...`}</p>
                <p>{`> Waiting for user payload...`}</p>
                <p className="animate-pulse text-text-main">{`> _`}</p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Formulario */}
        {/* bg-surface/50 crea el efecto vidrio tintado en ambos temas */}
        <div className="bg-surface/50 backdrop-blur-md border border-text-main/10 p-8 rounded-2xl relative overflow-hidden shadow-2xl">
          
          {isSuccess && (
            <div className="absolute inset-0 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95 z-10">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-text-main">¡Transmisión Exitosa!</h3>
              <p className="text-text-muted mt-2 font-mono text-xs">El bot ha recibido tus datos.</p>
              <button 
                onClick={() => setIsSuccess(false)} 
                className="mt-8 px-6 py-2 bg-surface hover:bg-text-main/5 rounded border border-text-main/10 text-sm text-text-main transition-colors"
              >
                Enviar otro mensaje
              </button>
            </div>
          )}

          <form ref={formRef} action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-primary uppercase tracking-wider font-bold">Identidad</label>
              <input 
                name="name" 
                required 
                // CAMBIOS CRÍTICOS EN INPUTS:
                // text-text-main: Para que se vea el texto al escribir
                // placeholder:text-text-muted: Para que el placeholder sea gris
                // bg-background/50: Fondo semi-transparente del color del tema
                className="w-full bg-background/50 border border-text-main/10 rounded-lg p-3 text-text-main focus:border-primary/50 focus:bg-background outline-none transition-all placeholder:text-text-muted" 
                placeholder="Nombre o Entidad" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-primary uppercase tracking-wider font-bold">Enlace (Email)</label>
              <input 
                name="email" 
                type="email" 
                required 
                className="w-full bg-background/50 border border-text-main/10 rounded-lg p-3 text-text-main focus:border-primary/50 focus:bg-background outline-none transition-all placeholder:text-text-muted" 
                placeholder="contacto@ejemplo.com" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-primary uppercase tracking-wider font-bold">Asunto</label>
              <input 
                name="subject" 
                required 
                className="w-full bg-background/50 border border-text-main/10 rounded-lg p-3 text-text-main focus:border-primary/50 focus:bg-background outline-none transition-all placeholder:text-text-muted" 
                placeholder="Propuesta de colaboración..." 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-primary uppercase tracking-wider font-bold">Datos</label>
              <textarea 
                name="message" 
                rows={5} 
                required 
                className="w-full bg-background/50 border border-text-main/10 rounded-lg p-3 text-text-main focus:border-primary/50 focus:bg-background outline-none transition-all placeholder:text-text-muted resize-none" 
                placeholder="Detalles de la misión..." 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              // BOTÓN INVERTIDO:
              // bg-text-main: Negro en light / Blanco en dark
              // text-background: Blanco en light / Negro en dark
              className="w-full bg-text-main text-background font-bold py-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg"
            >
              {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    ENVIAR MENSAJE
                  </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}