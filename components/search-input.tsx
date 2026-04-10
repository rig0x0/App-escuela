"use client"
import { Input } from "@/components/ui/input"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export function SearchInput({ defaultValue }: { defaultValue: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Espera 300ms después de que el usuario deja de escribir para actualizar la URL
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    params.set('page', '1') // Reset a pag 1 al buscar
    router.push(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <Input
      placeholder="Nombre o correo..."
      defaultValue={defaultValue}
      onChange={(e) => handleSearch(e.target.value)}
    />
  )
}