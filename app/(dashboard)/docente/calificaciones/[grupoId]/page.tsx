import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getDatosParaCalificar } from "@/app/actions/docente-actions";
import TableCalificar from "@/components/docente-calificaciones/tableCalificar"; // El componente que hicimos antes
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ grupoId: string }>;
}

export default async function CalificarGrupoPage({ params }: PageProps) {
  const { grupoId } = await params;
  const data = await getDatosParaCalificar(Number(grupoId));

  if (!data) return notFound();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Navegación */}
      <div className="flex items-center p-4 text-muted-foreground hover:text-primary transition-colors w-fit">
        <ArrowLeft size={18} />
        <Link href="/docente/calificaciones" className="ml-2 text-sm font-medium">
          Volver a Calificaciones
        </Link>
      </div>

      {/* Encabezado Dinámico */}
      <div className="p-4 mb-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{data.materiaNombre}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded uppercase">
            Grupo {data.grupoNombre}
          </span>
          <p className="text-muted-foreground text-sm">| Registro de Evaluaciones Periódicas</p>
        </div>
      </div>

      {/* Tabla de Calificaciones con Scroll */}
      <div className="p-4">
        <TableCalificar
          initialAlumnos={data.alumnos}
          grupoNombre={data.grupoNombre}
          materiaId={data.materiaId}      // Viene de getDatosParaCalificar
          grupoId={Number(grupoId)}       // Viene de los params de la URL
          semestreId={data.semestreId}    // Viene de getDatosParaCalificar
        />
      </div>
    </div>
  )
}