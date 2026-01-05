"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  Calculator, 
  Calendar, 
  CreditCard, 
  Settings, 
  Smile, 
  User, 
  Code2, 
  Home, 
  Mail,
  Moon,
  Sun,
  Laptop
} from "lucide-react";

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { setTheme } = useTheme();

  // Escuchar Ctrl+K o Cmd+K
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
        
        {/* Modal CMDK */}
        <Command className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/20 bg-[#0a0a0a] shadow-2xl animate-in zoom-in-95">
            
            <div className="flex items-center border-b border-white/10 px-3">
                <Command.Input 
                    placeholder="Escribe un comando o busca..." 
                    className="flex h-12 w-full bg-transparent px-2 text-sm text-white placeholder:text-text-muted outline-none disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                />
            </div>

            <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                <Command.Empty className="py-6 text-center text-sm text-text-muted font-mono">
                    No se encontraron resultados.
                </Command.Empty>

                <Command.Group heading={<span className="text-xs font-bold text-text-muted px-2 mb-2 block uppercase tracking-wider">Navegación</span>}>
                    <Item onSelect={() => runCommand(() => router.push("/"))}>
                        <Home className="mr-2 h-4 w-4" /> Inicio
                    </Item>
                    <Item onSelect={() => runCommand(() => router.push("/projects"))}>
                        <Code2 className="mr-2 h-4 w-4" /> Proyectos
                    </Item>
                    <Item onSelect={() => runCommand(() => router.push("/contact"))}>
                        <Mail className="mr-2 h-4 w-4" /> Contacto
                    </Item>
                </Command.Group>

                <Command.Group heading={<span className="text-xs font-bold text-text-muted px-2 mb-2 mt-4 block uppercase tracking-wider">Tema</span>}>
                    <Item onSelect={() => runCommand(() => setTheme("dark"))}>
                        <Moon className="mr-2 h-4 w-4" /> Modo Oscuro
                    </Item>
                    <Item onSelect={() => runCommand(() => setTheme("light"))}>
                        <Sun className="mr-2 h-4 w-4" /> Modo Claro
                    </Item>
                </Command.Group>

                <Command.Group heading={<span className="text-xs font-bold text-text-muted px-2 mb-2 mt-4 block uppercase tracking-wider">General</span>}>
                    <Item onSelect={() => runCommand(() => router.push("/login"))}>
                        <User className="mr-2 h-4 w-4" /> Admin Login
                    </Item>
                </Command.Group>
            </Command.List>

            <div className="border-t border-white/10 px-4 py-2 text-[10px] text-text-muted flex justify-between">
                <span>Navegar con ↑ ↓</span>
                <span>Enter para seleccionar</span>
            </div>
        </Command>
    </div>
  );
}

// Componente Helper para los items (para limpiar el código arriba)
function Item({ children, onSelect }: { children: React.ReactNode, onSelect: () => void }) {
    return (
        <Command.Item 
            onSelect={onSelect}
            className="relative flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm text-text-main outline-none data-[selected=true]:bg-primary/20 data-[selected=true]:text-primary transition-colors font-mono"
        >
            {children}
        </Command.Item>
    );
}