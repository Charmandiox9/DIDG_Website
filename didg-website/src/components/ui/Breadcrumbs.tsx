import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/core/utils/cn";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: Props) {
  return (
    // Contenedor base: text-text-muted asegura que los elementos inactivos sean grises en ambos temas
    <nav className={cn("flex items-center text-sm text-text-muted mb-6", className)}>
      
      {/* 1. Icono Home */}
      <Link 
        href="/" 
        className="hover:text-primary transition-colors flex items-center"
        title="Ir al Inicio"
      >
        <Home className="w-4 h-4" />
      </Link>

      {/* 2. Iteramos los items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.label} className="flex items-center animate-in fade-in slide-in-from-left-2 duration-300">
            
            {/* Separador */}
            <ChevronRight className="w-4 h-4 mx-2 opacity-50" />

            {/* Link o Texto Plano */}
            {!isLast && item.href ? (
              <Link 
                href={item.href} 
                // CAMBIO: hover:text-white -> hover:text-text-main
                // Esto hace que al pasar el mouse se ponga Negro (Light) o Blanco (Dark)
                className="hover:text-text-main transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              // CAMBIO: text-white -> text-text-main (Elemento activo)
              // Añadí font-semibold para que destaque un poco más que los anteriores
              <span className="text-text-main font-semibold truncate max-w-[200px] md:max-w-none shadow-sm">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}