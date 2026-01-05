"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, GraduationCap, Settings, LogOut } from "lucide-react";
import { cn } from "@/core/utils/cn";
import { createClient } from "@/infrastructure/supabase/client";
import { useRouter } from "next/navigation";

const menuItems = [
  { name: "Resumen", href: "/dashboard", icon: LayoutDashboard },
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
    <aside className="w-64 bg-surface border-r border-white/10 h-screen fixed left-0 top-0 flex flex-col hidden md:flex">
      
      {/* Header del Sidebar */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <span className="font-display font-bold text-xl tracking-wider text-primary">
          ADMIN_PANEL
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-mono transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-text-muted hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 text-text-muted hover:text-error w-full px-3 py-2 text-sm font-mono transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}