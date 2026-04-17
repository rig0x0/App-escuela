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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" // Ideal para descripciones
import { useState, useEffect } from 'react'

// Aquí importarías tus server actions y tu esquema de validación (Zod)
import { createMateria, updateMateria } from "@/app/actions/materias-actions"
import { materiaSchema } from "@/lib/validations/materias"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type FormData = {
  nombre: string
  descripcion: string
}

const initialForm: FormData = {
  nombre: '',
  descripcion: ''
}

interface MateriaDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  materia?: any | null; // Si viene null, creamos; si trae datos, editamos
}

export function MateriaDialog({ open, setOpen, materia }: MateriaDialogProps) {
  const [formData, setFormData] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<any>({})

  // Determinar si estamos en modo edición o creación
  const isEditing = !!materia?.id;

  // Sincronizar el formulario cuando se abre el modal o cambia la materia
  useEffect(() => {
    if (open) {
      if (isEditing) {
        setFormData({
          nombre: materia.nombre || '',
          descripcion: materia.descripcion || '',
        });
      } else {
        setFormData(initialForm);
      }
      setErrors({}); // Limpiar errores al abrir
    }
  }, [open, materia, isEditing]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // VALIDACIÓN EN EL CLIENTE (Asegúrate de tener tu materiaSchema)

    const validation = materiaSchema.safeParse(formData)
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors
      setErrors(fieldErrors)
      return
    }


    setErrors({})

    let resultado;

    // LÓGICA CONDICIONAL: Crear o Actualizar
    if (isEditing) {
      resultado = await updateMateria(materia.id, formData);
      console.log("Actualizando materia...", formData);
    } else {
      resultado = await createMateria(formData);
      console.log("Creando materia...", formData);
    }

    if (resultado.success) {
      setOpen(false);
      alert(`Materia ${isEditing ? 'actualizada' : 'creada'} correctamente`);
    } else {
      // alert(resultado.error);
    }
  }

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return <p className="text-[0.8rem] font-medium text-destructive">{message}</p>;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {isEditing ? "Editar Materia" : "Agregar Materia"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modifica los detalles de la materia seleccionada."
                : "Ingresa la información para registrar una nueva materia en el sistema."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre de la Materia</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej. Matemáticas Discretas"
                className={errors.nombre ? "border-destructive" : ""}
              />
              <ErrorMessage message={errors.nombre?.[0]} />
            </div>

            <div className="grid gap-2">
              {/* Usamos Textarea porque la descripción puede ser larga y en Prisma es String? */}
              <Label htmlFor="descripcion">Descripción (Opcional)</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Breve descripción de los temas a tratar..."
                className={`resize-none h-24 ${errors.descripcion ? "border-destructive" : ""}`}
              />
              <ErrorMessage message={errors.descripcion?.[0]} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nombre">Responsable</Label>
              <Select>
                <SelectTrigger >
                  <SelectValue placeholder="Asigne un responsable de la materia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semestre1">Semestre 1</SelectItem>
                  <SelectItem value="semestre2">Semestre 2</SelectItem>
                  <SelectItem value="semestre3">Semestre 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2 ">
              <Label htmlFor="nombre">Semestre</Label>
              <Select>
                <SelectTrigger >
                  <SelectValue placeholder="Asigne un semestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semestre1">Semestre 1</SelectItem>
                  <SelectItem value="semestre2">Semestre 2</SelectItem>
                  <SelectItem value="semestre3">Semestre 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nombre">Carrera Tecnica</Label>
              <Select>
                <SelectTrigger >
                  <SelectValue placeholder="Asigne una carrera técnica" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Agropecuario">Agropecuario</SelectItem>
                  <SelectItem value="Emprendimiento">Emprendimiento</SelectItem>
                  <SelectItem value="Tecnico en Informatica">Técnico en Informática</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          <DialogFooter className="sm:justify-between gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button type="submit">
              {isEditing ? "Guardar Cambios" : "Crear Materia"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}