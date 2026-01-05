"use client";

import { useState } from "react";
import { Play, Terminal, Loader2, Copy, Check } from "lucide-react";
import { cn } from "@/core/utils/cn"; // Asegúrate de tener esta utilidad o usa template strings

// Configuración de lenguajes soportados por Piston API
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

  // Función para ejecutar el código usando Piston API
  const runCode = async () => {
    setIsRunning(true);
    setOutput("");

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
      
      // Piston devuelve { run: { stdout: "...", stderr: "..." } }
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

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0d0d0d] text-gray-300 font-mono text-sm group hover:border-primary/30 transition-all duration-300">
      
      {/* --- HEADER: PESTAÑAS Y CONTROLES --- */}
      <div className="flex items-center justify-between bg-[#1e1e1e] px-4 py-2 border-b border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Terminal className="w-4 h-4 text-primary mr-2" />
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                setActiveLang(lang);
                setCode(lang.snippet);
                setOutput("");
              }}
              className={cn(
                "px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap",
                activeLang.id === lang.id
                  ? "bg-primary/20 text-primary font-bold"
                  : "hover:bg-white/5 text-text-muted"
              )}
            >
              <span>{lang.icon}</span>
              {lang.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pl-4">
           <button 
             onClick={handleCopy} 
             className="p-1.5 hover:bg-white/10 rounded transition-colors text-text-muted hover:text-white"
             title="Copiar Código"
           >
             {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
           </button>
        </div>
      </div>

      {/* --- BODY: EDITOR + OUTPUT --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[300px]">
        
        {/* EDITOR DE CÓDIGO (Izquierda) */}
        <div className="relative border-r border-white/5 bg-[#1e1e1e]/50">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-transparent p-4 outline-none resize-none text-blue-100 placeholder-white/20 font-mono leading-relaxed"
            spellCheck={false}
          />
          <div className="absolute bottom-4 right-4">
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-black font-bold px-4 py-2 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              EJECUTAR
            </button>
          </div>
        </div>

        {/* CONSOLA DE SALIDA (Derecha) */}
        <div className="bg-[#0a0a0a] p-4 flex flex-col font-mono relative">
          <span className="text-xs uppercase text-text-muted mb-2 select-none">Terminal Output</span>
          
          <div className="flex-1 font-mono text-sm whitespace-pre-wrap overflow-y-auto max-h-[250px] custom-scrollbar">
            {isRunning ? (
                <div className="text-yellow-400 animate-pulse">{"> Compilando..."}</div>
            ) : output ? (
                <div className={output.includes("Error") ? "text-red-400" : "text-emerald-400"}>
                    <span className="opacity-50 select-none">{"> "}</span>
                    {output}
                </div>
            ) : (
                <div className="text-white/20 italic">
                    {"> Esperando ejecución..."}
                </div>
            )}
          </div>
          
          {/* Decoración Cyber */}
          <div className="absolute top-2 right-2 flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/20" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
          </div>
        </div>
      </div>
    </div>
  );
}