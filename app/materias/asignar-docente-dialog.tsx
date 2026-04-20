"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";
import { ComboboxDocentes } from "@/app/materias/combobox-docentes"; // Este es el nuevo componente que creamos
import { ComboboxSemestre } from "@/app/grupos/inscripciones/[id]/semestres-combobox"; // Reutilizamos el que ya tienes
import { asignarMateriaADocente } from "@/app/actions/materias-actions";
import { toast } from "sonner";

export function AsignarDocenteDialog({ materiaId }: { materiaId: number }) {
  const [docenteId, setDocenteId] = useState<string>("");
  const [semestreId, setSemestreId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAsignar = async () => {
    if (!docenteId || !semestreId) {
      return toast.error("Por favor selecciona docente y semestre");
    }
    
    setLoading(true);
    const res = await asignarMateriaADocente({
      materiaId,
      docenteId: Number(docenteId),
      semestreId: Number(semestreId)
    });
    setLoading(false);

    if (res.success) {
      toast.success("Asignación exitosa");
      setOpen(false);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-xs border-dashed border-primary/50 text-primary hover:bg-primary/5">
          <UserPlus className="mr-2 h-3 w-3" />
          Asignar Responsable
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Vincular Docente a Materia</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">¿Quién impartirá la materia?</label>
            <ComboboxDocentes onSelect={setDocenteId} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">¿En qué ciclo escolar?</label>
            <ComboboxSemestre onSelect={setSemestreId} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleAsignar} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Asignación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}