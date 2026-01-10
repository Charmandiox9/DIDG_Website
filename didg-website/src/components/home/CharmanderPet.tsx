"use client";

import { useState, useEffect, useRef } from "react";

const AFK_TIME = 120000; 
const ATTACK_DURATION = 1600; 
const BASE_BOTTOM = 16; 

const SPRITES = {
  idle: "/assets/idle.gif",
  sleeping: "/assets/sleep.gif",
  attacking: "/assets/attack.gif",
};

export function CharmanderPet() {
  const [status, setStatus] = useState<"idle" | "sleeping" | "attacking">("idle");
  const [bottomOffset, setBottomOffset] = useState(BASE_BOTTOM);
  
  const statusRef = useRef(status);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    const handleScrollPosition = () => {
      const footer = document.querySelector('footer');
      
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (footerRect.top < windowHeight) {
          const overlap = windowHeight - footerRect.top;
          setBottomOffset(BASE_BOTTOM + overlap);
        } else {
          setBottomOffset(BASE_BOTTOM);
        }
      }
    };

    window.addEventListener("scroll", handleScrollPosition);
    window.addEventListener("resize", handleScrollPosition);

    handleScrollPosition();

    return () => {
      window.removeEventListener("scroll", handleScrollPosition);
      window.removeEventListener("resize", handleScrollPosition);
    };
  }, []);

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
    window.addEventListener("touchstart", handleActivity);

    handleActivity();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
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
      className="fixed left-2 md:left-4 z-40 cursor-pointer transition-transform hover:scale-110 active:scale-95 touch-none"
      style={{ bottom: `${bottomOffset}px`, transitionProperty: 'transform, bottom', transitionDuration: '100ms' }}
      onClick={handleClick}
      title={status === 'sleeping' ? '¡Despierta!' : 'Click para atacar'}
    >
        {/* Burbuja Zzz */}
        {status === "sleeping" && (
            <div className="absolute -top-4 right-0 md:right-2 animate-bounce text-[8px] md:text-[10px] font-mono text-white bg-black/60 px-1.5 py-0.5 rounded-full border border-white/10 z-10 whitespace-nowrap">
                Zzz...
            </div>
        )}

      {/* TAMAÑO DE LA IMAGEN */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20">
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
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 md:w-16 h-4 bg-orange-500/40 blur-lg rounded-full animate-pulse" />
      )}
    </div>
  );
}