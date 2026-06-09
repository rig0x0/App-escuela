"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ComboAsignacion } from "@/components/horarios/combobox-asigacion"; 
import { getAsignacionesDisponibles } from "@/app/actions/horarios-actions";
import { createHorario } from "@/app/actions/horarios-actions";
import { toast } from "sonner"; 

interface AsignarHorarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  dia: string;
  hora: string;
  grupoId: number;
  semestreId?: number; // 👈 1. El "?" lo vuelve opcional. Ya no marcará error en el padre.
}

export function AsignarHorarioModal({ isOpen, onClose, dia, hora, grupoId, semestreId }: AsignarHorarioModalProps) {
  const [loading, setLoading] = useState(false);
  const [asignaciones, setAsignaciones] = useState<{ id: number; label: string }[]>([]);
  const [asignacionId, setAsignacionId] = useState("");

  // Cargar las materias disponibles cuando se abre el modal
  useEffect(() => {
    // 2. Protegemos la función: Solo se ejecuta si el modal está abierto Y si existe el semestreId
    if (isOpen && semestreId) {
      getAsignacionesDisponibles(semestreId).then(setAsignaciones);
    }
  }, [isOpen, semestreId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const aula = formData.get("aula") as string;

    if (!asignacionId) {
      toast.error("Por favor, selecciona una materia");
      return;
    }

    setLoading(true);

    try {
      const result = await createHorario({
        diaSemana: dia,
        horaInicio: hora,
        aula: aula,
        grupoId: grupoId,
        asignacionId: Number(asignacionId),
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("¡Clase asignada correctamente!");
        onClose(); 
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-primary">Asignar Materia</DialogTitle>
          <DialogDescription>
            Configurando clase para el <span className="font-bold">{dia}</span> a las <span className="font-bold">{hora}</span>.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label>Materia / Docente</Label>
            <ComboAsignacion 
              options={asignaciones} 
              value={asignacionId} 
              onChange={setAsignacionId} 
            />
          </div>

          <div className="space-y-2">
            <Label>Aula / Salón</Label>
            <Input name="aula" placeholder="Ej: Laboratorio B, Aula 10..." required />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading || !asignacionId}>
              {loading ? "Registrando..." : "Guardar Clase"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}