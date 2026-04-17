import * as z from "zod"

export const materiaSchema = z.object({
  nombre: z
    .string({
      message: "El nombre de la materia es obligatorio.", // ✅ CORRECTO
    })
    .min(3, {
      message: "El nombre debe tener al menos 3 caracteres.",
    })
    .max(100, {
      message: "El nombre no puede exceder los 100 caracteres.",
    }),
  
  // La descripción es opcional, pero si la escriben, podemos limitarla a un tamaño razonable
  descripcion: z
    .string()
    .max(500, {
      message: "La descripción no puede exceder los 500 caracteres.",
    })
    .optional() // Permite undefined
    .or(z.literal('')), // Permite strings vacíos (muy común cuando limpias un Textarea)
})

// Opcional: Exportar el tipo inferido por si lo quieres usar en tus states de React
export type MateriaFormValues = z.infer<typeof materiaSchema>