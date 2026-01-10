"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      {/* CONTENIDO */}
      <div className="space-y-6 animate-in fade-in zoom-in duration-500">
        
        {/* 1. Charmander Triste */}
        <div className="relative w-40 h-40 mx-auto">
            <img 
                src="/assets/sad.gif" 
                alt="Sad Charmander" 
                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,100,100,0.5)]"
                style={{ imageRendering: "pixelated" }}
            />
        </div>

        {/* 2. Texto de Error */}
        <div className="space-y-2">
            <h1 className="text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10">
                404
            </h1>
            <h2 className="text-2xl font-bold text-white">
                ¡Se apagó la llama!
            </h2>
            <p className="text-text-muted max-w-md mx-auto">
                No pudimos encontrar la página que buscas. Puede que haya sido eliminada o que la URL sea incorrecta.
            </p>
        </div>

        {/* 3. Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
                href="/" 
                className="px-6 py-3 bg-primary text-background font-bold rounded-lg hover:bg-white transition-all duration-300 flex items-center gap-2 group"
            >
                <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                Volver al Inicio
            </Link>
            
            <button 

                onClick={() => window.history.back()} 
                className="px-6 py-3 border border-white/10 text-text-muted font-mono rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2"
            >
               <span className="text-xs">←</span> Regresar
            </button>
        </div>

      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-xs text-text-muted/30 font-mono">
        Error Code: NOT_FOUND_EXCEPTION
      </div>
    </div>
  );
}