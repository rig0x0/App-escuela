"use server"
import prisma from "@/lib/prisma"
import { usuarioSchema } from "@/lib/validations/usuarios";
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function createUsuario(rawData: any) {
    // 1. Validar con Zod
    const validation = usuarioSchema.safeParse(rawData);

    if (!validation.success) {
        // Retornamos los errores formateados
        return {
            error: "Datos inválidos",
            details: validation.error.flatten().fieldErrors
        };
    }

    const data = validation.data; // Aquí los datos ya están limpios y tipados

    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // 2. Crear el usuario con su perfil correspondiente
        const nuevoUsuario = await prisma.usuario.create({
            data: {
                nombre: data.nombre,
                email: data.email,
                password: hashedPassword,
                tipo: data.tipo,
                // Usamos escrituras anidadas según el tipo
                ...(data.tipo === 'ALUMNO' && {
                    alumno: {
                        create: {
                            matricula: data.matricula!,
                            grado: data.grado!,
                        }
                    }
                }),
                ...(data.tipo === 'DOCENTE' && {
                    docente: {
                        create: {
                            departamento: data.departamento!,
                        }
                    }
                }),
                // AQUÍ EL CAMBIO: Solo si es ADMINISTRATIVO (Admin se queda solo en la tabla Usuario)
                ...(data.tipo === 'ADMINISTRATIVO' && {
                    administrativo: {
                        create: { puesto: data.puesto! }
                    }
                }),
            },
        });

        // 3. Limpiar el cache para que los cambios se vean reflejados
        revalidatePath("/usuarios"); // Ajusta a la ruta donde listes tus usuarios

        const { password: _, ...userWithoutPassword } = nuevoUsuario;
        return { success: true, user: userWithoutPassword };

    } catch (error: any) {
        console.error("ERROR_CREATING_USER:", error);

        // Manejo de errores comunes (ej. email duplicado)
        if (error.code === 'P2002') {
            return { error: "El correo electrónico o la matrícula ya están registrados." };
        }

        return { error: "Hubo un error al crear el usuario. Intenta de nuevo." };
    }
}
// app/actions/usuarios-actions.ts
export async function getUsuarios({
  query = '',
  role = '',
  page = 1,
  limit = 5
}: {
  query?: string;
  role?: string;
  page?: number;
  limit?: number;
}) {
  const skip = (page - 1) * limit;

  try {
    // 1. Obtenemos los datos con filtros
    const [usuarios, total] = await Promise.all([
      prisma.usuario.findMany({
        where: {
          AND: [
            query ? {
              OR: [
                { nombre: { contains: query } }, // SQLite no soporta mode: 'insensitive' nativamente, ojo ahí
                { email: { contains: query } },
              ],
            } : {},
            role ? { tipo: role } : {},
          ],
        },
        skip,
        take: limit,
        orderBy: { nombre: 'asc' },
      }),
      // 2. Contamos el total para la paginación
      prisma.usuario.count({
        where: {
          AND: [
            query ? {
              OR: [
                { nombre: { contains: query } },
                { email: { contains: query } },
              ],
            } : {},
            role ? { tipo: role } : {},
          ],
        },
      }),
    ]);

    return {
      usuarios,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    };
  } catch (error) {
  console.error(error);
  return { 
    usuarios: [], 
    totalPages: 1, 
    totalItems: 0, 
    error: "No se pudieron cargar los usuarios" 
  };
}
}

export async function deleteUsuario(id: number) {
  try {
    await prisma.usuario.delete({
      where: { id },
    });
    
    // Esto es CLAVE: obliga a Next.js a refrescar la tabla
    revalidatePath("/usuarios"); 
    
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo eliminar el usuario" };
  }
}

export async function updateUsuario(id: number, data: any) {
  try {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: data,
    });
    revalidatePath("/usuarios");
    return { success: true, user: usuario };
  } catch (error) {
    return { success: false, error: "Error al actualizar el usuario" };
  }
}