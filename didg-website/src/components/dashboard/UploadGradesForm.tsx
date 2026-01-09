"use client";

import { uploadGrades } from "@/core/actions/grades-upload";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";

interface Props {
  subjects: { id: string; name: string; code: string }[];
  defaultSubjectId?: string;
}

export function UploadGradesForm({ subjects, defaultSubjectId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await uploadGrades(formData);
      setResult(response);
      
      if (!response.errors) {
        formRef.current?.reset();
      }
    } catch (error: any) {
      alert("Error crítico: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface/50 border border-text-main/10 p-6 rounded-xl shadow-sm">
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          
          {/* 1. Selección de Asignatura */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-primary uppercase font-bold">Asignatura</label>
            <select 
              name="subject_id" 
              required 
              defaultValue={defaultSubjectId || ""} 
              // Select Adaptable
              className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none appearance-none cursor-pointer transition-colors"
            >
              <option value="" className="bg-background text-text-main">-- Seleccionar Asignatura --</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id} className="bg-background text-text-main">
                  [{sub.code}] {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Nombre Evaluación */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-primary uppercase font-bold">Nombre Evaluación</label>
            <input 
              name="evaluation_name" 
              placeholder="Ej: Certamen 1" 
              required 
              // Input Adaptable
              className="w-full bg-background/50 border border-text-main/10 rounded p-3 text-text-main focus:border-primary/50 outline-none transition-colors placeholder:text-text-muted/50" 
            />
          </div>

          {/* 3. Archivo */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-primary uppercase font-bold">Archivo de Notas</label>
            <div className="border-2 border-dashed border-text-main/10 rounded-xl p-6 text-center hover:border-primary/30 transition-colors bg-background/50">
              <input 
                name="file" 
                type="file" 
                accept=".csv, .xlsx, .xls" 
                required 
                className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-background hover:file:opacity-90 cursor-pointer" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary text-background font-bold py-4 rounded hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm hover:shadow-[0_0_15px_var(--primary-glow)]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            PROCESAR ARCHIVO
          </button>
        </form>
      </div>

      {/* Resultados / Errores */}
      {result && (
        <div className={`p-4 rounded-xl border ${result.errors ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
          <div className="flex items-center gap-3 mb-2">
            {result.errors ? <AlertCircle className="text-red-500" /> : <CheckCircle className="text-emerald-500" />}
            <h4 className={`font-bold ${result.errors ? 'text-red-500' : 'text-emerald-500'}`}>
              Procesado completado
            </h4>
          </div>
          
          <p className="text-sm text-text-muted mb-2 font-medium">
            Se insertaron <strong className="text-text-main">{result.count}</strong> notas correctamente.
          </p>

          {result.errors && (
            // Caja de logs de error
            <div className="mt-2 p-3 bg-background/50 border border-text-main/10 rounded text-xs font-mono text-red-500 max-h-40 overflow-y-auto">
              <p className="font-bold mb-1 uppercase">Errores encontrados:</p>
              <ul className="list-disc list-inside space-y-1 opacity-80">
                {result.errors.map((err: string, idx: number) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}