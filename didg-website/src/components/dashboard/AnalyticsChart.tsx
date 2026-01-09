"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

interface Props {
  data: { name: string; value: number }[];
}

export function AnalyticsChart({ data }: Props) {
  // CONFIGURACIÓN: Cuántas barras mostrar antes de agrupar
  const MAX_ITEMS = 6;

  // 1. PROCESAMIENTO DE DATOS (Lógica de "Top N + Otros")
  const processData = () => {
    // Si hay pocos datos, los mostramos tal cual
    if (data.length <= MAX_ITEMS) return data;

    // 1. Ordenamos de mayor a menor valor
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    // 2. Tomamos los Top N
    const topItems = sortedData.slice(0, MAX_ITEMS);

    // 3. Calculamos la suma del resto
    const otherItems = sortedData.slice(MAX_ITEMS);
    const otherValue = otherItems.reduce((sum, item) => sum + item.value, 0);

    // 4. Agregamos la barra "Otros" si hay remanente
    if (otherValue > 0) {
      topItems.push({ name: "Otros", value: otherValue });
    }

    return topItems;
  };

  const chartData = processData();

  // Renderizado condicional si está vacío
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-text-muted text-sm border border-dashed border-text-main/10 rounded-xl bg-background/50">
        No hay datos de descargas aún.
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="var(--text-main)" 
            strokeOpacity={0.1} 
            vertical={false} 
          />
          
          <XAxis 
            dataKey="name" 
            stroke="var(--text-muted)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            // Esto evita que los textos largos rompan el gráfico
            tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
          />
          
          <YAxis 
            stroke="var(--text-muted)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            allowDecimals={false}
          />
          
          <Tooltip
            cursor={{ fill: 'var(--text-main)', opacity: 0.05 }}
            contentStyle={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--text-main)",
              borderWidth: "1px",
              borderRadius: "12px",
              color: "var(--text-main)",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            wrapperStyle={{ outline: 'none' }}
            itemStyle={{ color: "var(--text-main)" }}
          />
          
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                // Si es la barra "Otros", la pintamos de un color distinto (ej: gris azulado o amarillo)
                // Si no, mantenemos tu patrón esmeralda
                fill={entry.name === "Otros" 
                    ? "#64748b" // Color para "Otros" (Slate-500)
                    : (index % 2 === 0 ? "#10b981" : "#059669")
                } 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}