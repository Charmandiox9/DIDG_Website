"use client";

import { useState, useEffect, useRef } from "react";

const AFK_TIME = 120000; 
const ATTACK_DURATION = 1600; 

const SPRITES = {
  idle: "/assets/idle.gif",
  sleeping: "/assets/sleep.gif",
  attacking: "/assets/attack.gif",
};

export function CharmanderPet() {
  const [status, setStatus] = useState<"idle" | "sleeping" | "attacking">("idle");
  
  // 1. TRUCO: Usamos un Ref para rastrear el estado en tiempo real
  // Esto permite que los event listeners sepan el estado exacto sin depender de re-renders
  const statusRef = useRef(status);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 2. Sincronizamos el Ref cada vez que el estado visual cambia
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    const handleActivity = () => {
      // LEEMOS EL REF, NO EL STATE
      // Si está durmiendo, lo despertamos inmediatamente
      if (statusRef.current === "sleeping") {
        setStatus("idle");
      }

      // Reiniciamos el timer
      if (timerRef.current) clearTimeout(timerRef.current);
      
      timerRef.current = setTimeout(() => {
        // Al momento de cumplirse el tiempo, verificamos el Ref
        if (statusRef.current !== "attacking") {
          setStatus("sleeping");
        }
      }, AFK_TIME);
    };

    // Eventos globales
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);

    // Timer inicial
    handleActivity();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
    };
  }, []); // Array vacío: Los listeners se crean UNA sola vez y usan el statusRef

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    // Usamos el ref para validación inmediata
    if (statusRef.current === "attacking") return;

    setStatus("attacking");

    // Lógica post-ataque
    setTimeout(() => {
      setStatus("idle");
      // Reiniciamos timer post-ataque
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
          // Verificación segura con Ref
          if (statusRef.current !== "attacking") {
             setStatus("sleeping");
          }
      }, AFK_TIME);
    }, ATTACK_DURATION);
  };

  return (
    <div 
      className="fixed bottom-4 left-4 z-50 cursor-pointer transition-transform hover:scale-110 active:scale-95"
      onClick={handleClick}
      title={status === 'sleeping' ? '¡Despierta!' : 'Click para atacar'}
    >
        {/* Burbuja Zzz */}
        {status === "sleeping" && (
            <div className="absolute -top-4 right-2 animate-bounce text-[10px] font-mono text-white bg-black/60 px-2 py-0.5 rounded-full border border-white/10 z-10">
                Zzz...
            </div>
        )}

      <div className="relative w-16 h-16 md:w-20 md:h-20">
        <img
          src={SPRITES[status]}
          alt="Charmander"
          className="w-full h-full object-contain drop-shadow-lg select-none"
          style={{ imageRendering: "pixelated" }} 
          draggable={false}
        />
      </div>
      
      {/* Efecto fuego */}
      {status === "attacking" && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-orange-500/40 blur-lg rounded-full animate-pulse" />
      )}
    </div>
  );
}