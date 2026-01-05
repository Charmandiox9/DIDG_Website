"use client";

import { createProject } from "@/core/actions/projects"; // Importamos la acción
import { Save, Image as ImageIcon, Github, Globe, Code2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NewProjectPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Wrapper para manejar el estado de carga
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
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Nuevo Proyecto</h1>
          <p className="text-text-muted font-mono text-sm">Añade una nueva pieza a tu colección.</p>
        </div>
        <Link 
          href="/dashboard"
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
          <input name="tech_stack" placeholder="React, Node.js, ESP32, MQTT" className="w-full bg-background/50 border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none transition-colors" />
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