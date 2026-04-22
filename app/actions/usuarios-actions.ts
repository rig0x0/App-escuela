"use server"
import prisma from "@/lib/prisma"
import { usuarioSchema } from "@/lib/validations/usuarios";
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function createUsuario(rawData: any) {
  // 1. Validar con Zod
  const validation = usuarioSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      error: "Datos inválidos",
      details: validation.error.flatten().fieldErrors
    };
  }

  const data = validation.data;

  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 2. Crear el usuario con su perfil correspondiente
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        password: hashedPassword,
        tipo: data.tipo,
        telefono: data.telefono, // 👈 Nuevo campo integrado
        // Escrituras anidadas según el tipo
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
        ...(data.tipo === 'ADMINISTRATIVO' && {
          administrativo: {
            create: { puesto: data.puesto! }
          }
        }),
      },
    });

    revalidatePath("/usuarios");

    const { password: _, ...userWithoutPassword } = nuevoUsuario;
    return { success: true, user: userWithoutPassword };

  } catch (error: any) {
    console.error("ERROR_CREATING_USER:", error);
    if (error.code === 'P2002') {
      return { error: "El correo electrónico o la matrícula ya están registrados." };
    }
    return { error: "Hubo un error al crear el usuario." };
  }
}

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
    const [usuarios, total] = await Promise.all([
      prisma.usuario.findMany({
        where: {
          AND: [
            query ? {
              OR: [
                { nombre: { contains: query } },
                { email: { contains: query } },
                { telefono: { contains: query } }, // 👈 También podemos buscar por tel
              ],
            } : {},
            role ? { tipo: role } : {},
          ],
        },
        include: {
          alumno: true,
          docente: true,
          administrativo: true,
        },
        skip,
        take: limit,
        orderBy: { nombre: 'asc' },
      }),
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
    return { usuarios: [], totalPages: 1, totalItems: 0, error: "No se pudieron cargar los usuarios" };
  }
}

export async function updateUsuario(id: number, rawData: any) {
  try {
    // 1. Validamos con Zod (usando .partial() o validando solo lo necesario)
    // Para simplificar, usamos los datos del rawData directamente aquí ya limpios del form
    const { password, matricula, grado, departamento, puesto, tipo, telefono, nombre, email } = rawData;

    let dataParaPrisma: any = {
      nombre,
      email,
      telefono, // 👈 Actualizamos el teléfono
    };

    // 2. Hash de password solo si se cambió
    if (password && password.trim() !== "") {
      dataParaPrisma.password = await bcrypt.hash(password, 10);
    }

    // 3. Actualización de perfiles específicos (upsert es más seguro que update)
    // El upsert asegura que si el perfil no existe, lo cree; si existe, lo actualice.
    if (tipo === 'ALUMNO') {
      dataParaPrisma.alumno = {
        upsert: {
          create: { matricula: matricula || '', grado: grado || '' },
          update: { matricula: matricula || '', grado: grado || '' }
        }
      };
    } else if (tipo === 'DOCENTE') {
      dataParaPrisma.docente = {
        upsert: {
          create: { departamento: departamento || '' },
          update: { departamento: departamento || '' }
        }
      };
    } else if (tipo === 'ADMINISTRATIVO') {
      dataParaPrisma.administrativo = {
        upsert: {
          create: { puesto: puesto || '' },
          update: { puesto: puesto || '' }
        }
      };
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: dataParaPrisma,
    });

    revalidatePath("/usuarios");

    const { password: _, ...userSafe } = usuarioActualizado;
    return { success: true, user: userSafe };

  } catch (error: any) {
    console.error("UPDATE_ERROR:", error);
    if (error.code === 'P2002') return { success: false, error: "El correo o matrícula ya existen." };
    return { success: false, error: "Error al actualizar los datos." };
  }
}

export async function deleteUsuario(id: number) {
  try {
    await prisma.usuario.delete({
      where: { id },
    });
    revalidatePath("/usuarios");
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo eliminar el usuario" };
  }
}

export async function getUsuarioParaNavbar(id: number) {
  return await prisma.usuario.findUnique({
    where: { id },
    select: {
      nombre: true,
      email: true,
      tipo: true,
    }
  });
}