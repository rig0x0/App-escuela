"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

export function RoleFilter({ defaultValue }: { defaultValue: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleRoleChange = (value: string | null) => {
    // 1. Creamos una copia de los parámetros actuales de la URL
    const params = new URLSearchParams(searchParams.toString())

    // 2. Lógica de actualización
    if (value && value !== "TODOS") {
      params.set('role', value)
    } else {
      params.delete('role')
    }

    // 3. Siempre reseteamos a la página 1 al filtrar
    params.set('page', '1')

    // 4. ESTO ES LO VITAL: Empujamos la nueva URL
    // Usamos { scroll: false } para que la página no salte arriba al filtrar
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <Select 
      onValueChange={handleRoleChange} 
      defaultValue={defaultValue || "TODOS"}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filtrar por rol" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="TODOS">Todos los roles</SelectItem>
        <SelectItem value="ALUMNO">Alumno</SelectItem>
        <SelectItem value="DOCENTE">Docente</SelectItem>
        <SelectItem value="ADMINISTRATIVO">Administrativo</SelectItem>
        <SelectItem value="ADMIN">Administrador</SelectItem>
      </SelectContent>
    </Select>
  )
}