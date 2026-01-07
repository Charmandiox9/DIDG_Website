"use client";

import { Calendar, Video, FileText, Trash2, Pencil, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { deleteAyudantia } from "@/core/actions/ayudantias";
import { useState } from "react";
import { AyudantiaForm } from "./AyudantiaForm";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { cn } from "@/core/utils/cn"; // Asegúrate de tener esto o usa template literals

interface Props {
  ayu: any;
  subjectId: string;
}

export function AyudantiaCard({ ayu, subjectId }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // <--- NUEVO ESTADO

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de eliminar esta ayudantía y sus archivos?")) {
      await deleteAyudantia(ayu.id, subjectId);
    }
  };

  // Configuración de Markdown (Reutilizamos la misma de la vista pública)
  const markdownComponents = {
    h1: ({node, ...props}: any) => <h4 className="text-base font-bold text-white mt-3 mb-1 uppercase border-b border-white/10 pb-1" {...props} />,
    h2: ({node, ...props}: any) => <h5 className="text-sm font-bold text-secondary mt-3 mb-1" {...props} />,
    p: ({node, ...props}: any) => <div className="mb-2 leading-relaxed" {...props} />,
    ul: ({node, ...props}: any) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
    ol: ({node, ...props}: any) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
    li: ({node, ...props}: any) => <li className="pl-1" {...props} />,
    a: ({node, ...props}: any) => <a className="text-blue-400 hover:underline" target="_blank" rel="noreferrer" {...props} />,
    img: ({node, ...props}: any) => (
       // eslint-disable-next-line @next/next/no-img-element
       <img className="rounded-md max-w-full my-2 inline-block" {...props} alt={props.alt || "Imagen"} />
    ),
    code: ({node, ...props}: any) => <code className="bg-black/30 px-1 rounded font-mono text-xs" {...props} />,
    strong: ({node, ...props}: any) => <strong className="text-white font-semibold" {...props} />,
    hr: ({node, ...props}: any) => <hr className="my-3 border-white/10" {...props} />
  };

  return (
    <>
      <Card className="p-4 flex flex-col sm:flex-row gap-4 group hover:border-primary/40 transition-colors relative bg-surface/40">
        
        {/* Fecha Box */}
        <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded border border-white/5 min-w-[80px] h-fit">
          <Calendar className="w-4 h-4 text-primary mb-1" />
          <span className="text-xs font-mono text-text-muted">
            {new Date(ayu.date).toLocaleDateString("es-CL", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2">{ayu.title}</h3>
          
          {/* --- ZONA DE CONTENIDO EXPANDIBLE --- */}
          <div className="relative mb-3">
            <div 
                className={cn(
                    "text-sm text-text-muted overflow-hidden transition-all duration-500",
                    isExpanded ? "max-h-none" : "max-h-[100px]" // Altura máxima de 100px si está cerrado
                )}
            >
              {ayu.description ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={markdownComponents}
                >
                  {ayu.description}
                </ReactMarkdown>
              ) : (
                <span className="italic opacity-50">Sin descripción</span>
              )}
            </div>

            {/* Degradado para indicar que hay más texto (Solo si no está expandido y hay descripción) */}
            {!isExpanded && ayu.description && ayu.description.length > 150 && (
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
            )}
          </div>

          {/* Botón Ver Más / Menos */}
          {ayu.description && ayu.description.length > 150 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="self-start text-xs font-bold text-secondary hover:text-white flex items-center gap-1 mb-3 transition-colors"
              >
                  {isExpanded ? (
                      <>Ver menos <ChevronUp className="w-3 h-3" /></>
                  ) : (
                      <>Ver detalle completo <ChevronDown className="w-3 h-3" /></>
                  )}
              </button>
          )}
          {/* ------------------------------------ */}

          <div className="flex gap-2 clear-both mt-auto">
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

        {/* Acciones (Editar/Eliminar) */}
        <div className="flex items-start gap-1">
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 text-text-muted hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button 
            onClick={handleDelete}
            className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </Card>

      {/* Modal Edición */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-lg relative my-8">
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