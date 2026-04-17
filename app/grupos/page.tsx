import { GrupoDialogWrapper } from "./button-agregar";
import TableGrupos from "./tableGrupos";
import prisma from "@/lib/prisma";

interface Props {
  searchParams: Promise<{ q?: string; page?: string; limit?: string }>;
}

export default async function GruposPage({ searchParams }: Props) {

  const semestres = await prisma.semestre.findMany({
  select: { id: true, nombre: true },
  orderBy: { nombre: 'desc' }
});

  return (
    <div className="container mx-auto p-4">
      <div className="m-5 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">Grupos</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona los grupos del sistema.</p>
        </div>
        <GrupoDialogWrapper semestres={semestres}/>
      </div>

      {/* Le pasamos los params a la tabla para que ella se encargue del fetch */}
      <TableGrupos searchParams={searchParams} />
    </div>
  )
}