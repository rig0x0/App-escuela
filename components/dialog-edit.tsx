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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from 'react'
import { Eye, EyeOff } from "lucide-react"
import { updateUsuario } from "@/app/actions/usuarios-actions" // Cambiamos la acción
import { usuarioSchema } from "@/lib/validations/usuarios"

type TipoUsuario = 'ALUMNO' | 'DOCENTE' | 'ADMINISTRATIVO' | 'ADMIN' | ''

type FormData = {
    nombre: string
    email: string
    password: string
    tipo: TipoUsuario
    matricula?: string
    grado?: string
    departamento?: string
    puesto?: string
}

interface UserEditProps {
    user: any; // El usuario que viene de la tabla
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function UserEdit({ user, open, setOpen }: UserEditProps) {
    const [formData, setFormData] = useState<FormData>({
        nombre: user?.nombre || '',
        email: user?.email || '',
        password: '', // Siempre vacía al inicio por seguridad
        tipo: (user?.tipo as TipoUsuario) || '',
        matricula: user?.alumno?.matricula || '',
        grado: user?.alumno?.grado || '',
        departamento: user?.docente?.departamento || '',
        puesto: user?.administrativo?.puesto || ''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<any>({})

    // Efecto para resetear el formulario si el usuario cambia
    useEffect(() => {
        if (user) {
            setFormData({
                nombre: user.nombre,
                email: user.email,
                password: '',
                tipo: user.tipo as TipoUsuario,
                matricula: user.alumno?.matricula || '',
                grado: user.alumno?.grado || '',
                departamento: user.docente?.departamento || '',
                puesto: user.administrativo?.puesto || ''
            })
        }
    }, [user])

    // Cambiamos el parámetro para aceptar string o null
    const handleTipoChange = (value: string | null) => {
        // Si es null o no hay valor, lo reseteamos a un string vacío
        if (!value) {
            setFormData({ ...formData, tipo: '' })
            return
        }

        // Si hay valor, lo asignamos con un "cast" seguro
        setFormData({ ...formData, tipo: value as TipoUsuario })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // NOTA: Para editar, podrías necesitar un esquema de Zod donde 
        // la password sea .optional() para no forzar el cambio.
        const validation = usuarioSchema.safeParse(formData)

        // Si usas el mismo esquema de crear, borrar el error de password si está vacío
        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors
            if (!formData.password) delete fieldErrors.password; // No es error si no la quiere cambiar

            if (Object.keys(fieldErrors).length > 0) {
                setErrors(fieldErrors)
                return
            }
        }

        setErrors({})
        const resultado = await updateUsuario(user.id, formData)

        if (resultado.success) {
            setOpen(false);
            alert(`Usuario ${user.nombre} actualizado correctamente`);
        } else {
            alert(resultado.error || "Error al actualizar");
        }
    }

    const ErrorMessage = ({ message }: { message?: string }) => {
        if (!message) return null;
        return <p className="text-[0.8rem] font-medium text-destructive">{message}</p>;
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Editar Usuario</DialogTitle>
                        <DialogDescription>
                            Modifica la información de <strong>{user?.nombre}</strong>. Deja la contraseña en blanco para no cambiarla.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* NOMBRE */}
                        <div className="grid gap-2">
                            <Label htmlFor="edit-nombre">Nombre</Label>
                            <Input
                                id="edit-nombre"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                className={errors.nombre ? "border-destructive" : ""}
                            />
                            <ErrorMessage message={errors.nombre?.[0]} />
                        </div>

                        {/* EMAIL */}
                        <div className="grid gap-2">
                            <Label htmlFor="edit-email">Correo electrónico</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={errors.email ? "border-destructive" : ""}
                            />
                            <ErrorMessage message={errors.email?.[0]} />
                        </div>

                        {/* PASSWORD (Opcional en edición) */}
                        <div className="grid gap-2">
                            <Label htmlFor="edit-password">Nueva Contraseña (Opcional)</Label>
                            <div className="relative">
                                <Input
                                    id="edit-password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Dejar en blanco para mantener actual"
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
                        </div>

                        {/* TIPO DE USUARIO (Solo lectura) */}
                        <div className="grid gap-2">
                            <Label htmlFor="edit-tipo">Tipo de Usuario</Label>
                            <Select
                                onValueChange={handleTipoChange}
                                value={formData.tipo}
                                disabled // <--- ESTO BLOQUEA EL CAMBIO
                            >
                                <SelectTrigger id="edit-tipo" className="bg-slate-100 cursor-not-allowed">
                                    <SelectValue placeholder="Selecciona un tipo" />
                                </SelectTrigger>
                                {/* El contenido del Select se mantiene igual */}
                            </Select>
                            <p className="text-[10px] text-muted-foreground">El tipo de usuario no se puede modificar.</p>
                        </div>

                        {/* CAMPOS DINÁMICOS (ALUMNO) */}
                        {formData.tipo === 'ALUMNO' && (
                            <div className="p-4 border rounded-lg bg-slate-50 space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="grid gap-1">
                                        <Label className="text-xs">Matrícula</Label>
                                        <Input
                                            value={formData.matricula}
                                            onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <Label className="text-xs">Grado</Label>
                                        <Input
                                            value={formData.grado}
                                            onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CAMPOS DINÁMICOS (DOCENTE) */}
                        {formData.tipo === 'DOCENTE' && (
                            <div className="grid gap-2 p-4 border rounded-lg bg-slate-50">
                                <Label htmlFor="edit-dept">Departamento</Label>
                                <Input
                                    id="edit-dept"
                                    value={formData.departamento}
                                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                                />
                            </div>
                        )}

                        {/* CAMPOS DINÁMICOS (ADMINISTRATIVO) */}
                        {formData.tipo === 'ADMINISTRATIVO' && (
                            <div className="grid gap-2 p-4 border rounded-lg bg-slate-50">
                                <Label htmlFor="edit-puesto">Puesto / Cargo</Label>
                                <Input
                                    id="edit-puesto"
                                    value={formData.puesto}
                                    onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                                />
                            </div>
                        )}
                    </div>

                    <DialogFooter className="sm:justify-between gap-2">
                        <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">Actualizar Cambios</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}