"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * INSCRIPCIÓN INDIVIDUAL (Para altas tardías)
 */
export async function inscribirAlumno(alumnoId: number, grupoId: number) {
  try {
    // El @@unique en tu esquema ya protege esto, pero validamos para dar un mensaje claro
    const existe = await prisma.inscripcion.findUnique({
      where: {
        alumnoId_grupoId: { alumnoId, grupoId }
      }
    });

    if (existe) return { success: false, error: "El alumno ya pertenece a este grupo." };

    await prisma.inscripcion.create({
      data: { alumnoId, grupoId }
    });

    revalidatePath("/grupos"); 
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo realizar la inscripción." };
  }
}

/**
 * SORTEO / ASIGNACIÓN MASIVA
 * Reparte alumnos de un grado específico en los grupos de un semestre académico
 */
export async function autoAsignarAlumnos(semestreId: number, gradoEscolar: string) {
  try {
    // 1. Obtener grupos del semestre actual
    const grupos = await prisma.grupo.findMany({
      where: { semestreId }
    });

    if (grupos.length === 0) return { success: false, error: "No hay grupos en este semestre." };

    // 2. Obtener alumnos del "grado" (semestre escolar) que no tengan grupo en ESTE semestre académico
    const alumnosParaAsignar = await prisma.alumno.findMany({
      where: {
        grado: gradoEscolar,
        inscripciones: {
          none: {
            grupo: { semestreId }
          }
        }
      }
    });

    if (alumnosParaAsignar.length === 0) 
      return { success: false, error: `No hay alumnos de ${gradoEscolar} pendientes de asignar.` };

    // 3. Algoritmo de reparto equitativo
    // Mezclamos el array de alumnos al azar
    const sorteados = alumnosParaAsignar.sort(() => Math.random() - 0.5);
    
    // Creamos las inscripciones en lote
    const operaciones = sorteados.map((alumno, index) => {
      const grupoDestino = grupos[index % grupos.length];
      return prisma.inscripcion.create({
        data: {
          alumnoId: alumno.usuarioId, // Usamos usuarioId como indica tu relación
          grupoId: grupoDestino.id
        }
      });
    });

    await Promise.all(operaciones);
    
    revalidatePath("/semestres");
    return { success: true, count: sorteados.length };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Fallo la asignación masiva." };
  }
}

/**
 * BAJA DEL GRUPO (Desvincular)
 */
export async function desvincularAlumno(alumnoId: number, grupoId: number) {
  try {
    await prisma.inscripcion.delete({
      where: {
        alumnoId_grupoId: { alumnoId, grupoId }
      }
    });
    revalidatePath("/grupos");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al retirar al alumno del grupo." };
  }
}

export async function getAlumnosDisponibles(
  grado: string, 
  semestreAcademicoId: number,
  page: number = 1, // Nueva prop
  limit: number = 5  // Nueva prop
) {
  try {
    const skip = (page - 1) * limit;

    const alumnos = await prisma.alumno.findMany({
      where: {
        grado: grado,
        // Alumnos que NO están inscritos en el semestre actual
        inscripciones: {
          none: {
            grupo: {
              semestreId: semestreAcademicoId
            }
          }
        }
      },
      include: {
        usuario: { select: { nombre: true, email: true } }
      },
      skip: skip,
      take: limit,
    });

    return { success: true, alumnos };
  } catch (error) {
    return { success: false, error: "Error al obtener alumnos" };
  }
}

export async function getInscripcionesByGrupo({
  grupoId,
  query = '',
  page = 1,
  limit = 5
}: {
  grupoId: number;
  query?: string;
  page?: number;
  limit?: number;
}) {
  const skip = (page - 1) * limit;

  try {
    const [inscripciones, total, grupoInfo] = await Promise.all([
      prisma.inscripcion.findMany({
        where: {
          grupoId: grupoId,
          alumno: {
            usuario: {
              OR: [
                { nombre: { contains: query } },
                { email: { contains: query } }
              ]
            }
          }
        },
        include: {
          alumno: {
            include: { usuario: true }
          }
        },
        skip,
        take: limit,
      }),
      prisma.inscripcion.count({
        where: {
          grupoId: grupoId,
          alumno: {
            usuario: {
              OR: [
                { nombre: { contains: query } },
                { email: { contains: query } }
              ]
            }
          }
        }
      }),
      prisma.grupo.findUnique({ 
        where: { id: grupoId },
        select: { nombre: true, semestreId: true } 
      })
    ]);

    return {
      inscripciones,
      total,
      grupoNombre: grupoInfo?.nombre || "Grupo no encontrado",
      semestreId: grupoInfo?.semestreId,
      totalPages: Math.ceil(total / limit),
      error: null
    };
  } catch (error) {
    return { error: "Error al cargar alumnos", inscripciones: [], total: 0, totalPages: 1 };
  }
}