import { MateriaDialogWrapper } from "./button-agregar";
import TableMaterias from "@/app/materias/tableMaterias";

interface Props {
  searchParams: Promise<{ q?: string; page?: string; limit?: string }>;
}

export default function MateriasPage({ searchParams }: Props) {
  return (
    <div className="container mx-auto p-4">
      <div className="m-5 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">Materias</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona las materias del sistema.</p>
        </div>
        <MateriaDialogWrapper />
      </div>

      {/* Le pasamos los params a la tabla para que ella se encargue del fetch */}
      <TableMaterias searchParams={searchParams} />
    </div>
  )
}