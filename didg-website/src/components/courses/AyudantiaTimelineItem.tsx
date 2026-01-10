"use client";

import { useState } from "react";
import { Video, Calendar, FileText, Eye, X, Maximize2 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { DownloadButton } from "@/components/courses/DownloadButton";
import { ReportButton } from "@/components/feedback/ReportButton";
import { BookmarkAyudantiaButton } from "./BookmarkAyudantiaButton";
import { cn } from "@/core/utils/cn";

interface Props {
  ayu: any;
  publicUrl: string;
  isPdf: boolean;
  subjectName?: string;
  isBookmarked?: boolean;
}

export function AyudantiaTimelineItem({ ayu, publicUrl, isPdf, subjectName = "General", isBookmarked = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const markdownComponents = {
    h1: ({node, ...props}: any) => <h4 className="text-base font-bold text-text-main mt-3 mb-1 uppercase border-b border-text-main/10 pb-1" {...props} />,
    h2: ({node, ...props}: any) => <h5 className="text-sm font-bold text-secondary mt-3 mb-1" {...props} />,
    p: ({node, ...props}: any) => <div className="mb-2 leading-relaxed text-text-muted" {...props} />,
    ul: ({node, ...props}: any) => <ul className="list-disc pl-4 mb-2 space-y-1 text-text-muted" {...props} />,
    ol: ({node, ...props}: any) => <ol className="list-decimal pl-4 mb-2 space-y-1 text-text-muted" {...props} />,
    li: ({node, ...props}: any) => <li className="pl-1" {...props} />,
    a: ({node, ...props}: any) => <a className="text-primary hover:underline font-medium" target="_blank" rel="noreferrer" {...props} />,
    img: ({node, ...props}: any) => (
       <img className="rounded-md max-w-full my-2 inline-block border border-text-main/10" {...props} alt={props.alt || "Imagen"} />
    ),
    code: ({node, ...props}: any) => <code className="bg-surface border border-text-main/10 px-1 rounded font-mono text-xs text-primary" {...props} />,
    strong: ({node, ...props}: any) => <strong className="text-text-main font-semibold" {...props} />,
    hr: ({node, ...props}: any) => <hr className="my-3 border-text-main/10" {...props} />
  };

  return (
    <>
      {/* --- TARJETA DEL TIMELINE --- */}
      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
        
        {/* Icono Central (Timeline) */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-text-main/10 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-secondary transition-colors duration-300">
          <Calendar className="w-5 h-5" />
        </div>

        {/* Tarjeta Visual */}
        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-text-main/10 bg-surface/50 hover:border-secondary/30 transition-all shadow-lg backdrop-blur-sm relative overflow-hidden flex flex-col group-hover:shadow-xl">
          
          <div className="flex items-center justify-between mb-2">
            <time 
              suppressHydrationWarning 
              className="font-mono text-xs text-text-muted"
            >
              {/* RECOMENDACIÓN */}
              {new Date(ayu.date).toLocaleDateString('es-CL', { timeZone: 'UTC' })}
            </time>
            {ayu.video_url && <Video className="w-4 h-4 text-red-400" />}

            <BookmarkAyudantiaButton ayudantiaId={ayu.id} initialState={isBookmarked} />
          </div>

          <h3 className="text-xl font-bold text-text-main mb-2">{ayu.title}</h3>

          {/* CONTENIDO RECORTADO */}
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
            
            {/* Degradado adaptable */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
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
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Container */}
          <div 
            className="bg-background border border-text-main/10 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header Modal */}
            <div className="p-6 border-b border-text-main/10 flex justify-between items-start bg-surface/30">
              <div>
                <div className="flex items-center gap-3 text-xs font-mono text-text-muted mb-2">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(ayu.date).toLocaleDateString('es-CL', { timeZone: 'UTC' })}</span>
                    {ayu.video_url && <span className="flex items-center gap-1 text-red-400"><Video className="w-3 h-3"/> Grabación disponible</span>}
                </div>
                <h2 className="text-2xl font-bold text-text-main">{ayu.title}</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-text-main/5 rounded-full transition-colors text-text-muted hover:text-text-main">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-6 overflow-y-auto custom-scrollbar bg-background">
               <div className="prose prose-sm max-w-none text-text-muted prose-headings:text-text-main prose-strong:text-text-main prose-code:text-primary">
                 <ReactMarkdown 
                   remarkPlugins={[remarkGfm]} 
                   rehypePlugins={[rehypeRaw]} 
                   components={markdownComponents}
                 >
                   {ayu.description || "Sin descripción detallada."}
                 </ReactMarkdown>
               </div>
            </div>

            {/* Footer Modal */}
            <div className="p-6 border-t border-text-main/10 bg-surface/30 flex flex-wrap gap-3">
                {ayu.material_url ? (
                  <div className="flex gap-2">
                    <DownloadButton 
                        filePath={ayu.material_url} 
                        fileName={ayu.title} 
                        subjectName={subjectName}
                    />
                    {isPdf && (
                        <a 
                            href={publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-500 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded transition-all"
                        >
                            <Eye className="w-3 h-3" /> Ver PDF
                        </a>
                    )}
                    <div className="ml-auto">
                        <ReportButton 
                        resourceTitle={ayu.title} 
                        subjectName={subjectName}
                        />
                    </div>
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
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded transition-all ml-auto"
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