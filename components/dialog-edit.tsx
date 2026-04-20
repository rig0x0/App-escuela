"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from 'react'
import { Eye, EyeOff, Save } from "lucide-react"
import { updateUsuario } from "@/app/actions/usuarios-actions"
import { usuarioSchema } from "@/lib/validations/usuarios"
import { ScrollArea } from "@/components/ui/scroll-area"

type TipoUsuario = 'ALUMNO' | 'DOCENTE' | 'ADMINISTRATIVO' | 'ADMIN' | ''

type FormData = {
  nombre: string
  email: string
  password: string
  telefono: string
  tipo: TipoUsuario
  matricula?: string
  grado?: string
  departamento?: string
  puesto?: string
}

interface UserEditProps {
  user: any; 
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function UserEdit({ user, open, setOpen }: UserEditProps) {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    tipo: '',
    matricula: '',
    grado: '',
    departamento: '',
    puesto: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [errors, setErrors] = useState<any>({})

  // Sincronizar datos cuando el usuario cambia o se abre el dialog
  useEffect(() => {
    if (user && open) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        password: '', // Siempre vacío por seguridad
        telefono: user.telefono || '',
        tipo: (user.tipo as TipoUsuario) || '',
        matricula: user.alumno?.matricula || '',
        grado: user.alumno?.grado || '',
        departamento: user.docente?.departamento || '',
        puesto: user.administrativo?.puesto || ''
      })
      setErrors({})
    }
  }, [user, open])

  const handleTipoChange = (value: string | null) => {
    setFormData({ ...formData, tipo: (value as TipoUsuario) || '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)

    // Clonamos para validar. Si la password está vacía, le ponemos una válida 
    // temporal solo para pasar el schema de Zod, ya que el server sabrá ignorarla.
    const dataToValidate = {
      ...formData,
      password: formData.password || "123456" 
    }

    const validation = usuarioSchema.safeParse(dataToValidate)

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors
      // Si la password original estaba vacía, ignoramos sus errores de validación
      if (!formData.password) delete fieldErrors.password
      
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors)
        setIsPending(false)
        return
      }
    }

    setErrors({})
    try {
      const resultado = await updateUsuario(user.id, formData)

      if (resultado.success) {
        setOpen(false)
        alert(`Usuario actualizado correctamente`)
      } else {
        setErrors({ email: [resultado.error] })
      }
    } catch (error) {
      alert("Error al conectar con el servidor")
    } finally {
      setIsPending(false)
    }
  }

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null
    return <p className="text-[0.8rem] font-medium text-destructive mt-1">{message}</p>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold italic">Editar Perfil</DialogTitle>
            <DialogDescription>
              Actualiza la información de <strong>{user?.nombre}</strong>.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] px-6 py-4">
            <div className="grid gap-5 pb-4">
              {/* NOMBRE */}
              <div className="grid gap-2">
                <Label htmlFor="edit-nombre">Nombre Completo</Label>
                <Input
                  id="edit-nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className={errors.nombre ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                <ErrorMessage message={errors.nombre?.[0]} />
              </div>

              {/* EMAIL */}
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                <ErrorMessage message={errors.email?.[0]} />
              </div>

              {/* PASSWORD Y TELÉFONO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-password">Nueva Clave (Opcional)</Label>
                  <div className="relative">
                    <Input
                      id="edit-password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="******"
                      className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <ErrorMessage message={errors.password?.[0]} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-telefono">Teléfono</Label>
                  <Input
                    id="edit-telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="10 dígitos"
                    className={errors.telefono ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  <ErrorMessage message={errors.telefono?.[0]} />
                </div>
              </div>

              {/* TIPO (Bloqueado) */}
              <div className="grid gap-2">
                <Label>Rol del Usuario</Label>
                <Select value={formData.tipo} onValueChange={handleTipoChange} disabled>
                  <SelectTrigger className="bg-slate-100 opacity-80 cursor-not-allowed">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALUMNO">Alumno</SelectItem>
                    <SelectItem value="DOCENTE">Docente</SelectItem>
                    <SelectItem value="ADMINISTRATIVO">Administrativo</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground italic text-right">No se puede cambiar el rol en edición.</p>
              </div>

              {/* CAMPOS ESPECÍFICOS */}
              {formData.tipo === 'ALUMNO' && (
                <div className="p-4 border rounded-xl bg-blue-50/50 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="grid gap-1">
                    <Label className="text-xs">Matrícula</Label>
                    <Input
                      value={formData.matricula}
                      onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                      className="bg-white"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">Grado</Label>
                    <Input
                      value={formData.grado}
                      onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                      className="bg-white"
                    />
                  </div>
                </div>
              )}

              {formData.tipo === 'DOCENTE' && (
                <div className="p-4 border rounded-xl bg-orange-50/50 animate-in fade-in slide-in-from-top-2">
                  <Label className="text-xs">Departamento</Label>
                  <Input
                    value={formData.departamento}
                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                    className="bg-white mt-1"
                  />
                </div>
              )}

              {formData.tipo === 'ADMINISTRATIVO' && (
                <div className="p-4 border rounded-xl bg-purple-50/50 animate-in fade-in slide-in-from-top-2">
                  <Label className="text-xs">Puesto / Cargo</Label>
                  <Input
                    value={formData.puesto}
                    onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                    className="bg-white mt-1"
                  />
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 pt-2 border-t bg-slate-50">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              <Save className="h-4 w-4" />
              {isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}