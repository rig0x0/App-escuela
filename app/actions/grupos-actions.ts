"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { grupoSchema } from "@/lib/validations/grupos"

export async function createGrupo(data: any) {
    try {
        const validation = grupoSchema.safeParse(data)
        if (!validation.success) return { success: false, error: "Datos inválidos" }

        const nuevoGrupo = await prisma.grupo.create({
            data: {
                nombre: validation.data.nombre,
                semestreId: validation.data.semestreId,
            }
        })

        revalidatePath("/grupos")
        return { success: true, grupo: nuevoGrupo }
    } catch (error) {
        console.error(error)
        return { success: false, error: "Error al crear el grupo. ¿Quizás ya existe?" }
    }
}

export async function updateGrupo(id: number, data: any) {
    try {
        const validation = grupoSchema.safeParse(data)
        if (!validation.success) return { success: false, error: "Datos inválidos" }

        const actualizado = await prisma.grupo.update({
            where: { id },
            data: {
                nombre: validation.data.nombre,
                semestreId: validation.data.semestreId,
            }
        })

        revalidatePath("/grupos")
        return { success: true, grupo: actualizado }
    } catch (error) {
        return { success: false, error: "Error al actualizar el grupo." }
    }
}

export async function getGrupos({
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
        const [grupos, total] = await Promise.all([
            prisma.grupo.findMany({
                where: {
                    nombre: {
                        contains: query // Quitamos el mode: 'insensitive'
                    }
                },
                include: {
                    _count: {
                        select: { inscripciones: true }
                    },
                    semestre: true
                },
                skip,
                take: limit,
                orderBy: { nombre: 'asc' },
            }),
            prisma.grupo.count({
                where: {
                    nombre: {
                        contains: query // Quitamos el mode: 'insensitive' aquí también
                    }
                },
            }),
        ]);

        return {
            grupos,
            totalPages: Math.ceil(total / limit),
            error: null
        };
    } catch (error) {
        console.error("GET_GRUPOS_ERROR:", error);
        return { grupos: [], totalPages: 1, error: "Error al cargar los grupos" };
    }
}

export async function deleteGrupo(id: number) {
    try {
        await prisma.grupo.delete({
            where: { id },
        });

        revalidatePath("/grupos");
        return { success: true };
    } catch (error) {
        console.error("DELETE_GRUPO_ERROR:", error);
        return {
            success: false,
            error: "No se pudo eliminar el grupo. Verifica si tiene alumnos inscritos."
        };
    }
}