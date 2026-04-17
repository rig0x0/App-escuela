"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { semestreSchema } from "@/lib/validations/semestre"

export async function createSemestre(data: any) {
  try {
    const validation = semestreSchema.safeParse(data)
    if (!validation.success) return { success: false, error: "Datos inválidos" }

    const nuevo = await prisma.semestre.create({
      data: {
        nombre: validation.data.nombre,
        fechaInicio: new Date(validation.data.fechaInicio),
        fechaFin: new Date(validation.data.fechaFin),
      }
    })
    revalidatePath("/semestres")
    return { success: true, semestre: nuevo }
  } catch (error) {
    return { success: false, error: "Error al crear semestre" }
  }
}

export async function updateSemestre(id: number, data: any) {
  try {
    const validation = semestreSchema.safeParse(data)
    if (!validation.success) return { success: false, error: "Datos inválidos" }

    const actualizado = await prisma.semestre.update({
      where: { id },
      data: {
        nombre: validation.data.nombre,
        fechaInicio: new Date(validation.data.fechaInicio),
        fechaFin: new Date(validation.data.fechaFin),
      }
    })
    revalidatePath("/semestres")
    return { success: true, semestre: actualizado }
  } catch (error) {
    return { success: false, error: "Error al actualizar semestre" }
  }
}

export async function getSemestres({
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
    const [semestres, total] = await Promise.all([
      prisma.semestre.findMany({
        where: {
          nombre: { contains: query }
        },
        skip,
        take: limit,
        orderBy: { fechaInicio: 'desc' }, // Los más nuevos primero
      }),
      prisma.semestre.count({
        where: {
          nombre: { contains: query }
        },
      }),
    ]);

    return {
      semestres,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    };
  } catch (error) {
    console.error("GET_SEMESTRES_ERROR:", error);
    return { semestres: [], totalPages: 1, totalItems: 0, error: "Error al cargar semestres" };
  }
}

export async function deleteSemestre(id: number) {
  try {
    await prisma.semestre.delete({
      where: { id },
    });

    revalidatePath("/semestres");
    return { success: true };
  } catch (error) {
    console.error("DELETE_SEMESTRE_ERROR:", error);
    return { 
      success: false, 
      error: "No se puede eliminar el semestre porque tiene grupos o calificaciones registradas." 
    };
  }
}