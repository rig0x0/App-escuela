"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, Trash2, Edit, BetweenHorizontalStart, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteSemestre } from "@/app/actions/semestre-actions";
import { autoAsignarAlumnos } from "@/app/actions/inscripcion-actions"; // Importamos la acción de sorteo
import { SemestreDialog } from "./upsert-dialog";
import { toast } from "sonner"; // Recomendado para notificaciones fluidas

interface SemestreActionsProps {
  semestreId: number;
  semestreName: string;
  semestreFullData: any;
}

export default function SemestreActions({ semestreId, semestreName, semestreFullData }: SemestreActionsProps) {
  const [isPending, setIsPending] = useState(false);
  const [isAutoAssigning, setIsAutoAssigning] = useState(false); // Estado separado para el sorteo
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Lógica del Sorteo Masivo
  const handleAutoAssign = async () => {
    // Usamos el id convertido a string ya que es lo que espera tu lógica de 'grado'
    const gradoEscolar = semestreId.toString();

    if (!confirm(`¿Deseas iniciar la asignación automática para el ciclo ${semestreName}? Los alumnos sin grupo se repartirán equitativamente.`)) {
      return;
    }

    setIsAutoAssigning(true);
    try {
      const result = await autoAsignarAlumnos(semestreId, gradoEscolar);
      
      if (result.success) {
        alert(`¡Éxito! Se han asignado ${result.count} alumnos correctamente.`);
        // Si usas sonner: toast.success(`Asignados ${result.count} alumnos`)
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert("Error crítico en el proceso de asignación.");
    } finally {
      setIsAutoAssigning(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${semestreName}"?`)) return;

    setIsPending(true);
    const result = await deleteSemestre(semestreId);
    setIsPending(false);

    if (!result.success) alert(result.error);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" disabled={isPending || isAutoAssigning}>
            {isAutoAssigning ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <MoreHorizontalIcon className="size-4" />
            )}
            <span className="sr-only">Acciones</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            className="cursor-pointer" 
            onClick={handleAutoAssign}
            disabled={isAutoAssigning}
          >
            {isAutoAssigning ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <BetweenHorizontalStart className="mr-2 size-4"/>
            )}
            Auto-Asig
          </DropdownMenuItem>

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

      <SemestreDialog 
        open={isEditOpen} 
        setOpen={setIsEditOpen} 
        semestre={semestreFullData} 
      />
    </>
  );
}