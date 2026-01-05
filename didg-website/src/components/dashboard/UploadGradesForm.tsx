"use client";

import { uploadGrades } from "@/core/actions/grades-upload";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";

interface Props {
  subjects: { id: string; name: string; code: string }[];
  defaultSubjectId?: string; // <--- Definido aquí
}

// CORRECCIÓN AQUÍ ABAJO: Agregamos defaultSubjectId al destructuring
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
      <div className="bg-surface/50 border border-white/10 p-6 rounded-xl">
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          
          {/* 1. Selección de Asignatura */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-primary uppercase">Asignatura</label>
            <select 
              name="subject_id" 
              required 
              defaultValue={defaultSubjectId || ""} // <--- Ahora sí funcionará
              className="w-full bg-background/50 border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none appearance-none"
            >
              <option value="">-- Seleccionar Asignatura --</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  [{sub.code}] {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Nombre Evaluación */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-primary uppercase">Nombre Evaluación</label>
            <input 
              name="evaluation_name" 
              placeholder="Ej: Certamen 1" 
              required 
              className="w-full bg-background/50 border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none" 
            />
          </div>

          {/* 3. Archivo */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-primary uppercase">Archivo de Notas</label>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-primary/30 transition-colors bg-background/20">
              <input 
                name="file" 
                type="file" 
                accept=".csv, .xlsx, .xls" 
                required 
                className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-background hover:file:bg-primary/90" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary text-background font-bold py-4 rounded hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
            {result.errors ? <AlertCircle className="text-red-400" /> : <CheckCircle className="text-emerald-400" />}
            <h4 className="font-bold text-white">
              Procesado completado
            </h4>
          </div>
          
          <p className="text-sm text-text-muted mb-2">
            Se insertaron <strong>{result.count}</strong> notas correctamente.
          </p>

          {result.errors && (
            <div className="mt-2 p-2 bg-black/30 rounded text-xs font-mono text-red-300 max-h-40 overflow-y-auto">
              <p className="font-bold mb-1">Errores encontrados:</p>
              <ul className="list-disc list-inside">
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