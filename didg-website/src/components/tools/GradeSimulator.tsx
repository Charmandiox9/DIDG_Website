"use client";

import { useState, useEffect } from "react";
import { Calculator, Plus, Trash2, RefreshCcw, Target } from "lucide-react";

interface GradeItem {
  id: string;
  name: string;
  weight: number; // Porcentaje (0-100)
  grade: number | null; // Nota (1.0 - 7.0)
}

export function GradeSimulator() {
  // Estado inicial con 3 evaluaciones
  const [grades, setGrades] = useState<GradeItem[]>([
    { id: '1', name: 'Certamen 1', weight: 25, grade: null },
    { id: '2', name: 'Certamen 2', weight: 25, grade: null },
    { id: '3', name: 'Tareas', weight: 20, grade: null },
  ]);

  const [targetGrade, setTargetGrade] = useState(4.0);
  const [needed, setNeeded] = useState<number | null>(null);
  const [currentAverage, setCurrentAverage] = useState<number | null>(null);

  // Cálculos dinámicos
  useEffect(() => {
    let totalWeightedScore = 0;
    let totalWeightUsed = 0;

    grades.forEach(g => {
      if (g.grade !== null) {
        totalWeightedScore += g.grade * (g.weight / 100);
        totalWeightUsed += g.weight;
      }
    });

    // 1. Calcular Promedio Actual (de lo que lleva)
    if (totalWeightUsed > 0) {
      setCurrentAverage(parseFloat((totalWeightedScore / (totalWeightUsed / 100)).toFixed(1)));
    } else {
      setCurrentAverage(null);
    }

    // 2. Calcular Nota Necesaria (para el resto del 100%)
    const remainingWeight = 100 - grades.reduce((sum, g) => sum + g.weight, 0);
    
    // Si la suma de pesos no es 100%, calculamos sobre el remanente imaginario
    // Fórmula: (NotaObjetivo - NotaPonderadaAcumulada) / (PesoRestante / 100)
    
    // Validamos que los pesos sumen 100 o menos
    const totalDefinedWeight = grades.reduce((sum, g) => sum + g.weight, 0);
    
    if (totalDefinedWeight < 100) {
        const remaining = 100 - totalDefinedWeight;
        // Asumimos que el usuario quiere saber cuánto necesita en el % restante para lograr la meta
        // Meta = Acumulado + (Necesaria * Restante%)
        // Necesaria = (Meta - Acumulado) / Restante%
        const scoreNeeded = (targetGrade - totalWeightedScore) / (remaining / 100);
        setNeeded(parseFloat(scoreNeeded.toFixed(1)));
    } else {
        setNeeded(null); // Ya está todo jugado
    }

  }, [grades, targetGrade]);

  const addGrade = () => {
    const id = Date.now().toString();
    setGrades([...grades, { id, name: `Evaluación ${grades.length + 1}`, weight: 10, grade: null }]);
  };

  const removeGrade = (id: string) => {
    setGrades(grades.filter(g => g.id !== id));
  };

  const updateGrade = (id: string, field: keyof GradeItem, value: any) => {
    setGrades(grades.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0);

  return (
    <div className="w-full max-w-2xl mx-auto bg-surface border border-text-main/10 rounded-xl p-6 shadow-xl">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6 border-b border-text-main/10 pb-4">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
            <Calculator className="w-6 h-6" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-text-main">Simulador de Notas</h2>
            <p className="text-sm text-text-muted">Calcula si pasas el ramo o mueres en el intento.</p>
        </div>
      </div>

      {/* META */}
      <div className="mb-6 flex items-center justify-between bg-background/50 p-4 rounded-lg border border-text-main/5">
        <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-text-muted" />
            <span className="text-sm font-bold text-text-main">Nota Meta:</span>
        </div>
        <input 
            type="number" 
            step="0.1" 
            min="1.0" 
            max="7.0"
            value={targetGrade}
            onChange={(e) => setTargetGrade(parseFloat(e.target.value))}
            className="w-20 text-center bg-surface border border-text-main/10 rounded p-1 text-lg font-bold text-primary focus:border-primary outline-none"
        />
      </div>

      {/* TABLA DE NOTAS */}
      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-12 gap-2 text-xs font-bold text-text-muted uppercase px-2">
            <div className="col-span-5">Evaluación</div>
            <div className="col-span-3 text-center">Ponderación (%)</div>
            <div className="col-span-3 text-center">Nota</div>
            <div className="col-span-1"></div>
        </div>

        {grades.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center group">
                {/* Nombre */}
                <div className="col-span-5">
                    <input 
                        type="text" 
                        value={item.name}
                        onChange={(e) => updateGrade(item.id, 'name', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent focus:border-primary outline-none text-sm text-text-main placeholder:text-text-muted/50"
                        placeholder="Nombre..."
                    />
                </div>
                {/* Peso */}
                <div className="col-span-3">
                    <input 
                        type="number" 
                        value={item.weight}
                        onChange={(e) => updateGrade(item.id, 'weight', parseFloat(e.target.value))}
                        className="w-full text-center bg-background/50 border border-text-main/10 rounded p-1.5 text-sm text-text-main focus:border-primary outline-none"
                    />
                </div>
                {/* Nota */}
                <div className="col-span-3">
                    <input 
                        type="number" 
                        step="0.1"
                        placeholder="-"
                        value={item.grade || ''}
                        onChange={(e) => updateGrade(item.id, 'grade', e.target.value ? parseFloat(e.target.value) : null)}
                        className="w-full text-center bg-background/50 border border-text-main/10 rounded p-1.5 text-sm font-bold text-text-main focus:border-primary outline-none"
                    />
                </div>
                {/* Borrar */}
                <div className="col-span-1 flex justify-center">
                    <button 
                        onClick={() => removeGrade(item.id)}
                        className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        ))}

        <button 
            onClick={addGrade}
            className="flex items-center gap-2 text-xs font-bold text-primary hover:underline mt-2 px-2"
        >
            <Plus className="w-3 h-3" /> Agregar Evaluación
        </button>
      </div>

      {/* RESULTADOS FOOTER */}
      <div className="border-t border-text-main/10 pt-4 grid grid-cols-2 gap-4">
         {/* Resumen de Pesos */}
         <div className="p-3 rounded-lg bg-background/30 flex flex-col justify-center items-center">
            <span className="text-xs text-text-muted uppercase">Ponderación Total</span>
            <span className={`text-xl font-bold ${totalWeight > 100 ? 'text-red-500' : 'text-text-main'}`}>
                {totalWeight}%
            </span>
            {totalWeight > 100 && <span className="text-[10px] text-red-400">¡Te pasaste del 100%!</span>}
         </div>

         {/* Promedio Actual */}
         <div className="p-3 rounded-lg bg-background/30 flex flex-col justify-center items-center">
            <span className="text-xs text-text-muted uppercase">Promedio Parcial</span>
            <span className="text-xl font-bold text-text-main">
                {currentAverage || '-'}
            </span>
         </div>
      </div>

      {/* LA RESPUESTA FINAL */}
      <div className={`mt-4 p-4 rounded-xl text-center border transition-all ${
          needed && needed > 7.0 ? 'bg-red-500/10 border-red-500/30' : 
          needed && needed <= 4.0 ? 'bg-emerald-500/10 border-emerald-500/30' : 
          'bg-indigo-500/10 border-indigo-500/30'
      }`}>
         <p className="text-sm font-mono text-text-muted uppercase mb-1">Para aprobar con {targetGrade} necesitas:</p>
         
         {totalWeight >= 100 ? (
             <p className="text-lg font-bold text-text-main">
                Promedio Final: <span className={currentAverage && currentAverage >= targetGrade ? 'text-emerald-500' : 'text-red-500'}>{currentAverage}</span>
             </p>
         ) : needed ? (
             <div>
                <span className={`text-4xl font-display font-bold ${
                    needed > 7.0 ? 'text-red-500' : needed > 5.5 ? 'text-orange-500' : 'text-emerald-500'
                }`}>
                    {needed}
                </span>
                <p className="text-xs mt-2 opacity-70">
                    en el {100 - totalWeight}% restante
                </p>
                {needed > 7.0 && <p className="text-xs font-bold text-red-500 mt-1">💀 F, soldado.</p>}
             </div>
         ) : (
             <span className="text-text-muted italic">Completa los datos...</span>
         )}
      </div>

    </div>
  );
}