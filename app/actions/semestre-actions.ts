"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { semestreSchema } from "@/lib/validations/semestre"

export async function createSemestre(data: any) {
  try {
    const validation = semestreSchema.safeParse(data)
    
    // CORRECCIÓN PARA TYPESCRIPT:
    if (!validation.success) {
      // Usamos flatten para obtener los mensajes de forma plana
      const fieldErrors = validation.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).flat()[0];
      
      return { 
        success: false, 
        error: firstError || "Datos inválidos" 
      }
    }

    // Verificamos si ya existe un semestre con ese nombre
    const existe = await prisma.semestre.findUnique({
      where: { nombre: validation.data.nombre }
    })

    if (existe) {
      return { success: false, error: "Ya existe un semestre con ese nombre (ej. 2026-1)." }
    }

    const nuevo = await prisma.semestre.create({
      data: {
        nombre: validation.data.nombre,
        fechaInicio: validation.data.fechaInicio,
        fechaFin: validation.data.fechaFin,
        activo: validation.data.activo,
      }
    })

    revalidatePath("/semestres")
    return { success: true, semestre: nuevo }
  } catch (error) {
    console.error("CREATE_SEMESTRE_ERROR:", error)
    return { success: false, error: "Error interno al crear el semestre." }
  }
}

export async function updateSemestre(id: number, data: any) {
  try {
    const validation = semestreSchema.safeParse(data)
    
    // CORRECCIÓN PARA TYPESCRIPT:
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).flat()[0];
      
      return { 
        success: false, 
        error: firstError || "Datos inválidos" 
      }
    }

    const actualizado = await prisma.semestre.update({
      where: { id },
      data: {
        nombre: validation.data.nombre,
        fechaInicio: validation.data.fechaInicio,
        fechaFin: validation.data.fechaFin,
        activo: validation.data.activo,
      }
    })

    revalidatePath("/semestres")
    return { success: true, semestre: actualizado }
  } catch (error) {
    console.error("UPDATE_SEMESTRE_ERROR:", error)
    return { success: false, error: "Error al actualizar la información." }
  }
}

/**
 * Cambia el estado rápido (Switch en la tabla)
 */
export async function toggleSemestreStatus(id: number, currentStatus: boolean) {
  try {
    await prisma.semestre.update({
      where: { id },
      data: { activo: !currentStatus }
    })
    revalidatePath("/semestres")
    return { success: true }
  } catch (error) {
    return { success: false, error: "No se pudo cambiar el estado." }
  }
}

/**
 * Obtener lista paginada
 */
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
    // 1. Traemos los semestres y el total (incluyendo el conteo de grupos)
    const [semestresRaw, total] = await Promise.all([
      prisma.semestre.findMany({
        where: {
          nombre: { contains: query }
        },
        include: {
          _count: {
            select: { grupos: true } // Esto nos da la 'G'
          }
        },
        skip,
        take: limit,
        orderBy: { fechaInicio: 'desc' },
      }),
      prisma.semestre.count({
        where: { nombre: { contains: query } },
      }),
    ]);

    // 2. Traemos el conteo global de alumnos agrupados por su campo 'grado'
    // Esto nos dirá cuantos alumnos hay en el grado "1", "2", etc.
    const conteoAlumnos = await prisma.alumno.groupBy({
      by: ['grado'],
      _count: {
        _all: true
      }
    });

    // 3. Cruzamos los datos
    // Mapeamos los semestres para inyectarles el total de alumnos
    const semestres = semestresRaw.map(s => {
      // Buscamos en el conteo de alumnos aquel que coincida con el nombre/grado del semestre
      // Nota: Si tu semestre se llama "1", buscamos grado "1". 
      // Si se llama "2026-1", quizás debas ajustar qué parte del nombre comparas.
      const alumnosDelGrado = conteoAlumnos.find(a => a.grado === s.id.toString()); // Aquí asumo que el grado es igual al ID del semestre, ajusta según tu lógica
      
      return {
        ...s,
        alumnosTotales: alumnosDelGrado?._count._all || 0 // Esto nos da la 'A'
      };
    });

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

/**
 * Eliminar semestre
 */
export async function deleteSemestre(id: number) {
  try {
    await prisma.semestre.delete({
      where: { id },
    });

    revalidatePath("/semestres");
    return { success: true };
  } catch (error: any) {
    console.error("DELETE_SEMESTRE_ERROR:", error);
    
    if (error.code === 'P2003') {
        return { 
          success: false, 
          error: "No se puede eliminar: Este semestre ya tiene grupos o alumnos vinculados." 
        };
    }

    return { 
      success: false, 
      error: "Error al intentar eliminar el registro." 
    };
  }
}