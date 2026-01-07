"use client";

import { createProject } from "@/core/actions/projects"; 
import { Save, Image as ImageIcon, Github, Globe, Code2, Calendar, Eye, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NewProjectPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
        await createProject(formData);
    } catch (error) {
        console.error(error);
        alert("Error al crear proyecto (Revisa la consola)");
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Nuevo Proyecto</h1>
          <p className="text-text-muted font-mono text-sm">Añade una nueva pieza a tu colección.</p>
        </div>
        <Link 
          href="/dashboard/projects"
          className="px-4 py-2 rounded border border-white/10 text-text-muted hover:text-white text-sm font-mono transition-colors"
        >
          Cancelar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-surface/50 border border-white/10 p-8 rounded-xl backdrop-blur-md">
        
        {/* Título y Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase">Título del Proyecto</label>
            <input name="title" required placeholder="Ej: Sistema de Riego IoT" className="w-full bg-background/50 border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none transition-colors" />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase">Categoría</label>
            <select name="category" className="w-full bg-background/50 border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none transition-colors appearance-none cursor-pointer">
              <option value="software">Software / Web</option>
              <option value="hardware">Hardware / IoT</option>
              <option value="script">Script / Utilidad</option>
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-primary uppercase">Descripción</label>
          <textarea name="description" required rows={4} placeholder="Describe el impacto y la tecnología..." className="w-full bg-background/50 border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none transition-colors" />
        </div>

        {/* Tech Stack */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-primary uppercase flex items-center gap-2">
            <Code2 className="w-3 h-3" /> Tech Stack (Separado por comas)
          </label>
          <input name="tech_stack" required placeholder="React, Node.js, ESP32, MQTT" className="w-full bg-background/50 border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none transition-colors" />
        </div>

        {/* Fecha del Proyecto */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-primary uppercase flex items-center gap-2">
            <Calendar className="w-3 h-3" /> Fecha de Realización
          </label>
          <input 
            type="date" 
            name="project_date" 
            required
            className="w-full bg-background/50 border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none block [color-scheme:dark]"
          />
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase flex items-center gap-2">
              <Github className="w-3 h-3" /> Repo URL (Opcional)
            </label>
            <input name="repo_url" type="url" placeholder="https://github.com/..." className="w-full bg-background/50 border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none transition-colors" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase flex items-center gap-2">
              <Globe className="w-3 h-3" /> Demo URL (Opcional)
            </label>
            <input name="demo_url" type="url" placeholder="https://..." className="w-full bg-background/50 border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none transition-colors" />
          </div>
        </div>

        {/* Imagen */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-primary uppercase flex items-center gap-2">
            <ImageIcon className="w-3 h-3" /> Imagen de Portada
          </label>
          <input name="image" type="file" accept="image/*" className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
        </div>

        {/* OPCIONES DE VISIBILIDAD (NUEVO) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
            {/* Checkbox Publicado */}
            <label className="flex items-center gap-3 p-3 rounded border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <input type="checkbox" name="is_published" defaultChecked className="w-4 h-4 rounded border-white/20 text-primary focus:ring-primary bg-transparent" />
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                        <Eye className="w-3 h-3" /> Publicar
                    </span>
                    <span className="text-xs text-text-muted">Visible en la web pública</span>
                </div>
            </label>

            {/* Checkbox Destacado */}
            <label className="flex items-center gap-3 p-3 rounded border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <input type="checkbox" name="is_featured" className="w-4 h-4 rounded border-white/20 text-secondary focus:ring-secondary bg-transparent" />
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
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
            disabled={isLoading}
            className="w-full bg-primary text-background font-bold py-4 rounded hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="animate-pulse">PROCESANDO DATOS...</span>
            ) : (
              <>
                <Save className="w-5 h-5" />
                PUBLICAR PROYECTO
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}