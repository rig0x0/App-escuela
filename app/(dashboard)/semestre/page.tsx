import { SemestreDialogWrapper } from "./button-agregar";
import TableSemestres from "./tableSemestres";

interface Props {
  searchParams: Promise<{ q?: string; page?: string; limit?: string }>;
}

export default function SemestresPage({ searchParams }: Props) {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="m-5 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">Semestres</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona los semestres del sistema.</p>
        </div>
        <SemestreDialogWrapper />
      </div>

      {/* Le pasamos los params a la tabla para que ella se encargue del fetch */}
      <TableSemestres searchParams={searchParams} />
    </div>
  )
}