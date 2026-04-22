"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Save, UserCircle, Phone, Mail, GraduationCap, Hash } from "lucide-react"
import { updateUsuario } from "@/app/actions/usuarios-actions"
import { getDatosAlumnoPerfil } from "@/app/actions/alumnos-actions" // Asumiendo que la pondrás ahí

export default function DatosAlumnoPage() {
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    matricula: "",
    grado: "",
  })

  // TODO: Obtener ID de la sesión real
  const usuarioId = 1;

  useEffect(() => {
    async function cargarDatos() {
      const user = await getDatosAlumnoPerfil(usuarioId);
      if (user) {
        setFormData({
          nombre: user.nombre || "",
          email: user.email || "",
          password: "", 
          telefono: user.telefono || "",
          matricula: user.alumno?.matricula || "",
          grado: user.alumno?.grado || "",
        });
      }
    }
    cargarDatos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    
    // Aquí usamos tu action de updateUsuario que ya maneja los tipos
    const res = await updateUsuario(usuarioId, {
      ...formData,
      tipo: 'ALUMNO' // Forzamos el tipo ya que estamos en la vista de alumno
    });

    if (res.success) {
      alert("Información actualizada correctamente");
    } else {
      alert("Error: " + res.error);
    }
    setIsPending(false);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 italic">Mi Perfil</h1>
        <p className="text-muted-foreground font-medium">Gestiona tu información personal y de contacto.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="shadow-xl border-slate-200">
          <CardHeader className="bg-slate-50 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <UserCircle size={24} />
              </div>
              <div>
                <CardTitle className="text-lg">Información General</CardTitle>
                <CardDescription>Actualiza tus datos de acceso y contacto.</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 grid gap-6">
            {/* Fila 1: Nombre y Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="flex items-center gap-2 text-slate-600">
                  <UserCircle size={14} /> Nombre Completo
                </Label>
                <Input value={formData.nombre} disabled className="bg-slate-50 cursor-not-allowed font-medium" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-slate-600">
                  <Mail size={14} /> Correo Electrónico
                </Label>
                <Input 
                  id="email"
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Fila 2: Clave y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pass" className="flex items-center gap-2 text-slate-600">
                   Nueva Clave (Opcional)
                </Label>
                <div className="relative">
                  <Input 
                    id="pass"
                    type={showPassword ? "text" : "password"}
                    placeholder="******"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tel" className="flex items-center gap-2 text-slate-600">
                  <Phone size={14} /> Teléfono de Contacto
                </Label>
                <Input 
                  id="tel"
                  value={formData.telefono} 
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                />
              </div>
            </div>

            {/* Sección Académica: Estilo similar al Dialog */}
            <div className="mt-4 p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 border-dashed grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase">
                  <Hash size={12} /> Matrícula Institucional
                </Label>
                <Input value={formData.matricula} disabled className="bg-white/80 border-indigo-200" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="grado" className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase">
                  <GraduationCap size={12} /> Grado / Semestre
                </Label>
                <Input 
                  id="grado"
                  value={formData.grado} 
                  onChange={(e) => setFormData({...formData, grado: e.target.value})}
                  className="bg-white border-indigo-200 focus-visible:ring-indigo-500"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-slate-50 border-t p-6 flex justify-end">
            <Button type="submit" disabled={isPending} className="px-8 gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Save size={18} />
              {isPending ? "Actualizando..." : "Guardar Cambios"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}