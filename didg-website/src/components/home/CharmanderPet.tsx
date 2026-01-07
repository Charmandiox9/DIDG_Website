"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Tiempos (en milisegundos)
const AFK_TIME = 5000; // 5 segundos para pruebas (cámbialo a 30000 o 60000 para prod)
const ATTACK_DURATION = 1200; // Lo que dure tu gif de ataque

// URLs de ejemplo (Reemplázalas con tus archivos locales en /public)
const SPRITES = {
  idle: "/assets/idle.gif", // Saltando
  sleeping: "/assets/sleep.gif", // Durmiendo
  attacking: "/assets/attack.gif", // Fuego (usando uno genérico, busca uno de ataque real)
};

export function CharmanderPet() {
  const [status, setStatus] = useState<"idle" | "sleeping" | "attacking">("idle");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Lógica de detección AFK
  useEffect(() => {
    const resetTimer = () => {
      // Si está atacando, no interrumpimos la animación
      if (status === "attacking") return;

      // Si estaba durmiendo y se mueve el mouse, despierta
      if (status === "sleeping") {
        setStatus("idle");
      }

      // Reiniciamos el contador para volver a dormir
      if (timerRef.current) clearTimeout(timerRef.current);
      
      timerRef.current = setTimeout(() => {
        setStatus((prev) => (prev === "attacking" ? prev : "sleeping"));
      }, AFK_TIME);
    };

    // Escuchamos eventos de actividad
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    // Iniciar timer inicial
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [status]);

  // Manejar click en el Charmander
  const handleClick = () => {
    if (status === "attacking") return;

    setStatus("attacking");

    // Volver a idle después de la animación de ataque
    setTimeout(() => {
      setStatus("idle");
      // Reiniciamos el timer AFK para que no se duerma inmediatamente después de atacar
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setStatus("sleeping"), AFK_TIME);
    }, ATTACK_DURATION);
  };

  return (
    <div 
      className="fixed bottom-4 left-4 z-50 cursor-pointer transition-transform hover:scale-110"
      onClick={handleClick}
      title={status === 'sleeping' ? 'Zzz... (Click para despertar)' : '¡Dracarys!'}
    >
        {/* Burbuja de texto Zzz cuando duerme */}
        {status === "sleeping" && (
            <div className="absolute -top-6 right-0 animate-bounce text-xs font-mono text-white bg-black/50 px-2 py-1 rounded-full">
                Zzz...
            </div>
        )}

      <div className="relative w-24 h-24 md:w-32 md:h-32">
        <img
          src={SPRITES[status]}
          alt="Charmander Pet"
          className="w-full h-full object-contain pixelated drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]"
          style={{ imageRendering: "pixelated" }} // Para que el pixel art se vea nítido
        />
      </div>
      
      {/* Efecto de luz roja en el suelo cuando ataca */}
      {status === "attacking" && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-orange-500/50 blur-xl rounded-full animate-pulse" />
      )}
    </div>
  );
}