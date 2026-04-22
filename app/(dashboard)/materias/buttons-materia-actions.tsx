"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, Trash2, Edit } from "lucide-react";
import { useState } from "react";
import { deleteMateria } from "@/app/actions/materias-actions";
import { MateriaDialog } from "@/app/(dashboard)/materias/cu-dialog-materias"; // Ajusta la ruta

interface MateriaActionsProps {
  materiaId: number;
  materiaName: string;
  materiaFullData: any;
}

export default function MateriaActions({ materiaId, materiaName, materiaFullData }: MateriaActionsProps) {
  const [isPending, setIsPending] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la materia "${materiaName}"?`)) return;

    setIsPending(true);
    const result = await deleteMateria(materiaId);
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
              e.stopPropagation(); // Evita que el evento suba al dropdown
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

      {/* Modal de edición */}
      <MateriaDialog
        open={isEditOpen}
        setOpen={setIsEditOpen}
        materia={materiaFullData}
      />
    </>
  );
}