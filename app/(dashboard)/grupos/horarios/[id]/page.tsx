import { getGrupoById } from "@/app/actions/grupos-actions";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { GridHorario } from "@/components/horarios/grid-horario";
import Link from "next/link";


interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HorarioPage({ params }: PageProps) {
  const { id } = await params;
  const grupoId = Number(id);

  if (isNaN(grupoId)) notFound();
  const grupo = await getGrupoById(grupoId);
  if (!grupo) notFound();

  return (
    <div className="p-6 space-y-6 container mx-auto">
      {/* HEADER */}
       <div className="flex items-center text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={18} />
          <Link href="/grupos" className="ml-2 text-sm font-medium">Volver a Grupos</Link>
        </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Gestión de Horarios
          </h1>
          <p className="text-muted-foreground">
            Configurando el horario para: <span className="font-semibold text-primary">{grupo.nombre}</span>
          </p>
        </div>
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-bold border border-blue-200 dark:border-blue-800">
          Ciclo: {grupo.semestre.nombre}
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <Card className="shadow-md">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarDays className="size-5 text-primary" />
            Planificador Semanal
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* LA MAGIA SUCEDE AQUÍ */}
          <GridHorario 
            grupoId={grupo.id} 
            horariosExistentes={grupo.horarios} 
          />
        </CardContent>
      </Card>
    </div>
  );
}