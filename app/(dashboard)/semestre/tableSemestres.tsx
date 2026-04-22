import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSemestres } from "@/app/actions/semestre-actions";
import { PaginationControls } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { LimitSelector } from "@/components/limit-selector";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SemestreActions from "./buttons-table";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Users, LayoutGrid } from "lucide-react"; // Importamos iconos nuevos

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
                <TableHead className="w-[20%]">Semestre / Ciclo</TableHead>
                <TableHead className="w-[15%]">Fecha Inicio</TableHead>
                <TableHead className="w-[15%]">Fecha Fin</TableHead>
                <TableHead className="w-[15%]">Estado</TableHead>
                <TableHead className="w-[20%]">Grupos / Alumnos</TableHead> {/* Columna de Grupos y Alumnos */}
                <TableHead className="text-center w-[15%]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semestres.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No se encontraron periodos académicos.
                  </TableCell>
                </TableRow>
              ) : (
                semestres.map((s, index) => (
                  <TableRow key={s.id} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                    <TableCell className="font-bold text-primary">
                      {s.nombre}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(s.fechaInicio)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(s.fechaFin)}
                    </TableCell>
                    <TableCell>
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
                        s.activo
                          ? "bg-green-500/10 text-green-600 border-green-500/20"
                          : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                      )}>
                        {s.activo ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Activo
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5" />
                            Inactivo
                          </>
                        )}
                      </div>
                    </TableCell>

                    {/* NUEVA COLUMNA G, A (GRUPOS Y ALUMNOS) */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* G: Grupos */}
                        <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-700 px-2 py-0.5 rounded border border-blue-500/20">
                          <LayoutGrid className="h-3.5 w-3.5" />
                          <span className="text-xs font-bold">{s._count?.grupos || 0}</span>
                        </div>

                        {/* A: Alumnos Globales (del campo grado) */}
                        <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded border border-amber-500/20">
                          <Users className="h-3.5 w-3.5" />
                          <span className="text-xs font-bold">{s.alumnosTotales}</span>
                        </div>
                      </div>
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