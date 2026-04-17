import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSemestres } from "../actions/semestre-actions";
import { PaginationControls } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { LimitSelector } from "@/components/limit-selector";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SemestreActions from "./buttons-table";

interface TableSemestresProps {
  searchParams: Promise<{ q?: string; page?: string; limit?: string }>;
}

export default async function TableSemestres({ searchParams }: TableSemestresProps) {
  const params = await searchParams;

  const query = params.q || '';
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 5;

  const { semestres, totalPages, error } = await getSemestres({ query, page, limit });

  if (error) {
    return (
      <Card className="mb-5">
        <CardContent className="p-10 text-center text-red-500 font-bold">
          Error: {error}
        </CardContent>
      </Card>
    );
  }

  // Función local para formatear fechas
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <Card className="mb-5">
      <CardHeader>
        <div className="flex justify-between items-end gap-4">
          <div className="w-100 space-y-2">
            <Label>Buscar por ciclo (ej. 2026-1)</Label>
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
                <TableHead className="w-[30%]">Semestre / Ciclo</TableHead>
                <TableHead className="w-[25%]">Fecha Inicio</TableHead>
                <TableHead className="w-[25%]">Fecha Fin</TableHead>
                <TableHead className="text-center w-[20%]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semestres.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    No se encontraron periodos académicos.
                  </TableCell>
                </TableRow>
              ) : (
                semestres.map((s, index) => (
                  <TableRow key={s.id} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                    <TableCell className="font-bold text-primary">
                      {s.nombre}
                    </TableCell>
                    <TableCell>
                      {formatDate(s.fechaInicio)}
                    </TableCell>
                    <TableCell>
                      {formatDate(s.fechaFin)}
                    </TableCell>
                    <TableCell className="text-center">
                      <SemestreActions 
                        semestreId={s.id} 
                        semestreName={s.nombre} 
                        semestreFullData={s} 
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