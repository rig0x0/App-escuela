"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserMinus, Loader2 } from "lucide-react";
import { desvincularAlumno } from "@/app/actions/inscripcion-actions";
import { toast } from "sonner"; // O la librería de alertas que uses

interface BotonBajaProps {
  alumnoId: number;
  grupoId: number;
  nombreAlumno: string;
}

export function BotonBaja({ alumnoId, grupoId, nombreAlumno }: BotonBajaProps) {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    const confirmar = confirm(
      `¿Estás seguro de que quieres dar de baja a ${nombreAlumno}?`
    );
    
    if (!confirmar) return;

    setIsPending(true);
    try {
      const result = await desvincularAlumno(alumnoId, grupoId);
      if (result.success) {
        toast.success("Alumno dado de baja correctamente");
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert("Ocurrió un error inesperado");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-red-500 hover:text-red-700 hover:bg-red-50"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <UserMinus className="h-4 w-4 mr-2" />
      )}
      {isPending ? "Procesando..." : "Dar de Baja"}
    </Button>
  );
}