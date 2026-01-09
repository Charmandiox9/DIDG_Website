"use client";

import { useState, useEffect, useRef } from "react";

const AFK_TIME = 120000; 
const ATTACK_DURATION = 1600; 
const BASE_BOTTOM = 16; // 16px equivale a bottom-4 de Tailwind

const SPRITES = {
  idle: "/assets/idle.gif",
  sleeping: "/assets/sleep.gif",
  attacking: "/assets/attack.gif",
};

export function CharmanderPet() {
  const [status, setStatus] = useState<"idle" | "sleeping" | "attacking">("idle");
  // 1. NUEVO ESTADO: Para controlar la posición vertical dinámica
  const [bottomOffset, setBottomOffset] = useState(BASE_BOTTOM);
  
  const statusRef = useRef(status);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sincronizar Ref
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // --- NUEVA LÓGICA: DETECCIÓN DEL FOOTER ---
  useEffect(() => {
    const handleScrollPosition = () => {
      // Buscamos la etiqueta <footer> (o puedes usar un ID si prefieres)
      const footer = document.querySelector('footer');
      
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Si la parte superior del footer está visible en la ventana
        if (footerRect.top < windowHeight) {
          // Calculamos cuánto del footer se ve
          const overlap = windowHeight - footerRect.top;
          // Ajustamos la posición: Base + lo que el footer ha subido
          setBottomOffset(BASE_BOTTOM + overlap);
        } else {
          // Si no se ve el footer, volvemos a la posición base
          setBottomOffset(BASE_BOTTOM);
        }
      }
    };

    window.addEventListener("scroll", handleScrollPosition);
    window.addEventListener("resize", handleScrollPosition); // Por si cambian el tamaño de ventana

    // Chequeo inicial
    handleScrollPosition();

    return () => {
      window.removeEventListener("scroll", handleScrollPosition);
      window.removeEventListener("resize", handleScrollPosition);
    };
  }, []);

  // --- LÓGICA EXISTENTE DE AFK ---
  useEffect(() => {
    const handleActivity = () => {
      if (statusRef.current === "sleeping") {
        setStatus("idle");
      }

      if (timerRef.current) clearTimeout(timerRef.current);
      
      timerRef.current = setTimeout(() => {
        if (statusRef.current !== "attacking") {
          setStatus("sleeping");
        }
      }, AFK_TIME);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);

    handleActivity();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (statusRef.current === "attacking") return;

    setStatus("attacking");

    setTimeout(() => {
      setStatus("idle");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
          if (statusRef.current !== "attacking") {
             setStatus("sleeping");
          }
      }, AFK_TIME);
    }, ATTACK_DURATION);
  };

  return (
    <div 
      className="fixed left-4 z-50 cursor-pointer transition-transform hover:scale-110 active:scale-95"
      // CAMBIO: Usamos style para controlar el bottom dinámicamente
      // Quitamos 'bottom-4' de className y lo pasamos aquí
      style={{ bottom: `${bottomOffset}px`, transitionProperty: 'transform, bottom', transitionDuration: '100ms' }}
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