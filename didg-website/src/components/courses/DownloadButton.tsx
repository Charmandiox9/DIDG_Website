"use client";

import { getSignedUrl } from "@/core/actions/ayudantias";
import { trackDownload } from "@/core/actions/analytics"; // <--- 1. Importamos la acción
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

interface Props {
  filePath: string;
  label?: string;
  // 2. Nuevas props para analytics
  subjectName?: string; 
  fileName?: string;    
}

export function DownloadButton({ 
  filePath, 
  label = "Descargar Material", 
  subjectName = "General", // Valor por defecto si no se pasa
  fileName 
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      // 3. Pedir la URL firmada al servidor
      const url = await getSignedUrl(filePath);
      
      // 4. REGISTRAR ANALYTICS (Fire and forget)
      // Si no pasas fileName, intentamos sacarlo del filePath (ej: carpeta/guia.pdf -> guia.pdf)
      const resourceName = fileName || filePath.split('/').pop() || "Archivo sin nombre";
      
      // Llamamos a la acción sin await para que no retrase la apertura de la ventana
      trackDownload(resourceName, subjectName);

      // 5. Abrir en nueva pestaña
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
      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-background bg-primary rounded hover:bg-primary/90 transition-all hover:shadow-[0_0_15px_var(--primary-glow)] disabled:opacity-50"
    >
      {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
      {label}
    </button>
  );
}