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

  if (!project) return <div className="p-8 text-center text-text-muted">Proyecto no encontrado</div>;

  const p = project as any;

  return (
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-8">
        <div>
          {/* Título adaptable */}
          <h1 className="text-3xl font-display font-bold text-text-main">Editar Proyecto</h1>
          <p className="text-text-muted font-mono text-sm">Modificando: <span className="text-primary font-bold">{p.title}</span></p>
        </div>
        <Link 
            href="/dashboard/projects" 
            className="px-4 py-2 rounded border border-text-main/10 text-text-muted hover:text-text-main hover:bg-text-main/5 text-sm font-mono transition-colors"
        >
          Cancelar
        </Link>
      </div>

      {/* Formulario: bg-surface/50 y border-text-main/10 */}
      <form action={updateProject.bind(null, id)} className="space-y-6 bg-surface/50 border border-text-main/10 p-8 rounded-xl backdrop-blur-md shadow-sm">
        
        {/* Título y Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase font-bold">Título</label>
            <input 
              name="title" 
              defaultValue={p.title} 
              required 
              // Input Adaptable: bg-background/50 y text-text-main
              className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase font-bold">Categoría</label>
            <select 
              name="category" 
              defaultValue={p.category} 
              // Select Adaptable
              className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none appearance-none cursor-pointer"
            >
              <option value="software" className="bg-background text-text-main">Software</option>
              <option value="hardware" className="bg-background text-text-main">Hardware</option>
              <option value="script" className="bg-background text-text-main">Script</option>
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-primary uppercase font-bold">Descripción</label>
          <textarea 
            name="description" 
            defaultValue={p.description} 
            required 
            rows={4} 
            className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors resize-none" 
          />
        </div>

        {/* Tech Stack */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-primary uppercase flex items-center gap-2 font-bold">
            <Code2 className="w-3 h-3" /> Tech Stack
          </label>
          <input 
            name="tech_stack" 
            defaultValue={p.tech_stack?.join(", ")} 
            className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors" 
            placeholder="React, Node.js, Arduino (separados por coma)"
          />
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase flex items-center gap-2 font-bold">
              <Github className="w-3 h-3" /> Repo URL
            </label>
            <input 
                name="repo_url" 
                defaultValue={p.repo_url || ""} 
                type="url" 
                className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase flex items-center gap-2 font-bold">
              <Globe className="w-3 h-3" /> Demo URL
            </label>
            <input 
                name="demo_url" 
                defaultValue={p.demo_url || ""} 
                type="url" 
                className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors" 
            />
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-primary text-background font-bold py-4 rounded hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-[0_0_15px_var(--primary-glow)]"
          >
            <Save className="w-5 h-5" />
            GUARDAR CAMBIOS
          </button>
        </div>

      </form>
    </div>
  );
}