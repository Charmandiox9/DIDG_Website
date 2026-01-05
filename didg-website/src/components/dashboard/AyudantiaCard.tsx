"use client";

import { Calendar, Video, FileText, Trash2, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { deleteAyudantia } from "@/core/actions/ayudantias";
import { useState } from "react";
import { AyudantiaForm } from "./AyudantiaForm"; // Reusamos el formulario

interface Props {
  ayu: any;
  subjectId: string;
}

export function AyudantiaCard({ ayu, subjectId }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  // Función para borrar con confirmación
  const handleDelete = async () => {
    if (confirm("¿Estás seguro de eliminar esta ayudantía y sus archivos?")) {
      await deleteAyudantia(ayu.id, subjectId);
    }
  };

  return (
    <>
      <Card className="p-4 flex flex-col sm:flex-row gap-4 group hover:border-primary/40 transition-colors relative">
        {/* Fecha Box */}
        <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded border border-white/5 min-w-[80px]">
          <Calendar className="w-4 h-4 text-primary mb-1" />
          <span className="text-xs font-mono text-text-muted">
            {new Date(ayu.date).toLocaleDateString()}
          </span>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{ayu.title}</h3>
          <p className="text-sm text-text-muted mb-3">
            {ayu.description || "Sin descripción"}
          </p>

          <div className="flex gap-2">
            {ayu.material_url && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <FileText className="w-3 h-3" /> Archivo
              </span>
            )}
            {ayu.video_url && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                <Video className="w-3 h-3" /> Video
              </span>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-start gap-1">
          {/* Botón Editar */}
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 text-text-muted hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {/* Botón Eliminar */}
          <button 
            onClick={handleDelete}
            className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </Card>

      {/* MODAL DE EDICIÓN SIMPLE (Overlay) */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg relative">
             {/* Pasamos initialData para activar modo edición */}
            <AyudantiaForm 
                subjectId={subjectId} 
                initialData={ayu} 
                onCancel={() => setIsEditing(false)} 
            />
          </div>
        </div>
      )}
    </>
  );
}