import { createClient } from "@/infrastructure/supabase/server";
import { deleteProject } from "@/core/actions/projects";
import Link from "next/link";
import Image from "next/image";
// Agregamos Calendar a los iconos
import { Plus, Pencil, Trash2, Monitor, Terminal, Cpu, Calendar } from "lucide-react";

const CategoryIcon = {
  software: Monitor,
  script: Terminal,
  hardware: Cpu,
};

export default async function ProjectsListPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("project_date", { ascending: false }); // <-- OJO: Ahora ordenamos por la fecha real del proyecto

  const projectsList = (projects || []) as any[];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Mis Proyectos</h1>
          <p className="text-text-muted font-mono text-sm">Gestiona tu portafolio digital.</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center gap-2 bg-primary text-background px-4 py-2 rounded font-bold hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nuevo Proyecto
        </Link>
      </div>

      {/* Tabla */}
      <div className="rounded-xl border border-white/10 bg-surface/50 backdrop-blur-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-xs uppercase font-mono text-text-muted">
              <th className="p-4">Proyecto</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Fecha Real</th> {/* <--- NUEVA COLUMNA */}
              <th className="p-4">Stack</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {projects?.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-muted font-mono">
                  No hay proyectos aún.
                </td>
              </tr>
            ) : (
              projectsList?.map((project) => {
                const Icon = CategoryIcon[project.category as keyof typeof CategoryIcon] || Monitor;
                
                // Usamos project_date si existe, si no, usamos created_at como respaldo
                const displayDate = project.project_date || project.created_at;

                return (
                  <tr key={project.id} className="group hover:bg-white/5 transition-colors">
                    
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-background border border-white/10 overflow-hidden relative flex-shrink-0">
                          {project.image_urls?.[0] ? (
                            <Image src={project.image_urls[0]} alt={project.title} fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-text-muted"><Icon className="w-6 h-6 opacity-50" /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-primary transition-colors">{project.title}</p>
                          <p className="text-xs text-text-muted line-clamp-1 max-w-[200px]">{project.description}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        project.category === 'hardware' ? 'border-amber-500/20 bg-amber-500/10 text-amber-400' :
                        project.category === 'script' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' :
                        'border-blue-500/20 bg-blue-500/10 text-blue-400'
                      }`}>
                        <Icon className="w-3 h-3" />
                        {project.category.toUpperCase()}
                      </span>
                    </td>

                    {/* --- NUEVA CELDA: FECHA --- */}
                    <td className="p-4">
                        <div className="flex items-center gap-2 text-text-muted">
                            <Calendar className="w-4 h-4 text-secondary" />
                            <span className="font-mono text-xs">
                                {new Date(displayDate).toLocaleDateString('es-CL', {
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {project.tech_stack?.slice(0, 3).map((tech: string) => (
                           <span key={tech} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-mono text-text-muted border border-white/5">{tech}</span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/dashboard/projects/${project.id}/edit`} 
                          className="p-2 hover:text-primary text-text-muted transition-colors" 
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>

                        <form action={deleteProject.bind(null, project.id)}>
                          <button type="submit" className="p-2 hover:text-error text-text-muted transition-colors" title="Eliminar">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}