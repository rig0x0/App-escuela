import * as z from "zod"

export const inscripcionSchema = z.object({
  alumnoId: z.coerce.number().min(1, { message: "Debes seleccionar un alumno." }),
  grupoId: z.coerce.number().min(1, { message: "Debes seleccionar un grupo." }),
  // Opcional: podrías querer guardar la fecha de inscripción
  fechaInscripcion: z.coerce.date().default(() => new Date()),
})

export type InscripcionFormValues = z.infer<typeof inscripcionSchema>