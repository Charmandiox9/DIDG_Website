"use client";

import { FileText, Clock, Activity } from "lucide-react";

interface DownloadEvent {
  id: string;
  resource_name: string;
  subject_name: string;
  created_at: string;
}

interface Props {
  data: DownloadEvent[];
}

export function RecentDownloads({ data }: Props) {
  
  // Función auxiliar para formatear fecha (ej: "Hace 10 min")
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Hace un momento";
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full bg-surface border border-text-main/10 rounded-xl p-6 shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 border border-blue-500/20">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-text-main">Últimas Descargas</h3>
          <p className="text-xs text-text-muted font-mono">Actividad en tiempo real</p>
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 space-y-4">
        {data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-text-muted text-xs border border-dashed border-text-main/10 rounded-lg p-4">
            <Clock className="w-8 h-8 mb-2 opacity-50" />
            No hay actividad reciente.
          </div>
        ) : (
          data.map((item) => (
            <div 
              key={item.id} 
              className="group flex items-start gap-3 p-3 rounded-lg hover:bg-background/50 border border-transparent hover:border-text-main/5 transition-all"
            >
              {/* Icono */}
              <div className="mt-1 p-1.5 rounded bg-surface border border-text-main/10 text-text-muted group-hover:text-primary group-hover:border-primary/30 transition-colors">
                <FileText className="w-4 h-4" />
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-main truncate group-hover:text-primary transition-colors">
                  {item.resource_name}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] uppercase font-bold text-text-muted truncate max-w-[60%]">
                    {item.subject_name}
                  </p>
                  <p className="text-[10px] font-mono text-text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(item.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}