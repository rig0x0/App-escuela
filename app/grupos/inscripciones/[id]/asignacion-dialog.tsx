"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FieldGroup, Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { ComboboxSemestre } from "./semestres-combobox";
import AlumnoCard from "./alumno-card";
import { getAlumnosDisponibles } from "@/app/actions/inscripcion-actions";
import { Loader2 } from "lucide-react";

interface Props {
  grupoId: number;
  semestreAcademicoId: number;
}

export default function AsignacionDialog({ grupoId, semestreAcademicoId }: Props) {
  const [gradoSeleccionado, setGradoSeleccionado] = useState<string | null>(null);
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Referencia para detectar el último elemento
  const observer = useRef<IntersectionObserver | null>(null);
  
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Resetear todo cuando cambia el grado
  useEffect(() => {
    setAlumnos([]);
    setPage(1);
    setHasMore(true);
  }, [gradoSeleccionado]);

  // Cargar alumnos (Efecto principal)
  useEffect(() => {
    async function cargarAlumnos() {
      if (!gradoSeleccionado) return;
      
      setLoading(true);
      const res = await getAlumnosDisponibles(gradoSeleccionado, semestreAcademicoId, page, 5);
      
      if (res.success && res.alumnos) {
        // Si vienen menos de 5, significa que ya no hay más
        if (res.alumnos.length < 5) setHasMore(false);
        
        // Mantenemos los anteriores y agregamos los nuevos
        setAlumnos(prev => [...prev, ...res.alumnos]);
      } else {
        setHasMore(false);
      }
      setLoading(false);
    }
    cargarAlumnos();
  }, [gradoSeleccionado, page, semestreAcademicoId]);

  return (
    <Dialog onOpenChange={(open) => !open && setGradoSeleccionado(null)}>
      <DialogTrigger asChild>
        <Button>Asignar Alumnos</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md h-[550px] flex flex-col p-0"> {/* Altura fija para controlar el scroll */}
        <div className="p-6 pb-2">
          <DialogHeader>
            <DialogTitle>Asignación de Alumnos</DialogTitle>
            <DialogDescription>
              Selecciona el grado para ver alumnos disponibles.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="mt-4">
            <Field>
              <Label>¿De qué grado/semestre quieres traer alumnos?</Label>
              <ComboboxSemestre onSelect={(valor) => setGradoSeleccionado(valor)} />
            </Field>
          </FieldGroup>
        </div>

        <div className="flex-1 overflow-y-auto px-6 space-y-3 pb-4">
          {gradoSeleccionado && (
            <>
              <div className="flex justify-between items-center sticky top-0 bg-background z-10 py-2 border-b mb-2">
                <h2 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Resultados ({alumnos.length})
                </h2>
              </div>

              {alumnos.map((alumno, index) => {
                // Si es el último elemento de la lista actual, le ponemos la referencia
                if (alumnos.length === index + 1) {
                  return (
                    <div ref={lastElementRef} key={alumno.usuarioId}>
                      <AlumnoCard alumno={alumno} grupoId={grupoId} />
                    </div>
                  );
                } else {
                  return <AlumnoCard key={alumno.usuarioId} alumno={alumno} grupoId={grupoId} />;
                }
              })}

              {loading && (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              {!loading && alumnos.length === 0 && (
                <p className="text-center py-10 text-sm text-muted-foreground">
                  Sin alumnos pendientes en este grado.
                </p>
              )}
            </>
          )}
        </div>

        <div className="p-6 pt-2 border-t bg-muted/5">
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="w-full">Cerrar</Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}