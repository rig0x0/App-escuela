import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AsignacionDialog from "./asignacion-dialog";
import { getInscripcionesByGrupo } from "@/app/actions/inscripcion-actions";
import { PaginationControls } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { LimitSelector } from "@/components/limit-selector";
import { Label } from "@/components/ui/label";
import { BotonBaja } from "./boton-baja"; // Importamos el nuevo componente

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string; page?: string; limit?: string }>;
}

export default async function InscripcionesPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sParams = await searchParams;

  const grupoId = Number(id);
  const query = sParams.q || '';
  const page = Number(sParams.page) || 1;
  const limit = Number(sParams.limit) || 5;

  const { inscripciones, total, grupoNombre, semestreId, totalPages } =
    await getInscripcionesByGrupo({ grupoId, query, page, limit });

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <div className="flex items-center p-4 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={18} />
          <Link href="/grupos" className="ml-2 text-sm font-medium">Volver a Grupos</Link>
        </div>
        <CardHeader className="border-b bg-muted/10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight mb-2">{grupoNombre}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                Gestión de Inscripciones • {total} Alumnos
              </p>
            </div>
            <AsignacionDialog grupoId={grupoId} semestreAcademicoId={semestreId!} />
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="w-100 space-y-2">
              <Label>Filtrar alumnos</Label>
              <SearchInput defaultValue={query} />
            </div>
            <div className="w-full md:w-32 space-y-2">
              <Label>Mostrar</Label>
              <LimitSelector defaultValue={limit.toString()} />
            </div>
          </div>

          <div className="rounded-md border shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold text-foreground">Nombre Completo</TableHead>
                  <TableHead className="font-bold text-foreground">Correo Electrónico</TableHead>
                  <TableHead className="text-center font-bold text-foreground">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inscripciones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-muted-foreground italic">
                      No hay alumnos inscritos con estos criterios.
                    </TableCell>
                  </TableRow>
                ) : (
                  inscripciones.map((ins) => (
                    <TableRow key={ins.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium">
                        {ins.alumno.usuario.nombre}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {ins.alumno.usuario.email}
                      </TableCell>
                      <TableCell className="text-center">
                        {/* Usamos el componente de cliente pasándole los datos necesarios */}
                        <BotonBaja 
                          alumnoId={ins.alumnoId} 
                          grupoId={ins.grupoId} 
                          nombreAlumno={ins.alumno.usuario.nombre} 
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 flex justify-center">
            <PaginationControls totalPages={totalPages} currentPage={page} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}