import { createClient } from "@/infrastructure/supabase/server";
import { DownloadButton } from "@/components/courses/DownloadButton";
import Link from "next/link";
import { ArrowLeft, Video, Calendar, FileText, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw"; // <--- 1. IMPORTANTE: Agregamos esto para leer HTML

const getFileUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/materials/${path}`;
};

export default async function PublicSubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const supabase = await createClient();
  const { subjectId } = await params;

  // 1. Info Asignatura
  const { data: subject } = await supabase
    .from("subjects")
    .select("*, semesters(name)")
    .eq("id", subjectId)
    .single();

  // 2. Ayudantías
  const { data: ayudantias } = await supabase
    .from("ayudantias")
    .select("*")
    .eq("subject_id", subjectId)
    .order("date", { ascending: false });

  if (!subject) return <div className="p-20 text-center text-white">Asignatura no encontrada</div>;

  const s = subject as any;
  const ayus_list = ayudantias as any[];

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-12">
        <Link href="/courses" className="inline-flex items-center gap-2 text-text-muted hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <span className="text-secondary font-mono text-sm mb-2 block">{s.semesters?.name} — {s.code}</span>
                <h1 className="text-4xl font-display font-bold text-white">{s.name}</h1>
            </div>
        </div>
      </div>

      {/* Timeline de Ayudantías */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
        
        {ayus_list?.map((ayu) => {
          const isPdf = ayu.material_url?.toLowerCase().endsWith('.pdf');
          const publicUrl = getFileUrl(ayu.material_url);

          return (
          <div key={ayu.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            
            {/* Icono Central */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-secondary">
              <Calendar className="w-5 h-5" />
            </div>
            
            {/* Tarjeta de Contenido */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-white/10 bg-surface/40 hover:border-secondary/30 transition-all shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <time className="font-mono text-xs text-text-muted">{new Date(ayu.date).toLocaleDateString()}</time>
                {ayu.video_url && <Video className="w-4 h-4 text-red-400" />}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{ayu.title}</h3>
              
              {/* RENDERIZADO DE MARKDOWN + HTML */}
              <div className="text-sm text-text-muted mb-4">
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]} // <--- 2. ACTIVAR SOPORTE HTML
                    components={{
                        // --- Estilos para HTML y Markdown ---
                        
                        // h1: Lo hacemos un poco más pequeño para mantener jerarquía visual en la tarjeta
                        h1: ({node, ...props}) => <h4 className="text-base font-bold text-white mt-3 mb-1 uppercase border-b border-white/10 pb-1" {...props} />,
                        
                        // h2: Subtítulos
                        h2: ({node, ...props}) => <h5 className="text-sm font-bold text-secondary mt-3 mb-1" {...props} />,
                        
                        // p: Párrafos
                        p: ({node, ...props}) => <div className="mb-2 leading-relaxed" {...props} />,
                        
                        // Listas
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="pl-1" {...props} />,
                        
                        // Enlaces
                        a: ({node, ...props}) => <a className="text-primary hover:underline" target="_blank" rel="noreferrer" {...props} />,
                        
                        // img: Soporte para imágenes flotantes (align="right")
                        img: ({node, ...props}) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                              className="rounded-md max-w-full my-2 inline-block" 
                              style={{ float: (props as any).align || 'none', marginLeft: (props as any).align === 'right' ? '10px' : 0 }} 
                              {...props} 
                              alt={props.alt || "Imagen"}
                            />
                        ),

                        // Code blocks
                        code: ({node, ...props}) => <code className="bg-black/30 px-1 rounded font-mono text-xs" {...props} />,
                        
                        // Negrita y Líneas
                        strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                        hr: ({node, ...props}) => <hr className="my-3 border-white/10" {...props} />
                    }}
                >
                    {ayu.description || ""}
                </ReactMarkdown>
              </div>
              
              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5 clear-both"> {/* clear-both para limpiar floats de img */}
                
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
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-white/5 rounded hover:bg-white/10 transition-all border border-white/5"
                  >
                    <Video className="w-3 h-3" /> Ver Grabación
                  </a>
                )}
              </div>
            </div>
          </div>
        )})}

        {ayus_list?.length === 0 && (
            <div className="text-center py-20 text-text-muted bg-surface/20 rounded-xl border border-dashed border-white/10 relative z-10">
                Aún no se ha subido contenido para esta asignatura.
            </div>
        )}
      </div>
    </div>
  );
}