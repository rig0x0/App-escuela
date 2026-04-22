"use server" // O el archivo de actions que ya tengas
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { HORARIO_CONFIG } from "@/lib/horario-utils"; // Importamos tu config

export async function getAsignacionesDisponibles(semestreId: number) {
  try {
    const asignaciones = await prisma.asignacionDocente.findMany({
      where: {
        semestreId: semestreId,
      },
      include: {
        materia: true,
        docente: {
          include: {
            usuario: true,
          },
        },
      },
    });

    return asignaciones.map((a) => ({
      id: a.id,
      label: `${a.materia.nombre} - ${a.docente.usuario.nombre}`,
    }));
  } catch (error) {
    console.error("Error al obtener asignaciones:", error);
    return [];
  }
}

export async function createHorario(data: {
  diaSemana: string;
  horaInicio: string;
  aula: string;
  grupoId: number;
  asignacionId: number;
}) {
  try {
    // --- LÓGICA PARA CALCULAR HORA FIN ---
    const [horas, minutos] = data.horaInicio.split(':').map(Number);
    let totalMinutos = horas * 60 + minutos + HORARIO_CONFIG.intervaloMinutos;
    
    const hFin = Math.floor(totalMinutos / 60);
    const mFin = totalMinutos % 60;
    const horaFinCalculada = `${hFin.toString().padStart(2, '0')}:${mFin.toString().padStart(2, '0')}`;
    // -------------------------------------

    // 1. Validación de choque de aula (usando la hora calculada)
    const choqueAula = await prisma.horario.findFirst({
      where: {
        diaSemana: data.diaSemana,
        horaInicio: data.horaInicio,
        aula: data.aula,
      },
    });

    if (choqueAula) {
      return { error: `El aula ${data.aula} ya está ocupada en ese horario.` };
    }

    // 2. Crear el registro con todos los campos requeridos
    await prisma.horario.create({
      data: {
        diaSemana: data.diaSemana,
        horaInicio: data.horaInicio,
        horaFin: horaFinCalculada, // 👈 Ya no falta la propiedad requerida
        aula: data.aula,
        grupoId: data.grupoId,
        asignacionId: data.asignacionId,
      },
    });

    revalidatePath(`/grupos/horarios/${data.grupoId}`);
    return { success: true };
  } catch (error) {
    console.error("Error al crear horario:", error);
    return { error: "No se pudo guardar la clase." };
  }
}

// Para el Docente: Ve que grupos tiene y en qué aula
export async function getHorarioDocente(docenteId: number) {
  const horarioRaw = await prisma.horario.findMany({
    where: { asignacion: { docenteId } },
    include: {
      asignacion: { include: { materia: true } },
      grupo: true
    }
  });

  return horarioRaw.map(h => ({
    dia: h.diaSemana,
    horaInicio: h.horaInicio,
    materia: h.asignacion.materia.nombre,
    subtexto: `Grupo: ${h.grupo.nombre}`,
    aula: h.aula
  }));
}

// Para el Alumno: Ve qué materias tiene y quién se las da
export async function getHorarioAlumno(alumnoId: number) {
  const horarioRaw = await prisma.horario.findMany({
    where: {
      grupo: {
        inscripciones: { some: { alumnoId } }
      }
    },
    include: {
      asignacion: {
        include: {
          materia: true,
          docente: { include: { usuario: true } }
        }
      }
    }
  });

  return horarioRaw.map(h => ({
    dia: h.diaSemana,
    horaInicio: h.horaInicio,
    materia: h.asignacion.materia.nombre,
    subtexto: h.asignacion.docente.usuario.nombre,
    aula: h.aula
  }));
}

export async function eliminarHorarioGrupo(grupoId: number) {
  try {
    await prisma.horario.deleteMany({
      where: { grupoId: grupoId }
    });
    revalidatePath("/grupos");
    return { success: true };
  } catch (error) {
    return { error: "No se pudo eliminar el horario" };
  }
}