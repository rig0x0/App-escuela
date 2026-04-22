import HorarioGridUsuarios from "@/components/horarios/horario-grid-usuarios";
import { getHorarioAlumno } from "@/app/actions/horarios-actions";

export default async function Page() {
  const sesiones = await getHorarioAlumno(1); // ID del alumno logueado
  
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900">Mi Horario Escolar</h1>
        <p className="text-slate-500 font-medium">Gestión de tiempos y aulas para el semestre actual.</p>
      </div>
      <HorarioGridUsuarios sesiones={sesiones} />
    </div>
  );
}