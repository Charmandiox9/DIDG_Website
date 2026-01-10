"use client";

import { useState } from "react";
import { X, Send, Loader2, MessageSquarePlus, AlertTriangle } from "lucide-react";
import { submitFeedback } from "@/core/actions/feedback";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'request' | 'report';
  resourceTitle?: string;
  subjectName?: string;
}

export function FeedbackModal({ isOpen, onClose, type, resourceTitle, subjectName }: Props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    await submitFeedback({ type, message, resourceTitle, subjectName });
    setLoading(false);
    setSent(true);
    
    setTimeout(() => {
      setSent(false);
      setMessage("");
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-surface border border-text-main/10 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={`p-4 flex justify-between items-center border-b border-text-main/10 ${type === 'report' ? 'bg-red-500/10' : 'bg-primary/10'}`}>
          <div className="flex items-center gap-2">
            {type === 'report' ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <MessageSquarePlus className="w-5 h-5 text-primary" />}
            <h3 className="font-bold text-text-main">
              {type === 'report' ? 'Reportar Problema' : 'Solicitar Contenido'}
            </h3>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-main">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 bg-background">
          {sent ? (
            <div className="text-center py-8 text-emerald-500 animate-in fade-in">
              <p className="font-bold text-lg">¡Mensaje Enviado!</p>
              <p className="text-sm text-text-muted mt-2">Gracias por ayudarnos a mejorar.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {resourceTitle && (
                <div className="text-xs font-mono p-2 bg-surface rounded border border-text-main/10 text-text-muted">
                  <span className="font-bold text-red-400">Reportando:</span> {resourceTitle}
                </div>
              )}
              
              <div>
                <label className="text-sm font-bold text-text-main mb-2 block">
                  {type === 'report' ? '¿Qué está fallando?' : '¿Qué tema te gustaría ver?'}
                </label>
                <textarea
                  autoFocus
                  className="w-full h-32 bg-surface/50 border border-text-main/10 rounded-lg p-3 text-text-main focus:border-primary/50 outline-none resize-none placeholder:text-text-muted/50"
                  placeholder={type === 'report' ? "El link está caído, el video no carga..." : "Árboles Binarios, Grafos, Docker..."}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-text-muted hover:text-text-main transition-colors">
                  Cancelar
                </button>
                <button 
                  disabled={loading || !message.trim()}
                  className={`px-4 py-2 rounded text-sm font-bold flex items-center gap-2 text-background transition-all ${
                    type === 'report' 
                    ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.4)]' 
                    : 'bg-primary hover:bg-primary/90 shadow-[0_0_10px_var(--primary-glow)]'
                  } disabled:opacity-50 disabled:shadow-none`}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Enviar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}