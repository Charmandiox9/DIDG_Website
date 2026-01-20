import { createClient } from "@/infrastructure/supabase/server";
import { Mail, Calendar, User, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
// 1. IMPORTAR EL NUEVO COMPONENTE
import { MessageActions } from "@/components/dashboard/MessageActions";

export default async function MessagesPage() {
  const supabase = await createClient();

  // 2. MODIFICAMOS EL SORT: Primero los NO leídos, luego por fecha
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .order("is_read", { ascending: true }) // false (no leído) aparece primero
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-text-main flex items-center gap-3">
          <Mail className="w-8 h-8 text-primary" />
          Buzón de Entrada
        </h1>
        <div className="text-sm font-mono text-text-muted bg-surface px-3 py-1 rounded-full border border-text-main/10 shadow-sm">
          Total: {messages?.length || 0}
        </div>
      </div>

      <div className="grid gap-4">
        {(!messages || messages.length === 0) ? (
            <div className="p-12 text-center border border-dashed border-text-main/10 rounded-xl bg-surface/30 text-text-muted">
                <AlertCircle className="w-10 h-10 mx-auto mb-4 opacity-50" />
                <p>No hay mensajes registrados aún.</p>
            </div>
        ) : (
            messages.map((msg: any) => (
                <div 
                    key={msg.id} 
                    className={`p-6 rounded-xl border transition-all hover:border-primary/50 group relative overflow-hidden ${
                        msg.is_read 
                        ? "bg-surface/30 border-text-main/5 opacity-80 hover:opacity-100" // Estilo para VISTOS
                        : "bg-surface border-primary/30 shadow-lg shadow-primary/5"         // Estilo para NUEVOS
                    }`}
                >
                    {/* Indicador de No Leído (Punto brillante) */}
                    {!msg.is_read && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-primary blur-sm animate-pulse" />
                    )}

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors flex items-center gap-3">
                                {msg.subject || "Sin Asunto"}
                                
                                {/* 3. AQUÍ INSERTAMOS EL BOTÓN DE ACCIÓN */}
                                <div className="ml-2">
                                    <MessageActions id={msg.id} isRead={msg.is_read} />
                                </div>
                            </h3>

                            <div className="flex items-center gap-2 text-sm text-text-muted font-mono">
                                <User className="w-3 h-3" />
                                <span className="text-text-main font-semibold">{msg.name}</span>
                                <span className="opacity-50">&lt;{msg.email}&gt;</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono text-text-muted bg-background/50 px-2 py-1 rounded border border-text-main/5 h-fit whitespace-nowrap">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(msg.created_at), "dd MMM yyyy, HH:mm", { locale: es })}
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-background/50 border border-text-main/5 text-sm text-text-muted font-mono leading-relaxed whitespace-pre-wrap selection:bg-primary/20 selection:text-primary">
                        {msg.message}
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}