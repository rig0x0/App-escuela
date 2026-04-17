"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GrupoDialog } from "./upsert-dialog"; // Ajusta la ruta

interface Props {
  semestres: { id: number; nombre: string }[];
}

export function GrupoDialogWrapper({ semestres }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <Plus className="size-4" />
        Agregar Grupo
      </Button>

      <GrupoDialog 
        open={isOpen} 
        setOpen={setIsOpen} 
        grupo={null} 
        semestres={semestres}
      />
    </>
  );
}