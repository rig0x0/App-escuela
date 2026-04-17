import * as z from "zod"

export const semestreSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El nombre del semestre es obligatorio." })
    .regex(/^\d{4}-[1-2]$/, { message: "Formato sugerido: YYYY-1 o YYYY-2" }),
  fechaInicio: z.string().min(1, { message: "La fecha de inicio es obligatoria." }),
  fechaFin: z.string().min(1, { message: "La fecha de fin es obligatoria." }),
}).refine((data) => new Date(data.fechaFin) > new Date(data.fechaInicio), {
  message: "La fecha de fin debe ser posterior a la de inicio",
  path: ["fechaFin"], // El error se marcará en este campo
})

export type SemestreFormValues = z.infer<typeof semestreSchema>