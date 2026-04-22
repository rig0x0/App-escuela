import { getHistoricoCalificaciones } from "@/app/actions/alumnos-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function HistoricoPage() {
  const alumnoId = 1; // De la sesión
  const historico = await getHistoricoCalificaciones(alumnoId);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Historial Académico</h1>
        <p className="text-muted-foreground">Registro de semestres concluidos.</p>
      </div>

      {historico.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">
          No tienes registros de semestres anteriores.
        </Card>
      ) : (
        historico.map((periodo, i) => (
          <Card key={i} className="overflow-hidden border-slate-200">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-slate-700">Semestre: {periodo.semestre}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Materia</TableHead>
                    <TableHead className="text-center">P1</TableHead>
                    <TableHead className="text-center">P2</TableHead>
                    <TableHead className="text-center">P3</TableHead>
                    <TableHead className="text-center">EXT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {periodo.materias.map((m, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{m.materia}</TableCell>
                      <TableCell className="text-center">{m.P1}</TableCell>
                      <TableCell className="text-center">{m.P2}</TableCell>
                      <TableCell className="text-center">{m.P3}</TableCell>
                      <TableCell className="text-center font-bold text-red-600">{m.EXT}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}