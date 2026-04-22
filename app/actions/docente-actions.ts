"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";

interface DatosCalificacion {
  inscripcionId: number;
  alumnoId: number;
  nota: number;
}

type GrupoItem = {
    id: number
    nombre: string
}

type MateriaAgrupada = {
    id: number
    nombre: string
    semestre: string
    grupos: GrupoItem[]
}

export async function getCargaAcademica(docenteId: number) {
    const asignaciones = await prisma.asignacionDocente.findMany({
        where: { docenteId },
        include: {
            materia: true,
            semestre: true,
            horarios: {
                include: {
                    grupo: true,
                },
            },
        },
    })

    const materiasAgrupadas = asignaciones.reduce<Record<number, MateriaAgrupada>>(
        (acc, curr) => {
            const materiaId = curr.materiaId

            if (!acc[materiaId]) {
                acc[materiaId] = {
                    id: curr.materia.id,
                    nombre: curr.materia.nombre,
                    semestre: curr.semestre.nombre,
                    grupos: [],
                }
            }

            curr.horarios.forEach((horario) => {
                const existe = acc[materiaId].grupos.some(
                    (g) => g.id === horario.grupo.id
                )

                if (!existe) {
                    acc[materiaId].grupos.push({
                        id: horario.grupo.id,
                        nombre: horario.grupo.nombre,
                    })
                }
            })

            return acc
        },
        {}
    )

    return Object.values(materiasAgrupadas)
}

export async function getDatosParaCalificar(grupoId: number) {
  try {
    const grupoInfo = await prisma.grupo.findUnique({
      where: { id: grupoId },
      include: {
        horarios: {
          include: {
            asignacion: { include: { materia: true, semestre: true } }
          },
          take: 1 
        }
      }
    });

    if (!grupoInfo || grupoInfo.horarios.length === 0) return null;

    const materiaId = grupoInfo.horarios[0].asignacion.materiaId;
    const semestreId = grupoInfo.horarios[0].asignacion.semestreId;

    const inscripciones = await prisma.inscripcion.findMany({
      where: { grupoId },
      include: {
        alumno: {
          include: {
            usuario: true,
            calificaciones: {
              where: {
                materiaId: materiaId,
                semestreId: semestreId
              }
            }
          }
        }
      },
      orderBy: { alumno: { usuario: { nombre: 'asc' } } }
    });

    const alumnosFormateados = inscripciones.map(ins => {
      const notas: Record<string, number | null> = {};
      const bloqueos: Record<string, boolean> = {};

      // Forzamos el cast para evitar el error 'never' que tenías antes
      const listaCalificaciones = (ins.alumno.calificaciones as any[]) || [];

      listaCalificaciones.forEach((cal) => {
        notas[cal.tipo] = cal.calificacion;
        bloqueos[cal.tipo] = true;
      });

      return {
        id: ins.id,
        alumnoId: ins.alumnoId, // 👈 ESTA ES LA PROPIEDAD QUE FALTABA
        nombre: ins.alumno.usuario.nombre,
        calificaciones: notas,
        bloqueado: bloqueos,
      };
    });

    return {
      alumnos: alumnosFormateados,
      materiaNombre: grupoInfo.horarios[0].asignacion.materia.nombre,
      materiaId: materiaId,
      semestreId: semestreId,
      grupoNombre: grupoInfo.nombre
    };
  } catch (error) {
    console.error("Error en getDatosParaCalificar:", error);
    return null;
  }
}

export async function guardarCalificacionesMasivas(
  materiaId: number,
  grupoId: number,
  semestreId: number,
  tipoEvaluacion: string,
  datos: DatosCalificacion[]
) {
  try {
    // Usamos $transaction para que sea "todo o nada"
    await prisma.$transaction(
      datos.map((d) =>
        prisma.calificacion.create({
          data: {
            alumnoId: d.alumnoId,
            materiaId: materiaId,
            grupoId: grupoId,
            semestreId: semestreId,
            calificacion: Math.round(d.nota), // Aseguramos enteros 0-100
            tipo: tipoEvaluacion,
            fecha: new Date(),
          },
        })
      )
    );

    // Refrescamos la página para que los inputs se bloqueen (ya que ahora existirán en DB)
    revalidatePath(`/docente/calificaciones/${grupoId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error al guardar calificaciones:", error);
    return { success: false, error: "No se pudieron guardar las calificaciones. Revisa si ya fueron capturadas." };
  }
}