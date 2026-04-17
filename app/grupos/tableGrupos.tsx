import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getGrupos } from "../actions/grupos-actions";
import { PaginationControls } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { LimitSelector } from "@/components/limit-selector";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import GrupoActions from "./buttons-table";
import prisma from "@/lib/prisma";

interface TableGruposProps {
  searchParams: Promise<{ q?: string; page?: string; limit?: string }>;
}

export default async function TableGrupos({ searchParams }: TableGruposProps) {
  const params = await searchParams;

  const query = params.q || '';
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 5;

  // Obtenemos los grupos y también la lista de semestres para los modales de edición
  const [{ grupos, totalPages, error }, semestres] = await Promise.all([
    getGrupos({ query, page, limit }),
    prisma.semestre.findMany({ select: { id: true, nombre: true }, orderBy: { nombre: 'desc' } })
  ]);

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
            <Label>Buscar por nombre de grupo</Label>
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
                <TableHead className="w-[40%]">Nombre del Grupo</TableHead>
                <TableHead className="w-[40%]">Semestre / Periodo</TableHead>
                <TableHead className="text-center w-[20%]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grupos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                    No se encontraron grupos registrados.
                  </TableCell>
                </TableRow>
              ) : (
                grupos.map((g, index) => (
                  <TableRow key={g.id} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                    <TableCell className="font-medium">
                      {g.nombre}
                    </TableCell>
                    <TableCell >
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {g.semestre.nombre}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <GrupoActions 
                        grupoId={g.id} 
                        grupoName={g.nombre} 
                        grupoFullData={g}
                        semestres={semestres} // Importante para el Dialog de edición
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