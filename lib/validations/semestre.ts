import * as z from "zod"

export const semestreSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El nombre del semestre es obligatorio." })
    .regex(/^\d{4}-[1-2]$/, { message: "Formato sugerido: YYYY-1 o YYYY-2" }),
    
  // COERCE: Convierte automáticamente el string "2026-04-17" en un objeto Date
  fechaInicio: z.coerce.date({ 
    error: () => ({ message: "La fecha de inicio es obligatoria." }) 
  }),
  
  fechaFin: z.coerce.date({ 
    error: () => ({ message: "La fecha de fin es obligatoria." }) 
  }),
  
  activo: z.boolean().default(false),
}).refine((data) => data.fechaFin > data.fechaInicio, {
  message: "La fecha de fin debe ser posterior a la de inicio",
  path: ["fechaFin"],
})

export type SemestreFormValues = z.infer<typeof semestreSchema>