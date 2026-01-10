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
      
      {/* Cabecera Adaptable */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-main">Nuevo Proyecto</h1>
          <p className="text-text-muted font-mono text-sm">Añade una nueva pieza a tu colección.</p>
        </div>
        <Link 
          href="/dashboard/projects"
          className="px-4 py-2 rounded border border-text-main/10 text-text-muted hover:text-text-main hover:bg-text-main/5 text-sm font-mono transition-colors"
        >
          Cancelar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-surface/50 border border-text-main/10 p-8 rounded-xl backdrop-blur-md shadow-sm">
        
        {/* Título y Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase font-bold">Título del Proyecto</label>
            <input 
                name="title" 
                required 
                placeholder="Ej: Sistema de Riego IoT" 
                className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors placeholder:text-text-muted/50" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase font-bold">Categoría</label>
            <select 
                name="category" 
                className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors appearance-none cursor-pointer"
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
            required 
            rows={4} 
            placeholder="Describe el impacto y la tecnología..." 
            className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors placeholder:text-text-muted/50 resize-none" 
          />
        </div>

        {/* Tech Stack */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-primary uppercase flex items-center gap-2 font-bold">
            <Code2 className="w-3 h-3" /> Tech Stack (Separado por comas)
          </label>
          <input 
            name="tech_stack" 
            required 
            placeholder="React, Node.js, ESP32, MQTT" 
            className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors placeholder:text-text-muted/50" 
          />
        </div>

        {/* Fecha del Proyecto */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-primary uppercase flex items-center gap-2 font-bold">
            <Calendar className="w-3 h-3" /> Fecha de Realización
          </label>
          <input 
            type="date" 
            name="project_date" 
            required
            className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none block [color-scheme:light dark]"
          />
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase flex items-center gap-2 font-bold">
              <Github className="w-3 h-3" /> Repo URL (Opcional)
            </label>
            <input 
                name="repo_url" 
                type="url" 
                placeholder="https://github.com/..." 
                className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors placeholder:text-text-muted/50" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase flex items-center gap-2 font-bold">
              <Globe className="w-3 h-3" /> Demo URL (Opcional)
            </label>
            <input 
                name="demo_url" 
                type="url" 
                placeholder="https://..." 
                className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors placeholder:text-text-muted/50" 
            />
          </div>
        </div>

        {/* Imagen */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-primary uppercase flex items-center gap-2 font-bold">
            <ImageIcon className="w-3 h-3" /> Imagen de Portada
          </label>
          {/* Input File Adaptable */}
          <input 
            name="image" 
            type="file" 
            accept="image/*" 
            className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" 
          />
        </div>

        {/* OPCIONES DE VISIBILIDAD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-text-main/10">
            <label className="flex items-center gap-3 p-3 rounded border border-text-main/10 bg-background/50 cursor-pointer hover:bg-text-main/5 transition-colors">
                <input type="checkbox" name="is_published" defaultChecked className="w-4 h-4 rounded border-text-main/20 text-primary focus:ring-primary bg-transparent" />
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-text-main flex items-center gap-2">
                        <Eye className="w-3 h-3" /> Publicar
                    </span>
                    <span className="text-xs text-text-muted">Visible en la web pública</span>
                </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded border border-text-main/10 bg-background/50 cursor-pointer hover:bg-text-main/5 transition-colors">
                <input type="checkbox" name="is_featured" className="w-4 h-4 rounded border-text-main/20 text-secondary focus:ring-secondary bg-transparent" />
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
            disabled={isLoading}
            className="w-full bg-primary text-background font-bold py-4 rounded hover:opacity-90 hover:shadow-[0_0_20px_var(--primary-glow)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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