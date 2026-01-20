import { createClient } from "@/infrastructure/supabase/server";
import { updateProject } from "@/core/actions/projects";
import Link from "next/link";
import { Save, Code2, Github, Globe, Calendar, Image as ImageIcon, Eye, Star } from "lucide-react";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) return <div className="p-8 text-center text-text-muted">Proyecto no encontrado</div>;

  const p = project as any;

  // Formatear la fecha para que el input type="date" la acepte (YYYY-MM-DD)
  const dateValue = p.project_date ? new Date(p.project_date).toISOString().split('T')[0] : '';

  return (
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-8">
        <div>
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

      <form action={updateProject.bind(null, id)} className="space-y-6 bg-surface/50 border border-text-main/10 p-8 rounded-xl backdrop-blur-md shadow-sm">
        
        {/* Título y Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase font-bold">Título del Proyecto</label>
            <input 
              name="title" 
              defaultValue={p.title} 
              required 
              className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors placeholder:text-text-muted/50" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase font-bold">Categoría</label>
            <select 
              name="category" 
              defaultValue={p.category} 
              className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none appearance-none cursor-pointer"
            >
              <option value="software" className="bg-background text-text-main">Software / Web</option>
              <option value="hardware" className="bg-background text-text-main">Hardware / IoT</option>
              <option value="script" className="bg-background text-text-main">Script / Utilidad</option>
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
            className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors resize-none placeholder:text-text-muted/50" 
          />
        </div>

        {/* Tech Stack */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-primary uppercase flex items-center gap-2 font-bold">
            <Code2 className="w-3 h-3" /> Tech Stack (Separado por comas)
          </label>
          <input 
            name="tech_stack" 
            defaultValue={p.tech_stack?.join(", ")} 
            className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors placeholder:text-text-muted/50" 
            placeholder="React, Node.js, Arduino..."
          />
        </div>

        {/* Fecha del Proyecto (NUEVO) */}
        <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase flex items-center gap-2 font-bold">
            <Calendar className="w-3 h-3" /> Fecha de Realización
            </label>
            <input 
            type="date" 
            name="project_date" 
            defaultValue={dateValue}
            required
            className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none block [color-scheme:light dark]"
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
                className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors placeholder:text-text-muted/50" 
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
                className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors placeholder:text-text-muted/50" 
            />
          </div>
        </div>

        {/* Imagen (NUEVO) */}
        <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase flex items-center gap-2 font-bold">
            <ImageIcon className="w-3 h-3" /> Actualizar Imagen (Opcional)
            </label>
            <input 
            name="image" 
            type="file" 
            accept="image/*" 
            className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" 
            />
            {p.image_url && (
                <p className="text-xs text-text-muted italic mt-1">
                    Actualmente existe una imagen guardada. Sube otra solo si quieres reemplazarla.
                </p>
            )}
        </div>

        {/* OPCIONES DE VISIBILIDAD (NUEVO) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-text-main/10">
            <label className="flex items-center gap-3 p-3 rounded border border-text-main/10 bg-background/50 cursor-pointer hover:bg-text-main/5 transition-colors">
                <input 
                    type="checkbox" 
                    name="is_published" 
                    defaultChecked={p.is_published}
                    className="w-4 h-4 rounded border-text-main/20 text-primary focus:ring-primary bg-transparent" 
                />
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-text-main flex items-center gap-2">
                        <Eye className="w-3 h-3" /> Publicar
                    </span>
                    <span className="text-xs text-text-muted">Visible en la web pública</span>
                </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded border border-text-main/10 bg-background/50 cursor-pointer hover:bg-text-main/5 transition-colors">
                <input 
                    type="checkbox" 
                    name="is_featured" 
                    defaultChecked={p.is_featured}
                    className="w-4 h-4 rounded border-text-main/20 text-secondary focus:ring-secondary bg-transparent" 
                />
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-text-main flex items-center gap-2">
                        <Star className="w-3 h-3 text-secondary" /> Destacar
                    </span>
                    <span className="text-xs text-text-muted">Aparecerá arriba en la lista</span>
                </div>
            </label>
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