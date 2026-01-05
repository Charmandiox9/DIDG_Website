import { createClient } from "@/infrastructure/supabase/server";
import { updateProject } from "@/core/actions/projects";
import Link from "next/link";
import { Save, Code2, Github, Globe } from "lucide-react";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  // 1. Cargar datos actuales del proyecto
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) return <div>Proyecto no encontrado</div>;

  const p = project as any;

  return (
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Editar Proyecto</h1>
          <p className="text-text-muted font-mono text-sm">Modificando: <span className="text-primary">{p.title}</span></p>
        </div>
        <Link href="/dashboard/projects" className="px-4 py-2 rounded border border-white/10 text-text-muted hover:text-white text-sm font-mono transition-colors">
          Cancelar
        </Link>
      </div>

      <form action={updateProject.bind(null, id)} className="space-y-6 bg-surface/50 border border-white/10 p-8 rounded-xl backdrop-blur-md">
        
        {/* Título y Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase">Título</label>
            <input 
              name="title" 
              defaultValue={p.title} 
              required 
              className="w-full bg-background/50 border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase">Categoría</label>
            <select 
              name="category" 
              defaultValue={p.category} 
              className="w-full bg-background/50 border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none appearance-none"
            >
              <option value="software">Software</option>
              <option value="hardware">Hardware</option>
              <option value="script">Script</option>
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-primary uppercase">Descripción</label>
          <textarea 
            name="description" 
            defaultValue={p.description} 
            required 
            rows={4} 
            className="w-full bg-background/50 border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none" 
          />
        </div>

        {/* Tech Stack */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-primary uppercase flex items-center gap-2">
            <Code2 className="w-3 h-3" /> Tech Stack
          </label>
          <input 
            name="tech_stack" 
            defaultValue={p.tech_stack?.join(", ")} 
            className="w-full bg-background/50 border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none" 
          />
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase flex items-center gap-2">
              <Github className="w-3 h-3" /> Repo URL
            </label>
            <input name="repo_url" defaultValue={p.repo_url || ""} type="url" className="w-full bg-background/50 border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase flex items-center gap-2">
              <Globe className="w-3 h-3" /> Demo URL
            </label>
            <input name="demo_url" defaultValue={p.demo_url || ""} type="url" className="w-full bg-background/50 border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none" />
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-primary text-background font-bold py-4 rounded hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            GUARDAR CAMBIOS
          </button>
        </div>

      </form>
    </div>
  );
}