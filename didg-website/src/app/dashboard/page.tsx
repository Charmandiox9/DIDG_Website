import { createClient } from "@/infrastructure/supabase/server";
import { Code2, BookOpen, Users } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient(); 
  
  // 1. Proyectos
  const { count: projectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  // 2. Ayudantías
  const { count: ayudantiasCount } = await supabase
    .from('ayudantias')
    .select('*', { count: 'exact', head: true });

  // 3. Estudiantes
  const { count: studentsCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'student');

  const stats = [
    { 
        name: "Proyectos Publicados", 
        value: projectsCount || 0, 
        icon: Code2, 
        color: "text-primary" 
    },
    { 
        name: "Ayudantías Activas", 
        value: ayudantiasCount || 0, 
        icon: BookOpen, 
        color: "text-secondary" 
    },
    { 
        name: "Estudiantes Registrados", 
        value: studentsCount || 0, 
        icon: Users, 
        // CAMBIO: emerald-500 para mejor contraste en Light Mode
        color: "text-emerald-500" 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        {/* Título adaptable */}
        <h1 className="text-3xl font-display font-bold text-text-main">Dashboard General</h1>
        <p className="text-text-muted font-mono mt-2">Bienvenido al centro de control, Arquitecto.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
            const Icon = stat.icon;
            return (
                // Card: bg-surface y border-text-main/10
                <div key={stat.name} className="p-6 rounded-xl bg-surface border border-text-main/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-mono text-text-muted uppercase font-bold">{stat.name}</p>
                            {/* Valor: text-text-main */}
                            <p className="text-3xl font-bold text-text-main mt-2">{stat.value}</p>
                        </div>
                        {/* Icon Container: bg-background/50 (contraste sutil contra bg-surface) */}
                        <div className={`p-3 rounded-lg bg-background/50 border border-text-main/5 ${stat.color}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                    </div>
                    {/* Efecto de brillo adaptable (via-text-main/5) */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-text-main/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                </div>
            )
        })}
      </div>
    </div>
  );
}