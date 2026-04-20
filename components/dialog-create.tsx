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
import { Eye, EyeOff, UserPlus } from "lucide-react" 
import { createUsuario } from "@/app/actions/usuarios-actions"
import { usuarioSchema } from "@/lib/validations/usuarios"
import { ScrollArea } from "@/components/ui/scroll-area" // Asegúrate de que la ruta sea correcta
import { toast } from "sonner" // Opcional: Recomendado para notificaciones más pro que el alert

type TipoUsuario = 'ALUMNO' | 'DOCENTE' | 'ADMINISTRATIVO' | 'ADMIN' | ''

type FormData = {
  nombre: string
  email: string
  password: string
  telefono: string // Agregado
  tipo: TipoUsuario
  matricula?: string
  grado?: string
  departamento?: string
  puesto?: string
}

const initialForm: FormData = {
  nombre: '',
  email: '',
  password: '',
  telefono: '',
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
  const [isPending, setIsPending] = useState(false)
  const [errors, setErrors] = useState<any>({})

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) resetForm()
  }

  const resetForm = () => {
    setFormData(initialForm)
    setErrors({})
    setShowPassword(false)
  }

  // Actualiza la firma de la función para aceptar el valor que manda el Select
const handleTipoChange = (value: string | null) => {
  // Verificamos que no sea null antes de asignar, o asignamos string vacío
  const nuevoTipo = (value as TipoUsuario) || '';
  setFormData({ ...formData, tipo: nuevoTipo });
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)

    // 1. VALIDACIÓN EN EL CLIENTE
    const validation = usuarioSchema.safeParse(formData)

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors
      setErrors(fieldErrors)
      setIsPending(false)
      return 
    }

    setErrors({})
    
    try {
      const resultado = await createUsuario(formData)
      
      if (resultado.success) {
        setOpen(false)
        resetForm()
        // Si usas sonner: toast.success("Usuario creado correctamente")
        alert(`Usuario ${resultado.user.nombre} creado correctamente`)
      } else {
        // Manejo de error de correo duplicado que viene del server
        setErrors({ email: [resultado.error] })
      }
    } catch (error) {
      alert("Error inesperado al crear el usuario")
    } finally {
      setIsPending(false)
    }
  }

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null
    return <p className="text-[0.8rem] font-medium text-destructive mt-1">{message}</p>
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Agregar Usuario
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold">Nuevo Registro</DialogTitle>
            <DialogDescription>
              Ingresa la información básica y el rol del nuevo integrante.
            </DialogDescription>
          </DialogHeader>

          {/* ScrollArea para que el form sea responsive si se despliegan campos extra */}
          <ScrollArea className="max-h-[70vh] px-6 py-4">
            <div className="grid gap-5 pb-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej. Juan Pérez"
                  className={errors.nombre ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                <ErrorMessage message={errors.nombre?.[0]} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Correo Institucional</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="usuario@escuela.com"
                  className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                <ErrorMessage message={errors.email?.[0]} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="******"
                      className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <ErrorMessage message={errors.password?.[0]} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="telefono">Teléfono (10 dígitos)</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="5512345678"
                    className={errors.telefono ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  <ErrorMessage message={errors.telefono?.[0]} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tipo">Rol en la Plataforma</Label>
                <Select value={formData.tipo} onValueChange={handleTipoChange}>
                  <SelectTrigger id="tipo" className={errors.tipo ? "border-destructive focus:ring-destructive" : ""}>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALUMNO">Alumno</SelectItem>
                    <SelectItem value="DOCENTE">Profesor / Docente</SelectItem>
                    <SelectItem value="ADMINISTRATIVO">Administrativo</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage message={errors.tipo?.[0]} />
              </div>

              {/* Secciones Dinámicas */}
              {formData.tipo === 'ALUMNO' && (
                <div className="p-4 border rounded-xl bg-blue-50/50 space-y-4 animate-in fade-in slide-in-from-top-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">Perfil del Estudiante</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                      <Label className="text-xs">Matrícula</Label>
                      <Input
                        value={formData.matricula}
                        onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                        className={errors.matricula ? "border-destructive" : "bg-white"}
                      />
                      <ErrorMessage message={errors.matricula?.[0]} />
                    </div>
                    <div className="grid gap-1.5">
                      <Label className="text-xs">Grado / Semestre</Label>
                      <Input
                        value={formData.grado}
                        onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                        className={errors.grado ? "border-destructive" : "bg-white"}
                      />
                      <ErrorMessage message={errors.grado?.[0]} />
                    </div>
                  </div>
                </div>
              )}

              {formData.tipo === 'DOCENTE' && (
                <div className="p-4 border rounded-xl bg-orange-50/50 space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label htmlFor="departamento" className="text-orange-700">Departamento Académico</Label>
                  <Input
                    id="departamento"
                    value={formData.departamento}
                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                    className={errors.departamento ? "border-destructive" : "bg-white"}
                    placeholder="Ej. Ciencias de la Computación"
                  />
                  <ErrorMessage message={errors.departamento?.[0]} />
                </div>
              )}

              {formData.tipo === 'ADMINISTRATIVO' && (
                <div className="p-4 border rounded-xl bg-purple-50/50 space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label htmlFor="puesto" className="text-purple-700">Puesto o Cargo</Label>
                  <Input
                    id="puesto"
                    value={formData.puesto}
                    onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                    className={errors.puesto ? "border-destructive" : "bg-white"}
                    placeholder="Ej. Coordinador Académico"
                  />
                  <ErrorMessage message={errors.puesto?.[0]} />
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 pt-2 border-t bg-slate-50">
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={isPending}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Registrando..." : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}