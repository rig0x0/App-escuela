"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from 'react'
import { createSemestre, updateSemestre } from "@/app/actions/semestre-actions"
import { semestreSchema } from "@/lib/validations/semestre"
import { Switch } from "@/components/ui/switch"
import { FieldSeparator } from "@/components/ui/field"

type FormData = {
  nombre: string
  fechaInicio: string
  fechaFin: string
  activo?: boolean
}

const initialForm: FormData = {
  nombre: '',
  fechaInicio: '',
  fechaFin: ''
}

export function SemestreDialog({ open, setOpen, semestre }: { open: boolean, setOpen: (o: boolean) => void, semestre?: any }) {
  const [formData, setFormData] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<any>({})
  const isEditing = !!semestre?.id

  useEffect(() => {
    if (open) {
      if (isEditing) {
        setFormData({
          nombre: semestre.nombre || '',
          // Cortamos la fecha ISO para que solo quede YYYY-MM-DD
          fechaInicio: semestre.fechaInicio ? new Date(semestre.fechaInicio).toISOString().split('T')[0] : '',
          fechaFin: semestre.fechaFin ? new Date(semestre.fechaFin).toISOString().split('T')[0] : '',
        })
      } else {
        setFormData(initialForm)
      }
      setErrors({})
    }
  }, [open, semestre, isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validation = semestreSchema.safeParse(formData)

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors)
      return
    }

    setErrors({})
    const resultado = isEditing
      ? await updateSemestre(semestre.id, formData)
      : await createSemestre(formData)

    if (resultado.success) {
      setOpen(false)
      alert(`Semestre ${isEditing ? 'actualizado' : 'creado'} correctamente`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Semestre" : "Agregar Semestre"}</DialogTitle>
            <DialogDescription>Establece el periodo académico.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">

            <div className="grid gap-2">
              <Label htmlFor="nombre_formal">Nombre</Label>
              <Input
                id="nombre_formal"
                placeholder="Ej. 1er Semestre"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nombre"> Ciclo</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej. 2026-1"
              />
              {errors.nombre && <p className="text-xs text-destructive">{errors.nombre[0]}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fechaInicio">Inicio</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={formData.fechaInicio}
                  onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                />
                {errors.fechaInicio && <p className="text-xs text-destructive">{errors.fechaInicio[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fechaFin">Fin</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={formData.fechaFin}
                  onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                />
                {errors.fechaFin && <p className="text-xs text-destructive">{errors.fechaFin[0]}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-2 py-4">
              <Label htmlFor="airplane-mode">Semestre Activo</Label>
              <Switch id="airplane-mode" />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
            <Button type="submit">{isEditing ? "Guardar" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}