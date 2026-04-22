import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMaterias } from "@/app/actions/materias-actions";
import { PaginationControls } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { LimitSelector } from "@/components/limit-selector";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import MateriaActions from "@/app/(dashboard)/materias/buttons-materia-actions";
import { AsignarDocenteDialog } from "./asignar-docente-dialog";
import { RemoverDocenteButton } from "./remover-docente-button";

interface TableMateriasProps {
  searchParams: Promise<{ q?: string; page?: string; limit?: string }>;
}

export default async function TableMaterias({ searchParams }: TableMateriasProps) {
  // Resolvemos la promesa de los params que vienen del padre
  const params = await searchParams;

  const query = params.q || '';
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 5;

  const { materias, totalPages, error } = await getMaterias({ query, page, limit });

  if (error) {
    return (
      <Card className="mb-5">
        <CardContent className="p-10 text-center text-red-500 font-bold">
          Error: {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-5">
      <CardHeader>
        <div className="flex justify-between items-end gap-4">
          <div className="w-100 space-y-2">
            <Label>Buscar materia o descripción</Label>
            <SearchInput defaultValue={query} />
          </div>
          <div className="w-32 space-y-2">
            <Label>Por página</Label>
            <LimitSelector defaultValue={limit.toString()} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[25%]">Nombre</TableHead>
                <TableHead className="w-[35%]">Descripción</TableHead>
                <TableHead className="w-[20%]">Responsable</TableHead>
                <TableHead className="text-center w-[20%]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                    No se encontraron materias.
                  </TableCell>
                </TableRow>
              ) : (
                materias.map((m, index) => (
                  <TableRow key={m.id} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                    <TableCell className="font-medium">{m.nombre}</TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400 italic line-clamp-1">
                      {m.descripcion || "Sin descripción"}
                    </TableCell>
                    <TableCell>
                      {m.asignaciones && m.asignaciones.length > 0 ? (
                        <div className="flex items-center justify-between gap-2 group">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium leading-none">
                              {m.asignaciones[0].docente.usuario.nombre}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase mt-1">
                              Ciclo: {m.asignaciones[0].semestre.nombre}
                            </span>
                          </div>

                          {/* El botón de remover */}
                          <RemoverDocenteButton asignacionId={m.asignaciones[0].id} />
                        </div>
                      ) : (
                        <AsignarDocenteDialog materiaId={m.id} />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <MateriaActions
                        materiaId={m.id}
                        materiaName={m.nombre}
                        materiaFullData={m}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <PaginationControls totalPages={totalPages} currentPage={page} />
        </div>
      </CardContent>
    </Card>
  );
}