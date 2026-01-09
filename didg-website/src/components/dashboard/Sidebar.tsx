"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderKanban, 
  GraduationCap, 
  Settings, 
  LogOut,
  MessageSquare,
  Users
} from "lucide-react";
import { cn } from "@/core/utils/cn";
import { createClient } from "@/infrastructure/supabase/client";
import { useRouter } from "next/navigation";

const menuItems = [
  { name: "Resumen", href: "/dashboard", icon: LayoutDashboard },
  { name: "Mensajes", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Estudiantes", href: "/dashboard/students", icon: Users },
  { name: "Proyectos", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Ayudantías", href: "/dashboard/courses", icon: GraduationCap },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    // CAMBIO: bg-surface (se adapta al tema), border-text-main/10 (visible en ambos)
    <aside className="w-64 bg-surface border-r border-text-main/10 h-screen fixed left-0 top-0 flex flex-col hidden md:flex pt-16 transition-colors duration-300">
      
      {/* Header del Sidebar */}
      <div className="h-16 flex items-center px-6 border-b border-text-main/10">
        <span className="font-display font-bold text-xl tracking-wider text-primary">
          ADMIN PANEL
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-mono transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20 font-bold" 
                  // CAMBIO: Hover adaptable (Negro en Light, Blanco en Dark)
                  : "text-text-muted hover:text-text-main hover:bg-text-main/5"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-text-main/10">
        <button 
          onClick={handleLogout}
          // CAMBIO: hover:text-red-500 es más seguro que text-error si no está definido
          className="flex items-center gap-3 text-text-muted hover:text-red-500 w-full px-3 py-2 text-sm font-mono transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}