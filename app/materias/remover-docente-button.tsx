"use client"

import { UserRoundMinus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { removerAsignacionDocente } from "../actions/materias-actions"; // Necesitaremos esta acción
import { toast } from "sonner";

export function RemoverDocenteButton({ asignacionId }: { asignacionId: number }) {
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    if (!confirm("¿Estás seguro de remover a este docente de la materia?")) return;

    setLoading(true);
    const res = await removerAsignacionDocente(asignacionId);
    setLoading(false);

    if (res.success) {
      toast.success("Responsable removido");
    } else {
      toast.error(res.error || "No se pudo remover");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
      onClick={handleRemove}
      disabled={loading}
      title="Remover responsable"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <UserRoundMinus className="h-4 w-4" />
      )}
    </Button>
  );
}