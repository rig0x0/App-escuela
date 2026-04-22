"use client"

import React, { useState } from "react";
import { generarBloquesHorarios, HORARIO_CONFIG } from "@/lib/horario-utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AsignarHorarioModal } from "./asignar-horario-modal";

interface GridHorarioProps {
  grupoId: number;
  horariosExistentes: any[]; // Aquí llegarán las materias ya guardadas
}

export function GridHorario({ grupoId, horariosExistentes }: GridHorarioProps) {
  const bloques = generarBloquesHorarios();

  // Definimos el layout: 70px para la hora y el resto dividido equitativamente
  const gridLayout = "grid grid-cols-[70px_1fr_1fr_1fr_1fr_1fr]";

  // ESTADOS PARA EL MODAL
  const [modalOpen, setModalOpen] = useState(false);
  const [seleccion, setSeleccion] = useState<{ dia: string; hora: string } | null>(null);

  const handleOpenModal = (dia: string, hora: string) => {
    setSeleccion({ dia, hora });
    setModalOpen(true);
  };

  return (
    <>
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden min-w-[800px]">
        {/* ENCABEZADO */}
        <div className={`${gridLayout} bg-muted/50 border-b`}>
          <div className="p-3 text-center text-[10px] font-bold uppercase text-muted-foreground border-r flex items-center justify-center">
            Hora
          </div>
          {HORARIO_CONFIG.diasLaborales.map(dia => (
            <div key={dia} className="p-3 text-center text-xs font-bold uppercase text-muted-foreground border-r last:border-r-0">
              {dia}
            </div>
          ))}
        </div>

        {/* CUERPO DEL HORARIO */}
        <div className={gridLayout}>
          {bloques.map((bloque) => (
            <React.Fragment key={bloque.inicio}>
              {bloque.tipo === 'receso' ? (
                <>
                  {/* Fila de Receso */}
                  <div className="p-3 text-center text-xs font-mono bg-yellow-500/10 border-b border-r text-yellow-700 dark:text-yellow-500 font-bold flex items-center justify-center">
                    {bloque.inicio}
                  </div>
                  <div className="col-span-5 bg-yellow-500/5 border-b flex items-center justify-center text-[10px] font-black uppercase tracking-[0.3em] text-yellow-600/70 dark:text-yellow-500/50">
                    — {bloque.etiqueta} —
                  </div>
                </>
              ) : (
                <>
                  {/* Fila de Clase Normal */}
                  <div className="p-4 text-center text-xs font-semibold bg-muted/20 border-b border-r flex items-center justify-center text-muted-foreground">
                    {bloque.inicio}
                  </div>
                  
                  {HORARIO_CONFIG.diasLaborales.map(dia => {
                    // Buscamos si este bloque ya tiene una materia asignada
                    const claseExistente = horariosExistentes.find(
                        (h) => h.diaSemana === dia && h.horaInicio === bloque.inicio
                    );

                    return (
                      <div 
                        key={`${dia}-${bloque.inicio}`} 
                        className="group relative min-h-[100px] border-b border-r last:border-r-0 hover:bg-primary/5 transition-colors p-2"
                      >
                        {claseExistente ? (
                          <div className="h-full w-full bg-primary/10 rounded-lg p-2 text-xs border border-primary/20 flex flex-col justify-center">
                            <span className="font-bold text-primary truncate">
                                {claseExistente.asignacion.materia.nombre}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate">
                                {claseExistente.asignacion.docente.usuario.nombre}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-2 text-end">
                                {claseExistente.aula}
                            </span>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            className="absolute inset-2 opacity-0 group-hover:opacity-100 transition-opacity border-2 border-dashed border-primary/30 text-primary flex flex-col gap-1 h-auto"
                            onClick={() => handleOpenModal(dia, bloque.inicio)}
                          >
                            <Plus className="h-4 w-4" />
                            <span className="text-[10px] font-bold">ASIGNAR</span>
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* MODAL DE ASIGNACIÓN */}
      {seleccion && (
        <AsignarHorarioModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          dia={seleccion.dia}
          hora={seleccion.hora}
          grupoId={grupoId}
        />
      )}
    </>
  );
}