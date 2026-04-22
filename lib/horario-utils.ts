export const HORARIO_CONFIG = {
  horaInicio: "08:00",
  horaFin: "15:00",
  intervaloMinutos: 60,
  receso: {
    activo: true,
    horaInicio: "11:00",
    duracionMinutos: 30,
    etiqueta: "RECESO / BREAK"
  },
  diasLaborales: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]
};

export function generarBloquesHorarios() {
  const bloques = [];
  let [hora, minutos] = HORARIO_CONFIG.horaInicio.split(':').map(Number);
  const [finH, finM] = HORARIO_CONFIG.horaFin.split(':').map(Number);

  while (hora < finH || (hora === finH && minutos < finM)) {
    const inicioStr = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    
    if (HORARIO_CONFIG.receso.activo && inicioStr === HORARIO_CONFIG.receso.horaInicio) {
      bloques.push({ 
        tipo: 'receso' as const, 
        inicio: inicioStr, 
        etiqueta: HORARIO_CONFIG.receso.etiqueta 
      });
      minutos += HORARIO_CONFIG.receso.duracionMinutos;
    } else {
      bloques.push({ tipo: 'clase' as const, inicio: inicioStr });
      minutos += HORARIO_CONFIG.intervaloMinutos;
    }

    if (minutos >= 60) {
      hora += Math.floor(minutos / 60);
      minutos = minutos % 60;
    }
  }
  return bloques;
}