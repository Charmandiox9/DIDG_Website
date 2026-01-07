import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/core/utils/cn"; // O tu utilidad de clases

interface BreadcrumbItem {
  label: string;
  href?: string; // Si no tiene href, es el item actual (no clickeable)
}

interface Props {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: Props) {
  return (
    <nav className={cn("flex items-center text-sm text-text-muted mb-6", className)}>
      
      {/* 1. Icono Home siempre al inicio */}
      <Link href="/" className="hover:text-primary transition-colors flex items-center">
        <Home className="w-4 h-4" />
      </Link>

      {/* 2. Iteramos los items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.label} className="flex items-center">
            
            {/* Separador */}
            <ChevronRight className="w-4 h-4 mx-2 opacity-50" />

            {/* Link o Texto Plano */}
            {!isLast && item.href ? (
              <Link 
                href={item.href} 
                className="hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-white font-medium truncate max-w-[200px] md:max-w-none">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}