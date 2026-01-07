import { createClient } from "@/infrastructure/supabase/server";
import { Card } from "@/components/ui/card"; 
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

  // 3. NUEVO: Estudiantes (Filtrando por rol)
  const { count: studentsCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'student'); // <--- El filtro mágico

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
        value: studentsCount || 0, // <--- Usamos el valor real aquí
        icon: Users, 
        color: "text-emerald-400" 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Dashboard General</h1>
        <p className="text-text-muted font-mono mt-2">Bienvenido al centro de control, Arquitecto.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
            const Icon = stat.icon;
            return (
                <div key={stat.name} className="p-6 rounded-xl bg-surface border border-white/5 shadow-lg relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-mono text-text-muted uppercase">{stat.name}</p>
                            <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg bg-white/5 ${stat.color}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                    </div>
                    {/* Efecto de brillo al pasar el mouse */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
            )
        })}
      </div>
    </div>
  );
}