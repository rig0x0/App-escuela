"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MateriaDialog } from "@/app/materias/cu-dialog-materias"; // Ajusta la ruta

export function MateriaDialogWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <Plus className="size-4" />
        Agregar Materia
      </Button>

      {/* Al no pasar la prop 'materia', el componente abre en modo creación */}
      <MateriaDialog 
        open={isOpen} 
        setOpen={setIsOpen} 
        materia={null} 
      />
    </>
  );
}