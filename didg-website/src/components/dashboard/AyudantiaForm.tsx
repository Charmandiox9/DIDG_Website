"use client";

import { createAyudantia } from "@/core/actions/ayudantias";
import { Upload, Video, Loader2 } from "lucide-react";
import { useState, useRef } from "react";

interface Props {
  subjectId: string;
}

export function AyudantiaForm({ subjectId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Wrapper para manejar la respuesta del servidor
  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      // Intentamos crear la ayudantía
      await createAyudantia(formData);
      
      // Si llega aquí, fue exitoso
      formRef.current?.reset(); // Limpiamos los inputs
      alert("✅ Ayudantía subida correctamente");
      
    } catch (error: any) {
      // Si falla, mostramos el error real
      console.error(error);
      alert("❌ Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface/50 border border-white/10 rounded-xl p-6 sticky top-24">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5 text-primary" />
        Nueva Ayudantía
      </h3>

      <form 
        ref={formRef} 
        action={handleSubmit} 
        className="space-y-4"
      >
        <input type="hidden" name="subject_id" value={subjectId} />

        <div className="space-y-1">
          <label className="text-xs font-mono text-text-muted uppercase">Título</label>
          <input 
            name="title" 
            required 
            placeholder="Ej: Ayudantía 1 - SQL" 
            className="w-full bg-background/50 border border-white/10 rounded p-2 text-sm text-white focus:border-primary/50 outline-none" 
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-text-muted uppercase">Fecha</label>
          <input 
            name="date" 
            type="date" 
            required 
            className="w-full bg-background/50 border border-white/10 rounded p-2 text-sm text-white focus:border-primary/50 outline-none" 
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-text-muted uppercase">Descripción</label>
          <textarea 
            name="description" 
            rows={2} 
            placeholder="Temas vistos..." 
            className="w-full bg-background/50 border border-white/10 rounded p-2 text-sm text-white focus:border-primary/50 outline-none" 
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-text-muted uppercase">Video URL (Opcional)</label>
          <div className="relative">
            <Video className="absolute left-2 top-2.5 w-4 h-4 text-text-muted" />
            <input 
              name="video_url" 
              type="url" 
              placeholder="https://youtube.com/..." 
              className="w-full bg-background/50 border border-white/10 rounded p-2 pl-8 text-sm text-white focus:border-primary/50 outline-none" 
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-text-muted uppercase">Material (PDF/ZIP)</label>
          <input 
            name="file" 
            type="file" 
            className="w-full text-xs text-text-muted file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-primary text-background font-bold py-3 rounded hover:bg-primary/90 transition-all mt-2 flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Subiendo...
            </>
          ) : (
            "SUBIR CONTENIDO"
          )}
        </button>
      </form>
    </div>
  );
}