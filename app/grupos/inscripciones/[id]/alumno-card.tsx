"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { inscribirAlumno } from "@/app/actions/inscripcion-actions";
import { toast } from "sonner"; // O tu librería de notificaciones

export default function AlumnoCard({ alumno, grupoId }: { alumno: any; grupoId: number }) {
  const [asignado, setAsignado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAsignar = async () => {
    setLoading(true);
    const res = await inscribirAlumno(alumno.usuarioId, grupoId);
    if (res.success) {
      setAsignado(true);
      toast.success("Alumno asignado correctamente");
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  };

  return (
    <Card className={`py-3 px-4 transition-colors ${asignado ? "bg-muted/50" : ""}`}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-sm">{alumno.usuario.nombre}</h1>
          <p className="text-xs text-muted-foreground">{alumno.usuario.email}</p>
        </div>
        <Button 
          variant={asignado ? "ghost" : "outline"} 
          size="sm" 
          disabled={asignado || loading}
          onClick={handleAsignar}
        >
          {asignado ? <Check className="h-4 w-4 text-green-600" /> : <Plus className="h-4 w-4 mr-1" />}
          {asignado ? "Asignado" : "Asignar"}
        </Button>
      </div>
    </Card>
  );
}