import * as z from "zod"

export const grupoSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El nombre del grupo es obligatorio." })
    .max(20, { message: "El nombre es demasiado largo (máx 20 caracteres)." })
    .regex(/^[a-zA-Z0-9-\s]+$/, { 
      message: "El nombre solo puede contener letras, números y guiones." 
    }),
  
  semestreId: z.coerce
    .number({ 
      message: "Debes seleccionar un semestre válido.",  // ✅ Cubre TODOS los errores
    })
    .min(1, { message: "Selecciona un semestre válido de la lista." }),
})

export type GrupoFormValues = z.infer<typeof grupoSchema>