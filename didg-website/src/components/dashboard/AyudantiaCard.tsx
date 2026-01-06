"use client";

import { Calendar, Video, FileText, Trash2, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { deleteAyudantia } from "@/core/actions/ayudantias";
import { useState } from "react";
import { AyudantiaForm } from "./AyudantiaForm";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw"; // <--- 1. IMPORTANTE: Importar esto

interface Props {
  ayu: any;
  subjectId: string;
}

export function AyudantiaCard({ ayu, subjectId }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de eliminar esta ayudantía y sus archivos?")) {
      await deleteAyudantia(ayu.id, subjectId);
    }
  };

  return (
    <>
      <Card className="p-4 flex flex-col sm:flex-row gap-4 group hover:border-primary/40 transition-colors relative">
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

        <div className="flex-1 min-w-0"> {/* min-w-0 ayuda a que el contenido no desborde */}
          <h3 className="text-lg font-bold text-white mb-2">{ayu.title}</h3>
          
          <div className="text-sm text-text-muted mb-3">
            {ayu.description ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]} // <--- 2. ACTIVAR SOPORTE HTML
                components={{
                  // --- Estilos para HTML y Markdown ---
                  
                  // h1: Lo hacemos un poco más pequeño que el título de la tarjeta para mantener jerarquía
                  h1: ({node, ...props}) => <h4 className="text-base font-bold text-white mt-3 mb-1 uppercase border-b border-white/10 pb-1" {...props} />,
                  
                  // h2: Subtítulos
                  h2: ({node, ...props}) => <h5 className="text-sm font-bold text-secondary mt-3 mb-1" {...props} />,
                  
                  // p: Párrafos normales
                  p: ({node, ...props}) => <div className="mb-2 leading-relaxed" {...props} />,
                  
                  // ul/ol: Listas
                  ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="pl-1" {...props} />,
                  
                  // a: Enlaces
                  a: ({node, ...props}) => <a className="text-blue-400 hover:underline" target="_blank" rel="noreferrer" {...props} />,
                  
                  // img: Soporte para imágenes (como el GIF)
                  // El style={{float}} permite que el align="right" del HTML funcione visualmente
                  img: ({node, ...props}) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      className="rounded-md max-w-full my-2 inline-block" 
                      style={{ float: (props as any).align || 'none', marginLeft: (props as any).align === 'right' ? '10px' : 0 }} 
                      {...props} 
                      alt={props.alt || "Imagen"}
                    />
                  ),
                  
                  // strong/b: Negrita
                  strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                  
                  // hr: Líneas horizontales (***)
                  hr: ({node, ...props}) => <hr className="my-3 border-white/10" {...props} />
                }}
              >
                {ayu.description}
              </ReactMarkdown>
            ) : (
              <span className="italic opacity-50">Sin descripción</span>
            )}
          </div>

          <div className="flex gap-2 clear-both pt-2"> {/* clear-both asegura que los botones bajen si hay una imagen flotante */}
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