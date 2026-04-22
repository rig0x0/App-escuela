"use server"
import prisma from "@/lib/prisma";

// AUXILIAR: Para no repetir lógica de agrupamiento
function agruparCalificacionesPorMateria(calificaciones: any[]) {
  const materiasMap = new Map();
  calificaciones.forEach((cal) => {
    const materiaId = cal.materiaId;
    if (!materiasMap.has(materiaId)) {
      materiasMap.set(materiaId, {
        materia: cal.materia.nombre,
        P1: "-", P2: "-", P3: "-", EXT: "-"
      });
    }
    const info = materiasMap.get(materiaId);
    if (cal.tipo in info) info[cal.tipo] = cal.calificacion;
  });
  return Array.from(materiasMap.values());
}

// ACCIÓN 1: Solo semestre actual
export async function getCalificacionesActuales(alumnoId: number) {
  const semestreActivo = await prisma.semestre.findFirst({ where: { activo: true } });
  if (!semestreActivo) return [];

  const cals = await prisma.calificacion.findMany({
    where: { alumnoId, semestreId: semestreActivo.id },
    include: { materia: true }
  });
  return agruparCalificacionesPorMateria(cals);
}

// ACCIÓN 2: Todo el histórico (Semestres concluidos)
export async function getHistoricoCalificaciones(alumnoId: number) {
  const cals = await prisma.calificacion.findMany({
    where: {
      alumnoId,
      semestre: { activo: false } // Solo semestres que ya pasaron
    },
    include: { materia: true, semestre: true },
    orderBy: { semestre: { fechaInicio: 'desc' } } // Del más reciente al más viejo
  });

  // Agrupamos primero por Semestre, luego por Materia
  const historicoMap = new Map();
  cals.forEach(cal => {
    const semNombre = cal.semestre.nombre;
    if (!historicoMap.has(semNombre)) historicoMap.set(semNombre, []);
    historicoMap.get(semNombre).push(cal);
  });

  // Formateamos para que la vista reciba un array de semestres con sus materias
  return Array.from(historicoMap.entries()).map(([nombre, calificaciones]) => ({
    semestre: nombre,
    materias: agruparCalificacionesPorMateria(calificaciones)
  }));
}

export async function getDatosAlumnoPerfil(usuarioId: number) {
  return await prisma.usuario.findUnique({
    where: { id: usuarioId },
    include: { alumno: true }
  });
}