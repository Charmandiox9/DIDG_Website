"use client";

import { createAyudantia, updateAyudantia } from "@/core/actions/ayudantias"; // Importamos update
import { Upload, Video, Loader2, Save, X } from "lucide-react";
import { useState, useRef } from "react";

interface Props {
  subjectId: string;
  initialData?: any; // Datos para editar (opcional)
  onCancel?: () => void; // Para cerrar el modal de edición
}

export function AyudantiaForm({ subjectId, initialData, onCancel }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = !!initialData;

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      if (isEditing) {
        // MODO EDICIÓN
        await updateAyudantia(initialData.id, formData);
        alert("✅ Ayudantía actualizada");
        if (onCancel) onCancel();
      } else {
        // MODO CREACIÓN
        await createAyudantia(formData);
        formRef.current?.reset();
        alert("✅ Ayudantía creada");
      }
    } catch (error: any) {
      console.error(error);
      alert("❌ Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-surface/50 border border-white/10 rounded-xl p-6 ${isEditing ? "" : "sticky top-24"}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {isEditing ? <Save className="w-5 h-5 text-blue-400" /> : <Upload className="w-5 h-5 text-primary" />}
            {isEditing ? "Editar Ayudantía" : "Nueva Ayudantía"}
        </h3>
        {isEditing && (
            <button onClick={onCancel} className="text-text-muted hover:text-white">
                <X className="w-5 h-5" />
            </button>
        )}
      </div>

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
            defaultValue={initialData?.title} // Pre-carga
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
            defaultValue={initialData?.date} // Pre-carga
            required 
            className="w-full bg-background/50 border border-white/10 rounded p-2 text-sm text-white focus:border-primary/50 outline-none" 
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-text-muted uppercase">Descripción</label>
          <textarea 
            name="description" 
            rows={2} 
            defaultValue={initialData?.description} // Pre-carga
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
              defaultValue={initialData?.video_url} // Pre-carga
              placeholder="https://youtube.com/..." 
              className="w-full bg-background/50 border border-white/10 rounded p-2 pl-8 text-sm text-white focus:border-primary/50 outline-none" 
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-text-muted uppercase">
            {isEditing ? "Reemplazar Material (Opcional)" : "Material (PDF/ZIP)"}
          </label>
          <input 
            name="file" 
            type="file" 
            className="w-full text-xs text-text-muted file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
          />
          {isEditing && initialData?.material_url && (
             <p className="text-[10px] text-green-400 mt-1">✓ Ya existe un archivo adjunto (subir otro lo reemplazará)</p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full font-bold py-3 rounded transition-all mt-2 flex justify-center items-center gap-2 disabled:opacity-50 ${isEditing ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-primary text-background hover:bg-primary/90'}`}
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
          ) : (
            isEditing ? "GUARDAR CAMBIOS" : "SUBIR CONTENIDO"
          )}
        </button>
      </form>
    </div>
  );
}