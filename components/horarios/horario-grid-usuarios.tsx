import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generarBloquesHorarios, HORARIO_CONFIG } from "@/lib/horario-utils"; // Asegúrate de que la ruta sea correcta

export interface SesionClase {
  dia: string;
  horaInicio: string;
  materia: string;
  subtexto: string;
  aula: string;
}

export default function HorarioGridUsuarios({ sesiones }: { sesiones: SesionClase[] }) {
  const bloques = generarBloquesHorarios();
  const dias = HORARIO_CONFIG.diasLaborales;

  return (
    <div className="rounded-xl border shadow-md bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-900 hover:bg-slate-900">
            <TableHead className="text-white text-center font-bold border-r border-slate-700 w-24">Hora</TableHead>
            {dias.map(dia => (
              <TableHead key={dia} className="text-white text-center font-bold border-r border-slate-700">
                {dia}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {bloques.map((bloque, index) => {
            // Si el bloque es un receso, hacemos una fila especial
            if (bloque.tipo === 'receso') {
              return (
                <TableRow key={`receso-${index}`} className="h-12 bg-slate-100/80">
                  <TableCell className="text-center font-black border-r text-slate-400 text-[10px]">
                    {bloque.inicio}
                  </TableCell>
                  <TableCell colSpan={dias.length} className="text-center font-bold text-slate-500 tracking-[0.5em] uppercase text-xs">
                    {bloque.etiqueta}
                  </TableCell>
                </TableRow>
              );
            }

            // Si es un bloque de clase normal
            return (
              <TableRow key={bloque.inicio} className="h-24 hover:bg-transparent">
                <TableCell className="text-center font-black bg-slate-50 border-r text-slate-500">
                  {bloque.inicio}
                </TableCell>
                {dias.map((dia) => {
                  const clase = sesiones.find(s => s.dia === dia && s.horaInicio === bloque.inicio);
                  
                  return (
                    <TableCell key={`${dia}-${bloque.inicio}`} className="p-1 border-r relative min-w-[150px]">
                      {clase ? (
                        <div className="absolute inset-1 p-2 rounded-lg bg-indigo-50 border-l-4 border-indigo-600 flex flex-col justify-between shadow-sm overflow-hidden">
                          <p className="text-[11px] font-extrabold text-indigo-900 leading-tight uppercase truncate">
                            {clase.materia}
                          </p>
                          <div>
                            <p className="text-[10px] text-indigo-700 font-medium truncate">
                              {clase.subtexto}
                            </p>
                            <p className="text-[9px] text-slate-500 font-bold italic mt-1">
                              {clase.aula}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}