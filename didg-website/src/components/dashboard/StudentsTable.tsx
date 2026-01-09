"use client";

import { useState } from "react";
import { Trash2, Pencil, X, Save, Loader2, KeyRound, Mail, ShieldAlert, ArrowLeft } from "lucide-react";
import { deleteStudent, updateStudent } from "@/core/actions/students";
import { useRouter } from "next/navigation";

interface Props {
  students: any[];
}

export function StudentsTable({ students }: Props) {
  const router = useRouter();
  
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [originalEmail, setOriginalEmail] = useState(""); 
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const openEditModal = (stu: any) => {
    setEditingStudent({ ...stu }); 
    setOriginalEmail(stu.email);   
    setNewPassword("");            
    setShowConfirm(false);         
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar a este estudiante? Se borrará todo su acceso.")) return;
    setIsLoading(true);
    await deleteStudent(id);
    router.refresh();
    setIsLoading(false);
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailChanged = editingStudent.email !== originalEmail;
    const passwordChanged = newPassword.trim().length > 0;

    if (emailChanged || passwordChanged) {
      setShowConfirm(true);
    } else {
      performUpdate();
    }
  };

  const performUpdate = async () => {
    if (!editingStudent) return;
    setIsLoading(true);

    const res = await updateStudent(editingStudent.id, {
        full_name: editingStudent.full_name,
        rut: editingStudent.rut,
        email: editingStudent.email,
        password: newPassword
    });

    if (res?.error) {
        alert(res.error);
        setShowConfirm(false);
    } else {
        setEditingStudent(null);
        setNewPassword("");
        setShowConfirm(false);
        router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* Contenedor Tabla: bg-surface/50 y border-text-main/10 */}
      <div className="bg-surface/50 rounded-xl border border-text-main/10 p-4 overflow-x-auto shadow-sm">
        
        <table className="w-full text-left text-sm text-text-muted">
          <thead>
            <tr className="border-b border-text-main/10">
              <th className="pb-2 pl-2 text-text-main font-bold">Nombre</th>
              <th className="pb-2 text-text-main font-bold">RUT</th>
              <th className="pb-2 text-text-main font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.map((stu) => (
              <tr key={stu.id} className="border-b border-text-main/5 last:border-0 hover:bg-text-main/5 transition-colors group">
                <td className="py-3 pl-2 text-text-main font-medium">
                    {stu.full_name}
                    <span className="block text-[10px] text-text-muted font-normal">{stu.email}</span>
                </td>
                <td className="py-3 font-mono text-text-muted">{stu.rut}</td>
                <td className="py-3">
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(stu)} className="p-2 hover:bg-blue-500/10 hover:text-blue-500 rounded transition-colors text-text-muted">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(stu.id)} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors text-text-muted">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && <div className="text-center py-8 text-text-muted italic">No hay estudiantes.</div>}
      </div>

      {/* --- MODAL DE EDICIÓN --- */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          {/* Modal Box: bg-surface */}
          <div className="bg-surface border border-text-main/10 rounded-xl p-6 w-full max-w-md shadow-2xl overflow-hidden relative">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center mb-4 border-b border-text-main/10 pb-2">
                <h3 className="text-lg font-bold text-text-main">
                    {showConfirm ? "Confirmar Seguridad" : "Editar Estudiante"}
                </h3>
                <button onClick={() => setEditingStudent(null)} className="text-text-muted hover:text-text-main">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* --- VISTA 1: FORMULARIO NORMAL --- */}
            {!showConfirm ? (
                <form onSubmit={handlePreSubmit} className="space-y-4 animate-in slide-in-from-left duration-300">
                    <div>
                        <label className="text-xs text-text-muted uppercase font-bold">Nombre Completo</label>
                        <input 
                            type="text" required value={editingStudent.full_name}
                            onChange={(e) => setEditingStudent({...editingStudent, full_name: e.target.value})}
                            // Input Adaptable
                            className="w-full bg-background/50 border border-text-main/10 rounded-lg p-2 text-text-main mt-1 focus:border-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-text-muted uppercase font-bold">RUT</label>
                        <input 
                            type="text" required value={editingStudent.rut}
                            onChange={(e) => setEditingStudent({...editingStudent, rut: e.target.value})}
                            className="w-full bg-background/50 border border-text-main/10 rounded-lg p-2 text-text-main mt-1 focus:border-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-text-muted uppercase flex items-center gap-1 font-bold">
                            <Mail className="w-3 h-3"/> Correo Electrónico
                        </label>
                        <input 
                            type="email" required value={editingStudent.email}
                            onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                            className="w-full bg-background/50 border border-text-main/10 rounded-lg p-2 text-text-main mt-1 focus:border-primary focus:outline-none"
                        />
                    </div>
                    <div className="pt-2 border-t border-text-main/5">
                        <label className="text-xs text-secondary uppercase flex items-center gap-1 font-bold">
                            <KeyRound className="w-3 h-3"/> Cambiar Contraseña
                        </label>
                        <input 
                            type="text" placeholder="Dejar vacío para mantener la actual"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-background/50 border border-text-main/10 rounded-lg p-2 text-text-main mt-1 focus:border-secondary focus:outline-none placeholder:text-text-muted/50"
                        />
                    </div>
                    <div className="flex gap-2 pt-4">
                        <button type="button" onClick={() => setEditingStudent(null)} className="flex-1 py-2 text-xs font-bold border border-text-main/10 rounded hover:bg-text-main/5 text-text-muted transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="flex-1 py-2 text-xs font-bold bg-primary text-background rounded hover:opacity-90 transition-colors flex items-center justify-center gap-2">
                            Siguiente
                        </button>
                    </div>
                </form>
            ) : (
                /* --- VISTA 2: CONFIRMACIÓN DE SEGURIDAD --- */
                <div className="space-y-4 animate-in slide-in-from-right duration-300">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex gap-3 items-start">
                        <ShieldAlert className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
                        <div>
                            <h4 className="text-sm font-bold text-yellow-500 mb-1">¡Cuidado! Cambio de Credenciales</h4>
                            <p className="text-xs text-text-muted leading-relaxed">
                                Estás modificando datos sensibles. Esto podría impedir que el alumno ingrese si no se le notifica el cambio.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2 bg-background/50 p-3 rounded border border-text-main/10 text-sm">
                        {editingStudent.email !== originalEmail && (
                            <div className="flex flex-col">
                                <span className="text-text-muted text-xs uppercase font-bold">Nuevo Correo:</span>
                                <span className="text-text-main font-mono">{editingStudent.email}</span>
                            </div>
                        )}
                        {newPassword && (
                            <div className="flex flex-col pt-2">
                                <span className="text-text-muted text-xs uppercase font-bold">Nueva Contraseña:</span>
                                <span className="text-text-main font-mono bg-text-main/5 px-2 py-1 rounded w-fit">{newPassword}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button 
                            onClick={() => setShowConfirm(false)}
                            className="flex-1 py-2 text-xs font-bold border border-text-main/10 rounded hover:bg-text-main/5 text-text-muted flex items-center justify-center gap-2 transition-colors"
                        >
                            <ArrowLeft className="w-3 h-3" /> Volver
                        </button>
                        <button 
                            onClick={performUpdate}
                            disabled={isLoading}
                            className="flex-1 py-2 text-xs font-bold bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirmar Cambios"}
                        </button>
                    </div>
                </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}