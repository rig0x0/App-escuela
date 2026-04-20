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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from 'react'
import { createGrupo, updateGrupo } from "@/app/actions/grupos-actions"
import { grupoSchema } from "@/lib/validations/grupos"

type FormData = {
    nombre: string
    semestreId: string // Lo manejamos como string para el Select, luego Zod lo coerce a number
}

const initialForm: FormData = {
    nombre: '',
    semestreId: ''
}

interface GrupoDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    grupo?: any | null
    semestres: { id: number; nombre: string }[] // Nueva prop necesaria
}

export function GrupoDialog({ open, setOpen, grupo, semestres }: GrupoDialogProps) {
    const [formData, setFormData] = useState<FormData>(initialForm)
    const [errors, setErrors] = useState<any>({})
    const [isPending, setIsPending] = useState(false)

    const isEditing = !!grupo?.id

    useEffect(() => {
        if (open) {
            if (isEditing) {
                setFormData({
                    nombre: grupo.nombre || '',
                    // IMPORTANTE: Asegurar que sea string para que haga match con SelectItem value
                    semestreId: String(grupo.semestreId) || '',
                })
            } else {
                setFormData(initialForm)
            }
            setErrors({})
        }
    }, [open, grupo, isEditing])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const validation = grupoSchema.safeParse(formData)
        if (!validation.success) {
            setErrors(validation.error.flatten().fieldErrors)
            return
        }

        setErrors({})
        setIsPending(true)

        const resultado = isEditing
            ? await updateGrupo(grupo.id, formData)
            : await createGrupo(formData)

        setIsPending(false)

        if (resultado.success) {
            setOpen(false)
            alert(`Grupo ${isEditing ? 'actualizado' : 'creado'} correctamente`)
        } else {
            alert(resultado.error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Editar Grupo" : "Agregar Grupo"}</DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Modifica los detalles del grupo."
                                : "Crea un nuevo grupo asociado a un periodo académico."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Campo Nombre */}
                        <div className="grid gap-2">
                            <Label htmlFor="nombre">Nombre del Grupo</Label>
                            <Input
                                id="nombre"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                placeholder="Ej. Grupo A o 6CV1"
                                disabled={isPending}
                            />
                            {errors.nombre && <p className="text-xs text-destructive">{errors.nombre[0]}</p>}
                        </div>

                        {/* Campo Semestre (Select) */}
                        <div className="grid gap-2">
                            <Label htmlFor="semestreId">Semestre / Periodo</Label>
                            <Select
                                disabled={isPending}
                                // Controlamos el valor con el estado
                                value={formData.semestreId}
                                onValueChange={(value) => setFormData({ ...formData, semestreId: value ?? "" })}
                            >
                                <SelectTrigger className={errors.semestreId ? "border-destructive" : ""}>
                                    {/* SelectValue buscará el Item cuyo value sea igual a formData.semestreId 
                                        y mostrará su texto (s.nombre) */}
                                    <SelectValue placeholder="Selecciona un semestre" />
                                </SelectTrigger>
                                <SelectContent>
                                    {semestres.map((s) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            {s.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.semestreId && <p className="text-xs text-destructive">{errors.semestreId[0]}</p>}
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={isPending}>
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isEditing ? "Guardar Cambios" : "Crear Grupo"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}