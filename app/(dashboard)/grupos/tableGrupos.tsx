import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getGrupos } from "@/app/actions/grupos-actions";
import { PaginationControls } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { LimitSelector } from "@/components/limit-selector";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import GrupoActions from "./buttons-table";
import prisma from "@/lib/prisma";
import Link from "next/link"; // Importante para la navegación
import { Users } from "lucide-react"; // Icono de la imagen
import { CalendarDays, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteHorarioButton } from "@/components/horarios/delete-horario-button"; // Ajusta la ruta

interface TableGruposProps {
  searchParams: Promise<{ q?: string; page?: string; limit?: string }>;
}

export default async function TableGrupos({ searchParams }: TableGruposProps) {
  const params = await searchParams;

  const query = params.q || '';
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 5;

  // Obtenemos los grupos y también la lista de semestres
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
                <TableHead className="w-[20%]">Nombre del Grupo</TableHead>
                <TableHead className="w-[30%]">Semestre / Periodo</TableHead>
                <TableHead className="w-[10%] text-center">Alumnos</TableHead>
                <TableHead className="w-[20%] text-center">Horario</TableHead>
                <TableHead className="text-center w-[20%]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grupos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    No se encontraron grupos registrados.
                  </TableCell>
                </TableRow>
              ) : (
                grupos.map((g, index) => (
                  <TableRow key={g.id} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                    <TableCell className="font-medium">
                      {g.nombre}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {g.semestre.nombre}
                      </span>
                    </TableCell>

                    {/* COLUMNA DE ALUMNOS MODIFICADA */}
                    <TableCell className="text-center">
                      <Link
                        href={`/grupos/inscripciones/${g.id}`}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-800/50 transition-all group"
                      >
                        <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="font-bold">
                          {/* Aquí asumo que tu action 'getGrupos' incluye el conteo. 
                              Si no, puedes usar g.inscripciones.length si está incluido */}
                          {g._count?.inscripciones || 0}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      {(g._count?.horarios ?? 0) > 0 ? (
                        <div className="flex items-center justify-center gap-2">
                          {/* BOTÓN DE VER HORARIO (el que ya tenías) */}
                          <Link
                            href={`/grupos/horarios/${g.id}`}
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline group"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                              <CalendarDays className="size-4" />
                            </div>
                            <div className="flex flex-col leading-tight text-left">
                              <span className="font-semibold">Ver Horario</span>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-tight">
                                {g._count?.horarios} bloques
                              </span>
                            </div>
                          </Link>

                          {/* NUEVO BOTÓN DE ELIMINAR (Solo aparece si hay horarios) */}
                          <DeleteHorarioButton grupoId={g.id} />
                        </div>
                      ) : (
                        /* ESTADO: SIN HORARIO */
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className=" h-9 justify-start border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 group"
                        >
                          <Link href={`/grupos/horarios/${g.id}`} className="inline-flex items-center">
                            <PlusCircle className="mr-2 size-4 text-muted-foreground group-hover:text-primary" />
                            <span className="text-muted-foreground group-hover:text-primary">Asignar Materias</span>
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <GrupoActions
                        grupoId={g.id}
                        grupoName={g.nombre}
                        grupoFullData={g}
                        semestres={semestres}
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