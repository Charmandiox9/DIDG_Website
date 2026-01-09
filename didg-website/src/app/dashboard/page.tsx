import { createClient } from "@/infrastructure/supabase/server";
// 1. IMPORTAR LA NUEVA ACCIÓN Y EL COMPONENTE
import { getDownloadsBySubject, getRecentDownloads } from "@/core/actions/analytics";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { RecentDownloads } from "@/components/dashboard/RecentDownloads"; // <--- NUEVO
import { Code2, BookOpen, Users, BarChart3 } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient(); 
  
  // --- CARGA DE DATOS EXISTENTE ---
  const { count: projectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  const { count: ayudantiasCount } = await supabase
    .from('ayudantias')
    .select('*', { count: 'exact', head: true });

  const { count: studentsCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'student');

  // --- CARGA DE DATOS DE ANALYTICS ---
  // Usamos Promise.all para que carguen en paralelo (más rápido)
  const [downloadsData, recentDownloads] = await Promise.all([
    getDownloadsBySubject(),
    getRecentDownloads() // <--- Cargamos las últimas 3
  ]);

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
        color: "text-emerald-500" 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-text-main">Dashboard General</h1>
        <p className="text-text-muted font-mono mt-2">Bienvenido al centro de control, Arquitecto.</p>
      </div>

      {/* SECCIÓN 1: TARJETAS KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
            const Icon = stat.icon;
            return (
                <div key={stat.name} className="p-6 rounded-xl bg-surface border border-text-main/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-mono text-text-muted uppercase font-bold">{stat.name}</p>
                            <p className="text-3xl font-bold text-text-main mt-2">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg bg-background/50 border border-text-main/5 ${stat.color}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-text-main/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                </div>
            )
        })}
      </div>

      {/* SECCIÓN 2: GRÁFICOS Y ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA (2/3): Gráfico Principal */}
        <div className="col-span-1 lg:col-span-2 bg-surface border border-text-main/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 border border-emerald-500/20">
                    <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-text-main">Actividad de Descargas</h3>
                    <p className="text-xs text-text-muted font-mono">Recursos más solicitados por asignatura</p>
                </div>
            </div>
            <AnalyticsChart data={downloadsData} />
        </div>

        {/* COLUMNA DERECHA (1/3): Últimas Descargas (Feed) */}
        <div className="col-span-1 lg:col-span-1">
             {/* <--- AQUÍ PONEMOS EL NUEVO COMPONENTE */}
             <RecentDownloads data={recentDownloads} />
        </div>
      </div>
    </div>
  );
}