"use client"

import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { eliminarHorarioGrupo } from "@/app/actions/horarios-actions";
import { useState } from "react";

export function DeleteHorarioButton({ grupoId }: { grupoId: number }) {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    // 1. Confirmación nativa (igual que en usuarios)
    if (!confirm("¿Estás seguro de que quieres eliminar TODO el horario de este grupo?")) {
      return;
    }

    setIsPending(true);
    
    // 2. Ejecutamos la acción
    const result = await eliminarHorarioGrupo(grupoId);
    
    setIsPending(false);

    // 3. Manejo de error con alert nativo
    if (result?.error) {
      alert(result.error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={handleDelete}
      disabled={isPending}
      title="Eliminar horario completo"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}