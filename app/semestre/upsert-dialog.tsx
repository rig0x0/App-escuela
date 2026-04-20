"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from 'react'
import { createSemestre, updateSemestre } from "@/app/actions/semestre-actions"
import { semestreSchema } from "@/lib/validations/semestre"
import { Switch } from "@/components/ui/switch"
import { CalendarDays, CheckCircle2 } from "lucide-react"

type FormData = {
  nombre: string
  fechaInicio: string
  fechaFin: string
  activo: boolean
}

const initialForm: FormData = {
  nombre: '',
  fechaInicio: '',
  fechaFin: '',
  activo: false
}

export function SemestreDialog({ open, setOpen, semestre }: { open: boolean, setOpen: (o: boolean) => void, semestre?: any }) {
  const [formData, setFormData] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)
  
  const isEditing = !!semestre?.id

  useEffect(() => {
    if (open) {
      if (isEditing) {
        setFormData({
          nombre: semestre.nombre || '',
          // Formateo seguro para inputs de tipo date (YYYY-MM-DD)
          fechaInicio: semestre.fechaInicio ? new Date(semestre.fechaInicio).toISOString().split('T')[0] : '',
          fechaFin: semestre.fechaFin ? new Date(semestre.fechaFin).toISOString().split('T')[0] : '',
          activo: semestre.activo ?? false
        })
      } else {
        setFormData(initialForm)
      }
      setErrors({})
    }
  }, [open, semestre, isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const validation = semestreSchema.safeParse(formData)

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors)
      setLoading(false)
      return
    }

    try {
      const resultado = isEditing
        ? await updateSemestre(semestre.id, formData)
        : await createSemestre(formData)

      if (resultado.success) {
        setOpen(false)
        // Podrías usar un toast aquí en lugar de alert
        console.log(`Semestre ${isEditing ? 'actualizado' : 'creado'} correctamente`)
      } else {
        setErrors({ server: [resultado.error] })
      }
    } catch (error) {
      setErrors({ server: ["Ocurrió un error inesperado"] })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
               <CalendarDays className="h-5 w-5 text-primary" />
               <DialogTitle className="text-xl font-bold italic">
                 {isEditing ? "Editar Semestre" : "Nuevo Semestre"}
               </DialogTitle>
            </div>
            <DialogDescription>
              Configura el periodo académico para el sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-6">
            {/* NOMBRE */}
            <div className="grid gap-2">
              <Label htmlFor="nombre" className="font-semibold">Nombre del Ciclo</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej. 2026-1"
                className={errors.nombre ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.nombre && <p className="text-[0.8rem] font-medium text-destructive">{errors.nombre[0]}</p>}
            </div>

            {/* FECHAS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fechaInicio" className="font-semibold">Fecha Inicio</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={formData.fechaInicio}
                  onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                  className={errors.fechaInicio ? "border-destructive" : ""}
                />
                {errors.fechaInicio && <p className="text-[0.8rem] font-medium text-destructive">{errors.fechaInicio[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fechaFin" className="font-semibold">Fecha Fin</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={formData.fechaFin}
                  onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                  className={errors.fechaFin ? "border-destructive" : ""}
                />
              </div>
            </div>
            {/* Error de refinamiento (fechaFin < fechaInicio) */}
            {errors.fechaFin && <p className="text-[0.8rem] font-medium text-destructive -mt-3">{errors.fechaFin[0]}</p>}

            {/* SWITCH ACTIVO */}
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-slate-50/50">
              <div className="space-y-0.5">
                <Label htmlFor="semestre-activo" className="text-base font-medium">Estado del Semestre</Label>
                <p className="text-xs text-muted-foreground italic">Permite inscripciones y actas.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${formData.activo ? "text-green-600" : "text-slate-400"}`}>
                  {formData.activo ? "ACTIVO" : "INACTIVO"}
                </span>
                <Switch 
                  id="semestre-activo" 
                  checked={formData.activo}
                  onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                />
              </div>
            </div>
            
            {errors.server && <p className="text-center text-sm font-bold text-destructive bg-destructive/10 p-2 rounded">{errors.server[0]}</p>}
          </div>

          <DialogFooter className="sm:justify-between gap-2 border-t pt-4">
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={loading}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={loading} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {loading ? "Procesando..." : isEditing ? "Actualizar" : "Registrar Semestre"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}