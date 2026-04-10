import { z } from "zod";

export const usuarioSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Correo electrónico no válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  tipo: z.enum(["ALUMNO", "DOCENTE", "ADMINISTRATIVO", "ADMIN"], "Tipo de usuario no válido"),
  // Campos opcionales inicialmente
  matricula: z.string().optional(),
  grado: z.string().optional(),
  departamento: z.string().optional(),
  puesto: z.string().optional(),
}).superRefine((data, ctx) => {
  // Validación para ALUMNO
  if (data.tipo === "ALUMNO" && (!data.matricula || data.matricula.length < 5)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La matrícula es obligatoria",
      path: ["matricula"],
    });
  }
  // Validación para DOCENTE
  if (data.tipo === "DOCENTE" && !data.departamento) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El departamento es obligatorio",
      path: ["departamento"],
    });
  }
  // Validación para ADMINISTRATIVO (Solo para este tipo)
  if (data.tipo === "ADMINISTRATIVO" && !data.puesto) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El puesto es obligatorio para personal administrativo",
      path: ["puesto"],
    });
  }
});