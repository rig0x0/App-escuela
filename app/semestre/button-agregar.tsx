"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SemestreDialog } from "./upsert-dialog";

export function SemestreDialogWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <Plus className="size-4" />
        Agregar Semestre
      </Button>

      {/* Al no pasar la prop 'semestre', el componente abre en modo creación */}
      <SemestreDialog 
        open={isOpen} 
        setOpen={setIsOpen} 
        semestre={null} 
      />
    </>
  );
}