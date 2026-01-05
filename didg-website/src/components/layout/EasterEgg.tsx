"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function EasterEgg() {
  
  useEffect(() => {
    // 1. MENSAJE EN CONSOLA
    console.log(
      "%c 👨‍💻 DIDG_DEV Terminal Active ",
      "background: #000; color: #00f0ff; font-size: 16px; padding: 10px; border: 2px solid #00f0ff; border-radius: 4px;"
    );
    console.log(
      "%c ¿Curioso sobre el stack? \n • Next.js 14 \n • Supabase \n • Tailwind \n\n Si quieres colaborar, escríbeme.",
      "color: #94a3b8; font-family: monospace; font-size: 12px;"
    );

    // 2. KONAMI CODE LISTENER
    const konamiCode = [
      "ArrowUp", "ArrowUp", 
      "ArrowDown", "ArrowDown", 
      "ArrowLeft", "ArrowRight", 
      "ArrowLeft", "ArrowRight", 
      "b", "a"
    ];
    
    let cursor = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Reiniciar si la tecla no coincide
      if (e.key !== konamiCode[cursor]) {
        cursor = 0;
        return;
      }

      // Avanzar cursor
      cursor++;

      // Si completó el código
      if (cursor === konamiCode.length) {
        triggerConfetti();
        cursor = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#00f0ff', '#7000ff'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#00f0ff', '#7000ff'] });
    }, 250);
  };

  return null; // Este componente no renderiza nada visual por defecto
}