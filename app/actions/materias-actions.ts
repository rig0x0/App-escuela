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