"use client";

import { useState } from "react";
import { Play, Terminal, Loader2, Copy, Check, RotateCcw, Eraser, Keyboard } from "lucide-react";
import { cn } from "@/core/utils/cn";
import { executeCode } from "@/core/actions/compiler"; 

const LANGUAGES = [
  { 
    id: "python", 
    name: "Python", 
    icon: "🐍",
    snippet: `nombre = input()\nprint(f"¡Hola {nombre}, bienvenido a mi portafolio desde Python!")` 
  },
  { 
    id: "javascript", 
    name: "JS (Node)", 
    icon: "🟨",
    snippet: `const fs = require('fs');\nconst nombre = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nconsole.log(\`¡Hola \${nombre}, bienvenido a mi portafolio desde Node.js!\`);` 
  },
  { 
    id: "cpp", 
    name: "C++", 
    icon: "⚙️",
    snippet: `#include <iostream>\n#include <string>\n\nint main() {\n    std::string nombre;\n    std::cin >> nombre;\n    std::cout << "¡Hola " << nombre << ", bienvenido a mi portafolio desde C++!" << std::endl;\n    return 0;\n}` 
  },
  { 
    id: "java", 
    name: "Java", 
    icon: "☕",
    snippet: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        String nombre = scanner.hasNext() ? scanner.next() : "Visitante";\n        System.out.println("¡Hola " + nombre + ", bienvenido a mi portafolio desde Java!");\n    }\n}` 
  }
];

export function CodeTerminal() {
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].snippet);

  const [stdin, setStdin] = useState("Daniel"); 
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState<{time?: string, memory?: string} | null>(null);
  
  const [isRunning, setIsRunning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setOutput("");
    setStats(null);
    
    try {
      const result = await executeCode(activeLang.id, code, stdin);
      
      if (result.success) {
         setOutput(result.output as string);
         if (result.time && result.memory) {
             setStats({ time: result.time as string, memory: result.memory as string });
         }
      } else {
         setOutput(result.error as string);
      }
    } catch (error) {
      setOutput("Error de ejecución. Intenta nuevamente.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleReset = () => {
    if (confirm("¿Restaurar el código por defecto? Se perderán tus cambios.")) {
        setCode(activeLang.snippet);
        setOutput("");
        setStats(null);
    }
  };

  const handleClear = () => {
    setOutput("");
    setStats(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-xl overflow-hidden border border-text-main/10 shadow-2xl bg-surface text-text-main font-mono text-sm group hover:border-primary/30 transition-all duration-300 flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-background/50 px-4 py-2 border-b border-text-main/10 gap-4">
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
                setStats(null);
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

        <div className="flex items-center gap-1 pl-4 border-l border-text-main/10 ml-auto">
           <button onClick={handleReset} className="p-2 hover:bg-text-main/5 rounded transition-colors text-text-muted hover:text-text-main" title="Restaurar código">
             <RotateCcw className="w-4 h-4" />
           </button>
           <button onClick={handleCopy} className="p-2 hover:bg-text-main/5 rounded transition-colors text-text-muted hover:text-text-main" title="Copiar código">
             {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
           </button>
        </div>
      </div>

      {/* --- BODY --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        
        {/* EDITOR (Izquierda) */}
        <div className="relative border-b lg:border-b-0 lg:border-r border-text-main/10 bg-surface flex flex-col">
          <div className="absolute top-0 left-0 w-4 h-full bg-text-main/5 border-r border-text-main/5 z-0 pointer-events-none" />
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-transparent p-4 pl-8 outline-none resize-none text-text-main placeholder:text-text-muted font-mono leading-relaxed z-10"
            spellCheck={false}
            placeholder="// Escribe tu código aquí..."
          />
          
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

        {/* PANELES DERECHOS (Stdin y Consola) */}
        <div className="bg-[#121212] p-4 flex flex-col gap-4 font-mono relative border-t lg:border-t-0 border-white/10">
          
          {/* PANEL DE ENTRADA (STDIN) */}
          <div className="flex flex-col h-1/3 min-h-[120px] rounded-lg border border-white/10 bg-black/50 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border-b border-white/10 text-xs font-bold text-gray-500 uppercase tracking-wider select-none">
              <Keyboard className="w-3 h-3" /> Input (STDIN)
            </div>
            <textarea
               value={stdin}
               onChange={(e) => setStdin(e.target.value)}
               placeholder="Datos de entrada separados por enter..."
               className="flex-1 w-full bg-transparent p-3 text-gray-300 font-mono text-sm outline-none resize-none placeholder:text-gray-700 custom-scrollbar"
               spellCheck={false}
            />
          </div>

          {/* PANEL DE SALIDA (STDOUT) */}
          <div className="flex flex-col flex-1 rounded-lg border border-white/10 bg-black/50 overflow-hidden">
            <div className="flex justify-between items-center px-3 py-2 bg-white/5 border-b border-white/10">
               <span className="text-xs uppercase text-gray-500 font-bold select-none tracking-wider">Terminal Output</span>
               <button onClick={handleClear} className="text-gray-600 hover:text-gray-400 transition-colors" title="Limpiar consola">
                  <Eraser className="w-3 h-3" />
               </button>
            </div>
            
            <div className="flex-1 p-3 font-mono text-sm whitespace-pre-wrap overflow-y-auto custom-scrollbar flex flex-col">
              {isRunning ? (
                  <div className="flex items-center gap-2 text-yellow-500 animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Compilando y ejecutando...
                  </div>
              ) : output ? (
                  <div className="flex flex-col h-full">
                      <div className={cn(
                          "flex-1 leading-relaxed", 
                          output.includes("Error") || output.includes("Exception") ? "text-red-400" : "text-emerald-400"
                      )}>
                          <span className="opacity-50 select-none mr-2">$</span>
                          {output}
                      </div>
                      
                      {/* ESTADÍSTICAS DEL CÓDIGO */}
                      {stats && (
                          <div className="mt-4 pt-2 border-t border-white/10 flex gap-4 text-xs font-mono text-gray-500">
                              <span>⏱️ {stats.time}s</span>
                              <span>💾 {stats.memory} KB</span>
                          </div>
                      )}
                  </div>
              ) : (
                  <div className="text-gray-700 italic text-xs mt-4 text-center">
                      {"> Presiona RUN para ver el resultado aquí..."}
                  </div>
              )}
            </div>
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