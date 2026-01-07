"use client";

import { useState } from "react";
import { Video, Calendar, FileText, Eye, X, Maximize2 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { DownloadButton } from "@/components/courses/DownloadButton";
import { cn } from "@/core/utils/cn"; // Asegúrate de tener esta utilidad, si no, usa template literals

interface Props {
  ayu: any;
  publicUrl: string; // URL procesada del archivo
  isPdf: boolean;
}

export function AyudantiaTimelineItem({ ayu, publicUrl, isPdf }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // Configuración común de Markdown para no repetirla
  const markdownComponents = {
    h1: ({node, ...props}: any) => <h4 className="text-base font-bold text-white mt-3 mb-1 uppercase border-b border-white/10 pb-1" {...props} />,
    h2: ({node, ...props}: any) => <h5 className="text-sm font-bold text-secondary mt-3 mb-1" {...props} />,
    p: ({node, ...props}: any) => <div className="mb-2 leading-relaxed" {...props} />,
    ul: ({node, ...props}: any) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
    ol: ({node, ...props}: any) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
    li: ({node, ...props}: any) => <li className="pl-1" {...props} />,
    a: ({node, ...props}: any) => <a className="text-primary hover:underline" target="_blank" rel="noreferrer" {...props} />,
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
      {/* --- TARJETA DEL TIMELINE --- */}
      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
        
        {/* Icono Central (Timeline) */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-secondary">
          <Calendar className="w-5 h-5" />
        </div>

        {/* Tarjeta Visual */}
        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-white/10 bg-surface/40 hover:border-secondary/30 transition-all shadow-lg backdrop-blur-sm relative overflow-hidden flex flex-col">
          
          <div className="flex items-center justify-between mb-2">
            <time className="font-mono text-xs text-text-muted">{new Date(ayu.date).toLocaleDateString()}</time>
            {ayu.video_url && <Video className="w-4 h-4 text-red-400" />}
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{ayu.title}</h3>

          {/* CONTENIDO RECORTADO */}
          {/* max-h-[150px] define la altura máxima antes de cortar */}
          <div className="relative max-h-[350px] overflow-hidden">
            <div className="text-sm text-text-muted">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw]} 
                components={markdownComponents}
              >
                {ayu.description || ""}
              </ReactMarkdown>
            </div>
            
            {/* Degradado para indicar "leer más" */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
          </div>

          {/* Botón Ver Más */}
          <button 
            onClick={() => setIsOpen(true)}
            className="mt-4 w-full py-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary border border-secondary/20 rounded hover:bg-secondary/10 transition-colors z-20"
          >
            <Maximize2 className="w-3 h-3" /> Ver Detalle Completo
          </button>

        </div>
      </div>

      {/* --- MODAL (RECUADRO) --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)} // Cerrar al hacer click fuera
        >
          <div 
            className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Evitar cerrar al clickear dentro
          >
            
            {/* Header Modal */}
            <div className="p-6 border-b border-white/10 flex justify-between items-start bg-surface/50">
              <div>
                <div className="flex items-center gap-3 text-xs font-mono text-text-muted mb-2">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(ayu.date).toLocaleDateString()}</span>
                    {ayu.video_url && <span className="flex items-center gap-1 text-red-400"><Video className="w-3 h-3"/> Grabación disponible</span>}
                </div>
                <h2 className="text-2xl font-bold text-white">{ayu.title}</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Modal (Scrollable) */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
               <div className="prose prose-invert prose-sm max-w-none text-text-muted">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    rehypePlugins={[rehypeRaw]} 
                    components={markdownComponents}
                  >
                    {ayu.description || "Sin descripción detallada."}
                  </ReactMarkdown>
               </div>
            </div>

            {/* Footer Modal (Archivos y Links) */}
            <div className="p-6 border-t border-white/10 bg-surface/30 flex flex-wrap gap-3">
                {ayu.material_url ? (
                  <div className="flex gap-2">
                    <DownloadButton filePath={ayu.material_url} />
                    {isPdf && (
                        <a 
                            href={publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded transition-all"
                        >
                            <Eye className="w-3 h-3" /> Ver PDF
                        </a>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-text-muted italic flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Sin material adjunto
                  </span>
                )}

                {ayu.video_url && (
                  <a 
                    href={ayu.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded transition-all ml-auto"
                  >
                    <Video className="w-3 h-3" /> Ver Grabación
                  </a>
                )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}