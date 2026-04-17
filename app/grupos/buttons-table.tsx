"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, Trash2, Edit } from "lucide-react";
import { useState } from "react";
import { deleteGrupo } from "@/app/actions/grupos-actions";
import { GrupoDialog } from "./upsert-dialog"; // Ajusta la ruta

interface GrupoActionsProps {
  grupoId: number;
  grupoName: string;
  grupoFullData: any;
  semestres: { id: number; nombre: string }[]; // Necesario para el modal de edición
}

export default function GrupoActions({ 
  grupoId, 
  grupoName, 
  grupoFullData, 
  semestres 
}: GrupoActionsProps) {
  const [isPending, setIsPending] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el grupo "${grupoName}"? Esta acción no se puede deshacer.`)) return;

    setIsPending(true);
    const result = await deleteGrupo(grupoId);
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
              e.stopPropagation(); 
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

      {/* Importante: Pasar la prop 'semestres' para que el Select del modal funcione */}
      <GrupoDialog 
        open={isEditOpen} 
        setOpen={setIsEditOpen} 
        grupo={grupoFullData}
        semestres={semestres}
      />
    </>
  );
}