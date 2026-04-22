import { getCalificacionesActuales } from "@/app/actions/alumnos-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, BookOpen } from "lucide-react";
import Link from "next/link";

export default async function CalificacionesActualesPage() {
  // TODO: Obtener el ID del alumno desde la sesión (auth)
  const alumnoId = 1; 
  const calificaciones = await getCalificacionesActuales(alumnoId);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Encabezado con Navegación */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Calificaciones Actuales
          </h1>
          <p className="text-muted-foreground mt-1">
            Periodo escolar en curso.
          </p>
        </div>
        
        <Link href="/alumno/calificaciones/historico">
          <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/5">
            <History size={18} />
            Ver Historial Académico
          </Button>
        </Link>
      </div>

      {/* Card Principal */}
      <Card className="overflow-hidden shadow-md border-primary/20">
        <CardHeader className="bg-primary/5 border-b flex flex-row items-center justify-between px-6 pt-6">
          <div className="flex items-center gap-2">
            <BookOpen className="text-primary" size={20} />
            <CardTitle className="text-lg">Boleta de Calificaciones</CardTitle>
          </div>
          <Badge className="bg-green-600 hover:bg-green-600">Semestre Activo</Badge>
        </CardHeader>
        
        <CardContent className="p-2">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-[40%] font-bold text-slate-700">Materia</TableHead>
                <TableHead className="text-center font-bold text-slate-700">1er Parcial</TableHead>
                <TableHead className="text-center font-bold text-slate-700">2do Parcial</TableHead>
                <TableHead className="text-center font-bold text-slate-700">3er Parcial</TableHead>
                <TableHead className="text-center font-bold text-red-600">Final / EXT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calificaciones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic">
                    Aún no se han capturado calificaciones para tus materias actuales.
                  </TableCell>
                </TableRow>
              ) : (
                calificaciones.map((m, idx) => (
                  <TableRow key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="font-semibold text-slate-800 py-4">
                      {m.materia}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={m.P1 !== "-" ? "font-bold" : "text-muted-foreground"}>
                        {m.P1}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                       <span className={m.P2 !== "-" ? "font-bold" : "text-muted-foreground"}>
                        {m.P2}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                       <span className={m.P3 !== "-" ? "font-bold" : "text-muted-foreground"}>
                        {m.P3}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={m.EXT !== "-" ? "destructive" : "secondary"} className="font-bold">
                        {m.EXT}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Info Adicional */}
      <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
        Estas calificaciones son preliminares hasta que el docente cierre el acta de evaluación.
      </div>
    </div>
  );
}