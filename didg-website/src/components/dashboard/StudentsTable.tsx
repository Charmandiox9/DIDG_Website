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
  
  // Estado del estudiante en edición
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  
  // Para comparar si el email cambió
  const [originalEmail, setOriginalEmail] = useState(""); 
  
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ESTADO NUEVO: Controla si mostramos la advertencia de seguridad
  const [showConfirm, setShowConfirm] = useState(false);

  // --- ABRIR MODAL ---
  const openEditModal = (stu: any) => {
    setEditingStudent({ ...stu }); // Copia editable
    setOriginalEmail(stu.email);   // Guardamos el original para comparar
    setNewPassword("");            // Limpiamos password
    setShowConfirm(false);         // Reseteamos confirmación
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar a este estudiante? Se borrará todo su acceso.")) return;
    setIsLoading(true);
    await deleteStudent(id);
    router.refresh();
    setIsLoading(false);
  };

  // --- PASO 1: PRE-VALIDACIÓN ---
  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verificamos si hay cambios sensibles
    const emailChanged = editingStudent.email !== originalEmail;
    const passwordChanged = newPassword.trim().length > 0;

    // Si cambió email o password, mostramos la pantalla de confirmación
    if (emailChanged || passwordChanged) {
      setShowConfirm(true);
    } else {
      // Si solo cambió el nombre o RUT, guardamos directo
      performUpdate();
    }
  };

  // --- PASO 2: ACTUALIZACIÓN REAL ---
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
        // Si falla, volvemos a la vista de edición para que corrija
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
      <div className="bg-surface/30 rounded-xl border border-white/10 p-4 overflow-x-auto">
        {/* ... (LA TABLA SE MANTIENE EXACTAMENTE IGUAL QUE ANTES) ... */}
        <table className="w-full text-left text-sm text-text-muted">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-2 pl-2">Nombre</th>
              <th className="pb-2">RUT</th>
              <th className="pb-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.map((stu) => (
              <tr key={stu.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                <td className="py-3 pl-2 text-white font-medium">
                    {stu.full_name}
                    <span className="block text-[10px] text-text-muted font-normal">{stu.email}</span>
                </td>
                <td className="py-3 font-mono">{stu.rut}</td>
                <td className="py-3">
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(stu)} className="p-2 hover:bg-blue-500/20 hover:text-blue-400 rounded transition-colors text-text-muted">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(stu.id)} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors text-text-muted">
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
          <div className="bg-surface border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl overflow-hidden relative">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                <h3 className="text-lg font-bold text-white">
                    {showConfirm ? "Confirmar Seguridad" : "Editar Estudiante"}
                </h3>
                <button onClick={() => setEditingStudent(null)} className="text-text-muted hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* --- VISTA 1: FORMULARIO NORMAL --- */}
            {!showConfirm ? (
                <form onSubmit={handlePreSubmit} className="space-y-4 animate-in slide-in-from-left duration-300">
                    <div>
                        <label className="text-xs text-text-muted uppercase">Nombre Completo</label>
                        <input 
                            type="text" required value={editingStudent.full_name}
                            onChange={(e) => setEditingStudent({...editingStudent, full_name: e.target.value})}
                            className="w-full bg-black/20 border border-white/10 rounded p-2 text-white mt-1 focus:border-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-text-muted uppercase">RUT</label>
                        <input 
                            type="text" required value={editingStudent.rut}
                            onChange={(e) => setEditingStudent({...editingStudent, rut: e.target.value})}
                            className="w-full bg-black/20 border border-white/10 rounded p-2 text-white mt-1 focus:border-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-text-muted uppercase flex items-center gap-1">
                            <Mail className="w-3 h-3"/> Correo Electrónico
                        </label>
                        <input 
                            type="email" required value={editingStudent.email}
                            onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                            className="w-full bg-black/20 border border-white/10 rounded p-2 text-white mt-1 focus:border-primary focus:outline-none"
                        />
                    </div>
                    <div className="pt-2 border-t border-white/5">
                        <label className="text-xs text-secondary uppercase flex items-center gap-1 font-bold">
                            <KeyRound className="w-3 h-3"/> Cambiar Contraseña
                        </label>
                        <input 
                            type="text" placeholder="Dejar vacío para mantener la actual"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded p-2 text-white mt-1 focus:border-secondary focus:outline-none placeholder:text-text-muted/30"
                        />
                    </div>
                    <div className="flex gap-2 pt-4">
                        <button type="button" onClick={() => setEditingStudent(null)} className="flex-1 py-2 text-xs font-bold border border-white/10 rounded hover:bg-white/5 text-text-muted">
                            Cancelar
                        </button>
                        <button type="submit" className="flex-1 py-2 text-xs font-bold bg-primary text-background rounded hover:bg-white transition-colors flex items-center justify-center gap-2">
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

                    <div className="space-y-2 bg-black/20 p-3 rounded border border-white/5 text-sm">
                        {editingStudent.email !== originalEmail && (
                            <div className="flex flex-col">
                                <span className="text-text-muted text-xs uppercase">Nuevo Correo:</span>
                                <span className="text-white font-mono">{editingStudent.email}</span>
                            </div>
                        )}
                        {newPassword && (
                            <div className="flex flex-col pt-2">
                                <span className="text-text-muted text-xs uppercase">Nueva Contraseña:</span>
                                <span className="text-white font-mono bg-white/5 px-2 py-1 rounded w-fit">{newPassword}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button 
                            onClick={() => setShowConfirm(false)}
                            className="flex-1 py-2 text-xs font-bold border border-white/10 rounded hover:bg-white/5 text-text-muted flex items-center justify-center gap-2"
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