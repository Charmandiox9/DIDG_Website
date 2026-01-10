"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  Home, 
  Code2, 
  GraduationCap, 
  Mail, 
  User,
  Github,
  Linkedin,
  Copy,
  Moon,
  Sun,
  Laptop,
  Command as CommandIcon,
  Search,
  Book
} from "lucide-react";

import { useFloatingUI } from "@/context/FloatingUIContext";
import { cn } from "@/core/utils/cn";

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { setTheme } = useTheme();

  // Escuchar Teclas (Ctrl+K)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    console.log(message); 
    setOpen(false);
  };

  const { isVisible } = useFloatingUI();

  return (
    <>
      {/* 1. BOTÓN FLOTANTE (Móvil) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          // CAMBIO: bottom-36 (aprox 144px desde abajo).
          // ANIMACIÓN: Se mueve hacia abajo al ocultarse
          className={cn(
             "md:hidden fixed bottom-36 right-4 z-[50] flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-main shadow-[0_0_15px_rgba(0,0,0,0.2)] border border-text-main/10 hover:scale-110 active:scale-95 transition-all duration-300",
             isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-32 scale-50 pointer-events-none"
          )}
        >
          <CommandIcon className="w-5 h-5" />
        </button>
      )}

      {/* 2. MODAL DEL MENÚ */}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            
            {/* CAMBIO DE TEMA: Ahora usa bg-surface y text-text-main para soportar Modo Claro */}
            <Command className="relative w-full max-w-lg overflow-hidden rounded-xl border border-text-main/10 bg-surface shadow-2xl animate-in zoom-in-95 duration-200">

                <div className="flex items-center border-b border-text-main/10 px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-text-muted" />
                    <Command.Input 
                        placeholder="¿Qué necesitas?..." 
                        // Inputs adaptables
                        className="flex h-12 w-full bg-transparent px-2 text-sm text-text-main placeholder:text-text-muted/50 outline-none font-mono"
                    />
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 custom-scrollbar">
                    <Command.Empty className="py-6 text-center text-sm text-text-muted font-mono">
                        Nada por aquí...
                    </Command.Empty>

                    <Command.Group heading={<GroupHeading text="Páginas" />}>
                        <Item onSelect={() => runCommand(() => router.push("/"))}>
                            <Home className="mr-2 h-4 w-4" /> Inicio
                        </Item>
                        <Item onSelect={() => runCommand(() => router.push("/projects"))}>
                            <Code2 className="mr-2 h-4 w-4" /> Proyectos
                        </Item>
                        <Item onSelect={() => runCommand(() => router.push("/courses"))}>
                            <GraduationCap className="mr-2 h-4 w-4" /> Ayudantías
                        </Item>
                        <Item onSelect={() => runCommand(() => router.push("/resources"))}>
                            <Book className="mr-2 h-4 w-4" /> Recursos
                        </Item>
                        <Item onSelect={() => runCommand(() => router.push("/about"))}>
                            <User className="mr-2 h-4 w-4" /> Sobre mí
                        </Item>
                    </Command.Group>

                    <Command.Group heading={<GroupHeading text="Social" />}>
                        <Item onSelect={() => runCommand(() => window.open("https://github.com/Charmandiox9", "_blank"))}>
                            <Github className="mr-2 h-4 w-4" /> GitHub
                        </Item>
                        <Item onSelect={() => runCommand(() => window.open("https://www.linkedin.com/in/daniel-durán-garcía/", "_blank"))}>
                            <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                        </Item>
                        <Item onSelect={() => runCommand(() => router.push("/contact"))}>
                            <Mail className="mr-2 h-4 w-4" /> Enviar Mensaje
                        </Item>
                    </Command.Group>

                    <Command.Group heading={<GroupHeading text="General" />}>
                          <Item onSelect={() => copyToClipboard("didurangarcia@gmail.com", "Email copiado")}>
                            <Copy className="mr-2 h-4 w-4" /> Copiar Email
                        </Item>
                          <Item onSelect={() => copyToClipboard(typeof window !== 'undefined' ? window.location.href : '', "URL copiada")}>
                            <Copy className="mr-2 h-4 w-4" /> Copiar URL Actual
                        </Item>
                        <Item onSelect={() => runCommand(() => setTheme("dark"))}>
                            <Moon className="mr-2 h-4 w-4" /> Modo Oscuro
                        </Item>
                        <Item onSelect={() => runCommand(() => setTheme("light"))}>
                            <Sun className="mr-2 h-4 w-4" /> Modo Claro
                        </Item>
                          <Item onSelect={() => runCommand(() => setTheme("system"))}>
                            <Laptop className="mr-2 h-4 w-4" /> Sistema
                        </Item>
                    </Command.Group>

                </Command.List>

                {/* Footer adaptable */}
                <div className="border-t border-text-main/10 px-4 py-2 text-[10px] text-text-muted flex justify-between bg-background/50">
                    <span className="font-mono">DIDG SYSTEM v1.0</span>
                    <div className="flex gap-2">
                        <span className="bg-text-main/10 px-1 rounded">↑↓</span>
                        <span className="bg-text-main/10 px-1 rounded">↵</span>
                    </div>
                </div>
            </Command>
        </div>
      )}
    </>
  );
}

// Helpers...
function GroupHeading({ text }: { text: string }) {
    return <span className="text-[10px] font-bold text-text-muted px-2 mb-2 block uppercase tracking-widest opacity-70">{text}</span>;
}

function Item({ children, onSelect }: { children: React.ReactNode, onSelect: () => void }) {
    return (
        <Command.Item 
            onSelect={onSelect}
            // Items adaptables: text-text-muted por defecto, text-primary al seleccionar
            className="relative flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm text-text-muted aria-selected:bg-primary/10 aria-selected:text-primary hover:text-text-main hover:bg-text-main/5 outline-none transition-all duration-200 font-mono group"
        >
            {children}
            <span className="ml-auto opacity-0 group-aria-selected:opacity-100 transition-opacity">↵</span>
        </Command.Item>
    );
}