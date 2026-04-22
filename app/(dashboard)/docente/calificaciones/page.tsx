import CardMaterias from "@/components/docente-calificaciones/card-materias";
import { getCargaAcademica } from "@/app/actions/docente-actions";

export default async function CalificacionesPage() {
  // TODO: Aquí deberías obtener el ID del docente desde la sesión/auth
  // Por ahora usaremos uno de prueba para que veas tus cards
  const docenteIdIdPrueba = 2; 
  
  const materiasData = await getCargaAcademica(docenteIdIdPrueba);

  return (
    <div className="max-w-7xl mx-auto p-4">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Subir Calificaciones</h1>
            <p className="text-muted-foreground mt-2">
                Selecciona una materia para comenzar a calificar a tus alumnos.
            </p>
        </div>

        {materiasData.length === 0 ? (
          <div className="p-10 border-2 border-dashed rounded-xl text-center text-muted-foreground">
            No tienes materias o grupos asignados para este periodo.
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {materiasData.map((m) => (
              // @ts-ignore - Por si TS se pone necio con el tipado del map
              <CardMaterias key={m.id} materia={m} />
            ))}
          </div>
        )}
    </div>
  )
}