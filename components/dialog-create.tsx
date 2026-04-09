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

// Importante: Que coincida con tu Prisma Enum
type TipoUsuario = 'ALUMNO' | 'DOCENTE' | 'ADMINISTRATIVO' | 'ADMIN' | ''

type FormData = {
  name: string
  email: string
  tipo: TipoUsuario
  // Campos extra
  matricula?: string
  grado?: string
  departamento?: string
  puesto?: string
}

const initialForm: FormData = { 
  name: '', 
  email: '', 
  tipo: '', 
  matricula: '', 
  grado: '', 
  departamento: '', 
  puesto: '' 
}

export function UsersForm() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialForm)

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

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Creamos una copia para limpiar lo que no aplica
  let dataParaEnviar = { ...formData };

  if (formData.tipo !== 'ALUMNO') {
    delete dataParaEnviar.matricula;
    delete dataParaEnviar.grado;
  }
  if (formData.tipo !== 'DOCENTE') {
    delete dataParaEnviar.departamento;
  }
  if (formData.tipo !== 'ADMIN' && formData.tipo !== 'ADMINISTRATIVO') {
    delete dataParaEnviar.puesto;
  }

  console.log("Datos listos para Prisma:", dataParaEnviar);
  // Aquí iría tu Server Action o fetch
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
              <Label htmlFor="name">Nombre</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ej. Juan Pérez" 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="usuario@escuela.com" 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo de Usuario</Label>
              <Select onValueChange={handleTipoChange}>
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="ALUMNO">Alumno</SelectItem>
                  <SelectItem value="DOCENTE">Profesor / Docente</SelectItem>
                  <SelectItem value="ADMINISTRATIVO">Administrativo</SelectItem>
                  <SelectItem value="ADMIN">Administrador de Sistema</SelectItem>
                </SelectContent>
              </Select>
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
                      onChange={(e) => setFormData({...formData, matricula: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">Grado</Label>
                    <Input 
                      placeholder="5to Semestre" 
                      value={formData.grado}
                      onChange={(e) => setFormData({...formData, grado: e.target.value})}
                    />
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
                  onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                />
              </div>
            )}

            {(formData.tipo === 'ADMINISTRATIVO' || formData.tipo === 'ADMIN') && (
              <div className="grid gap-2 p-4 border rounded-lg bg-slate-50">
                <Label htmlFor="puesto">Puesto / Cargo</Label>
                <Input 
                  id="puesto" 
                  placeholder="Ej. Control Escolar" 
                  value={formData.puesto}
                  onChange={(e) => setFormData({...formData, puesto: e.target.value})}
                />
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