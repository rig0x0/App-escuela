"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { materiaSchema } from "@/lib/validations/materias"

/**
 * CREAR MATERIA
 */
export async function createMateria(data: any) {
  try {
    // 1. Validar con Zod en el servidor
    const validation = materiaSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: "Datos de materia inválidos." };
    }

    const { nombre, descripcion } = validation.data;

    // 2. Crear en la base de datos
    const nuevaMateria = await prisma.materia.create({
      data: {
        nombre,
        descripcion: descripcion || null,
      },
    });

    // 3. Refrescar la ruta donde se listan las materias
    revalidatePath("/materias");

    return { success: true, materia: nuevaMateria };
  } catch (error) {
    console.error("CREATE_MATERIA_ERROR:", error);
    return { success: false, error: "No se pudo crear la materia." };
  }
}

/**
 * ACTUALIZAR MATERIA
 */
export async function updateMateria(id: number, data: any) {
  try {
    // 1. Validar datos
    const validation = materiaSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: "Datos de edición inválidos." };
    }

    const { nombre, descripcion } = validation.data;

    // 2. Actualizar en Prisma
    const materiaActualizada = await prisma.materia.update({
      where: { id },
      data: {
        nombre,
        descripcion: descripcion || null,
      },
    });

    // 3. Refrescar caché
    revalidatePath("/materias");

    return { success: true, materia: materiaActualizada };
  } catch (error) {
    console.error("UPDATE_MATERIA_ERROR:", error);
    return { success: false, error: "Error al actualizar la materia." };
  }
}

/**
 * ELIMINAR MATERIA (Opcional, pero seguro la necesitarás)
 */
export async function deleteMateria(id: number) {
  try {
    await prisma.materia.delete({
      where: { id },
    });

    revalidatePath("/materias");
    return { success: true };
  } catch (error) {
    console.error("DELETE_MATERIA_ERROR:", error);
    return { success: false, error: "No se puede eliminar la materia (posiblemente tiene registros asociados)." };
  }
}

/**
 * OBTENER MATERIAS CON FILTROS Y PAGINACIÓN
 */
export async function getMaterias({
  query = '',
  page = 1,
  limit = 5
}: {
  query?: string;
  page?: number;
  limit?: number;
}) {
  const skip = (page - 1) * limit;

  try {
    const [materias, total] = await Promise.all([
      prisma.materia.findMany({
        where: {
          OR: [
            { nombre: { contains: query } },
            { descripcion: { contains: query } },
          ],
        },
        // --- AQUÍ LA MAGIA ---
        include: {
          asignaciones: {
            include: {
              docente: {
                include: {
                  usuario: {
                    select: { nombre: true } // Solo ocupamos el nombre del docente
                  }
                }
              },
              semestre: {
                select: { nombre: true } // Solo ocupamos el nombre del semestre (ej. 2026-1)
              }
            },
            take: 1,           // Solo nos interesa el responsable actual/último
            orderBy: { id: 'desc' } // El más reciente primero
          }
        },
        // ---------------------
        skip,
        take: limit,
        orderBy: { nombre: 'asc' },
      }),
      prisma.materia.count({
        where: {
          OR: [
            { nombre: { contains: query } },
            { descripcion: { contains: query } },
          ],
        },
      }),
    ]);

    return {
      materias,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    };
  } catch (error) {
    console.error("GET_MATERIAS_ERROR:", error);
    return {
      materias: [],
      totalPages: 1,
      totalItems: 0,
      error: "No se pudieron cargar las materias"
    };
  }
}

export async function asignarMateriaADocente({ 
  materiaId, 
  docenteId, 
  semestreId 
}: { 
  materiaId: number, 
  docenteId: number, 
  semestreId: number 
}) {
  try {
    const nuevaAsignacion = await prisma.asignacionDocente.create({
      data: {
        materiaId,
        docenteId,
        semestreId
      }
    });

    revalidatePath("/materias");
    return { success: true, data: nuevaAsignacion };
  } catch (error: any) {
    // Manejo de error por si ya existe esa combinación exacta (unique constraint)
    if (error.code === 'P2002') {
      return { success: false, error: "Este docente ya está asignado a esta materia en este semestre." };
    }
    return { success: false, error: "Error al realizar la asignación." };
  }
}

export async function getDocentesDisponibles() {
  try {
    const docentesRaw = await prisma.docente.findMany({
      include: { usuario: { select: { nombre: true } } },
    });

    const data = docentesRaw.map(d => ({
      id: d.usuarioId,
      nombre: d.usuario.nombre
    }));

    return { success: true, docentes: data }; // Aquí data siempre será un array []
  } catch (error) {
    return { success: false, docentes: [], error: "Error..." }; // Devolvemos array vacío aquí también
  }
}

export async function removerAsignacionDocente(asignacionId: number) {
  try {
    await prisma.asignacionDocente.delete({
      where: { id: asignacionId }
    });

    revalidatePath("/materias"); // Para que la tabla se refresque sola
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "No se pudo eliminar la asignación" };
  }
}