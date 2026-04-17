"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, Trash2, Edit } from "lucide-react";
import { useState } from "react";
import { deleteSemestre } from "@/app/actions/semestre-actions";
import { SemestreDialog } from "./upsert-dialog"; // Ajusta la ruta según tu estructura

interface SemestreActionsProps {
  semestreId: number;
  semestreName: string;
  semestreFullData: any;
}

export default function SemestreActions({ semestreId, semestreName, semestreFullData }: SemestreActionsProps) {
  const [isPending, setIsPending] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async () => {
    // Un confirm preventivo para no borrar ciclos escolares por error
    if (!confirm(`¿Estás seguro de que quieres eliminar el semestre "${semestreName}"? Se borrarán las configuraciones asociadas.`)) return;

    setIsPending(true);
    const result = await deleteSemestre(semestreId);
    setIsPending(false);

    if (!result.success) {
      alert(result.error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" disabled={isPending}>
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">Acciones</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            className="cursor-pointer" 
            onClick={(e) => {
              e.stopPropagation(); // Evitamos el conflicto de focos que vimos antes
              setIsEditOpen(true);
            }}
          >
            <Edit className="mr-2 size-4" /> Editar
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleDelete}
            className="text-destructive focus:bg-destructive cursor-pointer"
          >
            <Trash2 className="mr-2 size-4" /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* El Dialog siempre fuera del Dropdown para que no se cierre solo */}
      <SemestreDialog 
        open={isEditOpen} 
        setOpen={setIsEditOpen} 
        semestre={semestreFullData} 
      />
    </>
  );
}