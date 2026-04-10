"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from 'react'
import { Eye, EyeOff } from "lucide-react" // Importa los iconos
import { createUsuario } from "@/app/actions/usuarios-actions"
import { usuarioSchema } from "@/lib/validations/usuarios"

// Importante: Que coincida con tu Prisma Enum
type TipoUsuario = 'ALUMNO' | 'DOCENTE' | 'ADMINISTRATIVO' | 'ADMIN' | ''

type FormData = {
  nombre: string
  email: string
  password: string
  tipo: TipoUsuario
  // Campos extra
  matricula?: string
  grado?: string
  departamento?: string
  puesto?: string
}

const initialForm: FormData = {
  nombre: '',
  email: '',
  password: '',
  tipo: '',
  matricula: '',
  grado: '',
  departamento: '',
  puesto: ''
}

export function UsersForm() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<any>({}) // Para guardar los errores de Zod

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    // Si se está cerrando (isOpen es false), limpiamos los datos
    if (!isOpen) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
  };

  // 1. Ajusta la función para aceptar string | null
  const handleTipoChange = (value: string | null) => {
    // Si el valor es null, reseteamos a un string vacío o manejamos el estado
    if (value === null) {
      setFormData({ ...formData, tipo: '' })
      return
    }

    // Si no es null, lo asignamos con seguridad
    setFormData({ ...formData, tipo: value as TipoUsuario })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 1. VALIDACIÓN EN EL CLIENTE
    const validation = usuarioSchema.safeParse(formData)
    
    if (!validation.success) {
      // Si falla, extraemos los errores y los ponemos en el estado
      const fieldErrors = validation.error.flatten().fieldErrors
      setErrors(fieldErrors)
      return // ✋ Detenemos el envío aquí
    }

    // Si pasa la validación, limpiamos errores y enviamos al server
    setErrors({})
    const resultado = await createUsuario(formData)
    // ... manejar respuesta del server
    if (resultado.success) {
      console.log("¡Usuario creado con éxito!", resultado.user);
      
      // 1. Cerramos el Dialog cambiando el estado a false
      setOpen(false); 

      // 2. Limpiamos el formulario para que la próxima vez esté vacío
      resetForm();

      // (Opcional) Puedes quitar el alert si prefieres algo menos intrusivo
      alert(`Usuario ${resultado.user.nombre} creado correctamente`);
    } else {
      console.error(resultado.error);
      // Aquí podrías setear un error general si el email ya existe, por ejemplo
    }
  }

  const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className="text-[0.8rem] font-medium text-destructive">{message}</p>;
};

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* Usamos asChild para que el botón sea el trigger real */}
      <DialogTrigger asChild>
        <Button variant="outline">Agregar Usuario</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Agregar Usuario</DialogTitle>
            <DialogDescription>
              Completa los campos para crear un nuevo usuario en la plataforma.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej. Juan Pérez"
                className={errors.nombre ? "border-destructive" : ""}
              />
              <ErrorMessage message={errors.nombre?.[0]} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="usuario@escuela.com"
                className={errors.email ? "border-destructive" : ""}
              />
              <ErrorMessage message={errors.email?.[0]}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative"> {/* Contenedor relativo para posicionar el ojo */}
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"} // Cambio dinámico
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Ingresa una contraseña segura"
                  className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`} // Padding a la derecha para que el texto no choque con el icono
                />
                  <ErrorMessage message={errors.password?.[0]} />
                <button
                  type="button" // IMPORTANTE: tipo button para que no envíe el formulario
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo de Usuario</Label>
              <Select onValueChange={handleTipoChange} >
                <SelectTrigger id="tipo" className={errors.tipo ? "border-destructive focus:ring-destructive" : ""}>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="ALUMNO">Alumno</SelectItem>
                  <SelectItem value="DOCENTE">Profesor / Docente</SelectItem>
                  <SelectItem value="ADMINISTRATIVO">Administrativo</SelectItem>
                  <SelectItem value="ADMIN">Administrador de Sistema</SelectItem>
                </SelectContent>
              </Select>
              <ErrorMessage message={errors.tipo?.[0]} />
            </div>

            {/* Campos Condicionales - Ahora sí coinciden los valores */}
            {formData.tipo === 'ALUMNO' && (
              <div className="p-4 border rounded-lg bg-slate-50 space-y-3">
                <p className="text-sm font-medium">Información Académica</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-1">
                    <Label className="text-xs">Matrícula</Label>
                    <Input
                      placeholder="A2026..."
                      value={formData.matricula}
                      onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                      className={errors.matricula ? "border-destructive" : ""}
                    />
                    <ErrorMessage message={errors.matricula?.[0]} />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">Grado</Label>
                    <Input
                      placeholder="5to Semestre"
                      value={formData.grado}
                      onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                      className={errors.grado ? "border-destructive" : ""}
                    />
                    <ErrorMessage message={errors.grado?.[0]} />
                  </div>
                </div>
              </div>
            )}

            {formData.tipo === 'DOCENTE' && (
              <div className="grid gap-2 p-4 border rounded-lg bg-slate-50">
                <Label htmlFor="departamento">Departamento</Label>
                <Input
                  id="departamento"
                  placeholder="Ej. Ingeniería, Ciencias..."
                  value={formData.departamento}
                  onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                  className={errors.departamento ? "border-destructive" : ""}
                />
                <ErrorMessage message={errors.departamento?.[0]} />
              </div>
            )}

            {(formData.tipo === 'ADMINISTRATIVO') && (
              <div className="grid gap-2 p-4 border rounded-lg bg-slate-50">
                <Label htmlFor="puesto">Puesto / Cargo</Label>
                <Input
                  id="puesto"
                  placeholder="Ej. Control Escolar"
                  value={formData.puesto}
                  onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                  className={errors.puesto ? "border-destructive" : ""}
                />
                <ErrorMessage message={errors.puesto?.[0]} />
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-between flex items-center ">
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Guardar Usuario</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}