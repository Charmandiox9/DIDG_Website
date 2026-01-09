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
  Command as CommandIcon, // <--- Importamos el icono con alias
  Search
} from "lucide-react";

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

  // --- MODIFICACIÓN: Ya no hacemos return null aquí ---
  // if (!open) return null; 

  return (
    <>
      {/* 1. BOTÓN FLOTANTE (Solo visible en Móvil cuando el menú está cerrado) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="md:hidden fixed bottom-6 right-6 z-[50] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-background shadow-[0_0_20px_rgba(0,240,255,0.4)] border border-white/20 hover:scale-110 active:scale-95 transition-all duration-300 animate-in fade-in zoom-in"
          aria-label="Abrir menú de comandos"
        >
          <CommandIcon className="w-6 h-6" />
        </button>
      )}

      {/* 2. MODAL DEL MENÚ (Solo visible si open es true) */}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            
            <Command className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">

                <div className="flex items-center border-b border-white/10 px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-white" />
                    <Command.Input 
                        placeholder="¿Qué necesitas?..." 
                        className="flex h-12 w-full bg-transparent px-2 text-sm text-white placeholder:text-text-muted/50 outline-none font-mono"
                    />
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
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
                          <Item onSelect={() => copyToClipboard(window.location.href, "URL copiada")}>
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

                <div className="border-t border-white/10 px-4 py-2 text-[10px] text-text-muted flex justify-between bg-black/40">
                    <span className="font-mono">DIDG SYSTEM v1.0</span>
                    <div className="flex gap-2">
                        <span className="bg-white/10 px-1 rounded">↑↓</span>
                        <span className="bg-white/10 px-1 rounded">↵</span>
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
    return <span className="text-[10px] font-bold text-primary/50 px-2 mb-2 block uppercase tracking-widest">{text}</span>;
}

function Item({ children, onSelect }: { children: React.ReactNode, onSelect: () => void }) {
    return (
        <Command.Item 
            onSelect={onSelect}
            className="relative flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm text-text-muted hover:text-white outline-none data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-all duration-200 font-mono group"
        >
            {children}
            <span className="ml-auto opacity-0 group-data-[selected=true]:opacity-100 transition-opacity">↵</span>
        </Command.Item>
    );
}