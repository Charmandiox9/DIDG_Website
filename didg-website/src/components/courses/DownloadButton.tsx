"use client";

import { getSignedUrl } from "@/core/actions/ayudantias";
import { Download, Loader2, FileText } from "lucide-react";
import { useState } from "react";

interface Props {
  filePath: string;
  label?: string;
}

export function DownloadButton({ filePath, label = "Descargar Material" }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      // 1. Pedir la URL firmada al servidor
      const url = await getSignedUrl(filePath);
      
      // 2. Abrir en nueva pestaña (inicia la descarga)
      window.open(url, "_blank");
    } catch (error) {
      alert("Error al descargar el archivo. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-background bg-primary rounded hover:bg-primary/90 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] disabled:opacity-50"
    >
      {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
      {label}
    </button>
  );
}