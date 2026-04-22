"use client"

import { useState, useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertCircle, Save, Lock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { guardarCalificacionesMasivas } from "@/app/actions/docente-actions";

// Tipos de evaluaciones
const EVALUACIONES = [
  { id: "P1", label: "1er Parcial" },
  { id: "P2", label: "2do Parcial" },
  { id: "P3", label: "3er Parcial" },
  { id: "EXT", label: "Extraordinario" },
];

interface AlumnoCalificar {
  id: number;       // ID de la inscripción
  alumnoId: number; // usuarioId del Alumno
  nombre: string;
  calificaciones: Record<string, number | null>;
  bloqueado: Record<string, boolean>;
}

// 1. Agregamos los IDs faltantes a las Props
interface TableCalificarProps {
  initialAlumnos: AlumnoCalificar[];
  grupoNombre: string;
  materiaId: number;
  grupoId: number;
  semestreId: number;
}

export default function TableCalificar({ 
  initialAlumnos, 
  grupoNombre,
  materiaId,
  grupoId,
  semestreId 
}: TableCalificarProps) {
  const [alumnos, setAlumnos] = useState(initialAlumnos);
  const [evaluacionActiva, setEvaluacionActiva] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleScoreChange = (inscripcionId: number, evaluacionId: string, value: string) => {
    const score = value === "" ? null : parseInt(value);
    if (score !== null && (isNaN(score) || score < 0 || score > 100)) return;

    setAlumnos(prev => prev.map(al =>
      al.id === inscripcionId
        ? { ...al, calificaciones: { ...al.calificaciones, [evaluacionId]: score } }
        : al
    ));
  };

  const handleGuardar = async () => {
    if (!evaluacionActiva) return;

    const incompletos = alumnos.some(al => al.calificaciones[evaluacionActiva] === null);
    if (incompletos) {
      toast.error("Faltan alumnos por calificar en esta evaluación");
      return;
    }

    const confirmar = confirm(`¿Estás seguro? Al guardar el ${evaluacionActiva} las notas se bloquearán.`);
    if (!confirmar) return;

    startTransition(async () => {
      // 2. Preparamos los datos usando las props
      const datosEnvio = alumnos.map(al => ({
        inscripcionId: al.id,
        alumnoId: al.alumnoId,
        nota: al.calificaciones[evaluacionActiva] as number
      }));

      const resultado = await guardarCalificacionesMasivas(
        materiaId,
        grupoId,
        semestreId,
        evaluacionActiva,
        datosEnvio
      );

      if (resultado.success) {
        toast.success("¡Calificaciones guardadas exitosamente!");
        setEvaluacionActiva(null);
        // Nota: El revalidatePath en la action hará que se bloqueen los inputs automáticamente
      } else {
        toast.error(resultado.error || "Error al guardar");
      }
    });
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-muted/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Modo de Calificación</AlertTitle>
            <AlertDescription className="text-blue-700">
              Selecciona una columna para habilitar la edición.
            </AlertDescription>
          </Alert>
          
          {evaluacionActiva && (
            <Button 
              onClick={handleGuardar} 
              disabled={isPending} 
              className="gap-2 bg-green-600 hover:bg-green-700 text-white transition-all shadow-md"
            >
              {isPending ? "Guardando..." : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar {evaluacionActiva}
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-2"> {/* Quitamos padding para que la tabla llegue a los bordes */}
        <div className="max-h-[600px] overflow-y-auto relative border-t">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-20 shadow-sm">
              <TableRow>
                <TableHead className="w-[350px] bg-white font-bold">Nombre del Estudiante</TableHead>
                {EVALUACIONES.map((ev) => (
                  <TableHead
                    key={ev.id}
                    className={`text-center cursor-pointer transition-all ${
                      evaluacionActiva === ev.id 
                        ? 'bg-primary text-primary-foreground font-bold' 
                        : 'hover:bg-muted font-semibold'
                    }`}
                    onClick={() => !isPending && setEvaluacionActiva(ev.id)}
                  >
                    {ev.label}
                    {evaluacionActiva === ev.id && <span className="block text-[10px] animate-pulse">Editando</span>}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {alumnos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No hay alumnos inscritos en este grupo.
                  </TableCell>
                </TableRow>
              ) : (
                alumnos.map((alumno, index) => (
                  <TableRow key={alumno.id} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                    <TableCell className="font-medium">{alumno.nombre}</TableCell>
                    {EVALUACIONES.map((ev) => {
                      const esEditable = evaluacionActiva === ev.id && !alumno.bloqueado[ev.id];
                      const estaBloqueado = alumno.bloqueado[ev.id];

                      return (
                        <TableCell key={ev.id} className="text-center">
                          <div className="flex justify-center items-center">
                            {estaBloqueado ? (
                              <div className="flex items-center gap-1.5 text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-md">
                                {alumno.calificaciones[ev.id]} 
                                <Lock className="w-3.5 h-3.5" />
                              </div>
                            ) : (
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="--"
                                className={`w-20 text-center font-bold ${
                                  esEditable 
                                    ? 'border-primary ring-2 ring-primary/20 shadow-sm' 
                                    : 'bg-muted/40 opacity-40 grayscale cursor-not-allowed'
                                }`}
                                disabled={!esEditable}
                                value={alumno.calificaciones[ev.id] ?? ""}
                                onChange={(e) => handleScoreChange(alumno.id, ev.id, e.target.value)}
                              />
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}