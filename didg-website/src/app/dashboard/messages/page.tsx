import { createClient } from "@/infrastructure/supabase/server";
import { Mail, Calendar, User, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Opcional: Si quieres un botón para marcar como leído, necesitarías una Server Action extra.
// Por ahora solo los listamos.

export default async function MessagesPage() {
  const supabase = await createClient();

  // Obtenemos los mensajes ordenados por fecha (más reciente primero)
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
          <Mail className="w-8 h-8 text-primary" />
          Buzón de Entrada
        </h1>
        <div className="text-sm font-mono text-text-muted bg-white/5 px-3 py-1 rounded-full border border-white/10">
          Total: {messages?.length || 0}
        </div>
      </div>

      <div className="grid gap-4">
        {(!messages || messages.length === 0) ? (
            <div className="p-12 text-center border border-dashed border-white/10 rounded-xl bg-surface/30 text-text-muted">
                <AlertCircle className="w-10 h-10 mx-auto mb-4 opacity-50" />
                <p>No hay mensajes registrados aún.</p>
            </div>
        ) : (
            messages.map((msg: any) => (
                <div 
                    key={msg.id} 
                    className={`p-6 rounded-xl border transition-all hover:border-primary/30 group relative overflow-hidden ${
                        msg.is_read 
                        ? "bg-surface/20 border-white/5 opacity-70 hover:opacity-100" 
                        : "bg-surface/60 border-primary/20 shadow-lg shadow-primary/5"
                    }`}
                >
                    {/* Indicador de No Leído */}
                    {!msg.is_read && (
                        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary animate-pulse" title="Nuevo Mensaje" />
                    )}

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                                {msg.subject || "Sin Asunto"}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-text-muted font-mono">
                                <User className="w-3 h-3" />
                                <span className="text-white">{msg.name}</span>
                                <span className="opacity-50">&lt;{msg.email}&gt;</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono text-text-muted bg-black/20 px-2 py-1 rounded border border-white/5 h-fit">
                            <Calendar className="w-3 h-3" />
                            {/* Formato de fecha amigable (ej: 06 Ene 2026) */}
                            {format(new Date(msg.created_at), "dd MMM yyyy, HH:mm", { locale: es })}
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-black/20 border border-white/5 text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}