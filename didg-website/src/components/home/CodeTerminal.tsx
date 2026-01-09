"use client";

import { useState } from "react";
import { Play, Terminal, Loader2, Copy, Check, RotateCcw, Eraser } from "lucide-react";
import { cn } from "@/core/utils/cn";

// Configuración de lenguajes (Igual que antes)
const LANGUAGES = [
  { 
    id: "python", 
    name: "Python", 
    version: "3.10.0", 
    icon: "🐍",
    snippet: `def greet(name):\n    print(f"Hola, {name} desde Python!")\n\ngreet("Visitante")` 
  },
  { 
    id: "javascript", 
    name: "JS (Node)", 
    version: "18.15.0", 
    icon: "🟨",
    snippet: `const greet = (name) => {\n  console.log(\`Hola, \${name} desde Node.js!\`);\n};\n\ngreet("Visitante");` 
  },
  { 
    id: "typescript", 
    name: "TypeScript", 
    version: "5.0.3", 
    icon: "🟦",
    snippet: `const greet = (name: string): void => {\n  console.log(\`Hola, \${name} desde TypeScript!\`);\n};\n\ngreet("Visitante");` 
  },
  { 
    id: "java", 
    name: "Java", 
    version: "15.0.2", 
    icon: "☕",
    snippet: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hola Visitante desde Java!");\n    }\n}` 
  },
  { 
    id: "cpp", 
    name: "C++", 
    version: "10.2.0", 
    icon: "⚙️",
    snippet: `#include <iostream>\n\nint main() {\n    std::cout << "Hola Visitante desde C++!" << std::endl;\n    return 0;\n}` 
  },
];

export function CodeTerminal() {
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].snippet);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Función para ejecutar código
  const runCode = async () => {
    setIsRunning(true);
    // No borramos el output anterior inmediatamente para dar sensación de continuidad, 
    // o puedes usar setOutput("") si prefieres limpiar antes.
    
    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: activeLang.id,
          version: activeLang.version,
          files: [{ content: code }],
        }),
      });

      const data = await response.json();
      
      if (data.run) {
        setOutput(data.run.stdout || data.run.stderr || "Sin salida (Exit Code 0)");
      } else {
        setOutput("Error: No se pudo conectar al compilador.");
      }
    } catch (error) {
      setOutput("Error de red. Intenta nuevamente.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // NUEVO: Resetear al snippet original
  const handleReset = () => {
    if (confirm("¿Restaurar el código por defecto? Se perderán tus cambios.")) {
        setCode(activeLang.snippet);
        setOutput("");
    }
  };

  // NUEVO: Limpiar consola
  const handleClear = () => {
    setOutput("");
  };

  return (
    // CAMBIO: bg-surface y border-text-main/10 para adaptarse al tema
    <div className="w-full max-w-5xl mx-auto rounded-xl overflow-hidden border border-text-main/10 shadow-2xl bg-surface text-text-main font-mono text-sm group hover:border-primary/30 transition-all duration-300 flex flex-col">
      
      {/* --- HEADER --- */}
      {/* CAMBIO: bg-background/50 para contraste sutil */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-background/50 px-4 py-2 border-b border-text-main/10 gap-4">
        
        {/* Lenguajes */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-2 sm:pb-0">
          <div className="p-1.5 bg-primary/10 rounded text-primary mr-2">
             <Terminal className="w-4 h-4" />
          </div>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                setActiveLang(lang);
                setCode(lang.snippet);
                setOutput("");
              }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 whitespace-nowrap border",
                activeLang.id === lang.id
                  ? "bg-surface border-primary/30 text-primary font-bold shadow-sm"
                  : "border-transparent hover:bg-text-main/5 text-text-muted"
              )}
            >
              <span>{lang.icon}</span>
              {lang.name}
            </button>
          ))}
        </div>

        {/* Herramientas (Copiar, Reset) */}
        <div className="flex items-center gap-1 pl-4 border-l border-text-main/10 ml-auto">
           <button 
             onClick={handleReset} 
             className="p-2 hover:bg-text-main/5 rounded transition-colors text-text-muted hover:text-text-main"
             title="Restaurar código"
           >
             <RotateCcw className="w-4 h-4" />
           </button>
           <button 
             onClick={handleCopy} 
             className="p-2 hover:bg-text-main/5 rounded transition-colors text-text-muted hover:text-text-main"
             title="Copiar código"
           >
             {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
           </button>
        </div>
      </div>

      {/* --- BODY --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
        
        {/* EDITOR (Izquierda) */}
        {/* CAMBIO: bg-surface para que se vea limpio en Light Mode */}
        <div className="relative border-b lg:border-b-0 lg:border-r border-text-main/10 bg-surface flex flex-col">
          <div className="absolute top-0 left-0 w-4 h-full bg-text-main/5 border-r border-text-main/5 z-0 pointer-events-none" /> {/* Decoración gutter */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-transparent p-4 pl-8 outline-none resize-none text-text-main placeholder:text-text-muted font-mono leading-relaxed z-10"
            spellCheck={false}
            placeholder="// Escribe tu código aquí..."
          />
          
          {/* Botón Ejecutar Flotante */}
          <div className="absolute bottom-4 right-4 z-20">
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-background font-bold px-6 py-2.5 rounded-full shadow-[0_0_20px_var(--primary-glow)] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              RUN
            </button>
          </div>
        </div>

        {/* CONSOLA (Derecha) */}
        {/* DECISIÓN DE DISEÑO: La consola siempre se ve mejor oscura (tipo Hacker) incluso en Light Mode. 
            Usamos bg-[#0F0F0F] fijo para mantener esa estética, pero con bordes adaptables. */}
        <div className="bg-[#121212] p-4 flex flex-col font-mono relative min-h-[200px] border-t lg:border-t-0 border-white/10">
          
          <div className="flex justify-between items-center mb-2">
             <span className="text-xs uppercase text-gray-500 font-bold select-none tracking-wider">Terminal Output</span>
             <button onClick={handleClear} className="text-gray-600 hover:text-gray-400 transition-colors" title="Limpiar consola">
                <Eraser className="w-3 h-3" />
             </button>
          </div>
          
          <div className="flex-1 font-mono text-sm whitespace-pre-wrap overflow-y-auto max-h-[350px] custom-scrollbar">
            {isRunning ? (
                <div className="flex items-center gap-2 text-yellow-500 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Compilando...
                </div>
            ) : output ? (
                <div className={cn(
                    "leading-relaxed", 
                    output.includes("Error") ? "text-red-400" : "text-emerald-400"
                )}>
                    <span className="opacity-50 select-none mr-2">$</span>
                    {output}
                </div>
            ) : (
                <div className="text-gray-700 italic text-xs mt-10 text-center">
                    {"> Presiona RUN para ver el resultado aquí..."}
                </div>
            )}
          </div>
          
          {/* Decoración UI */}
          <div className="absolute top-4 right-4 flex gap-1.5 opacity-30">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}