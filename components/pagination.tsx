"use client"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

export function PaginationControls({ totalPages, currentPage }: { totalPages: number, currentPage: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <p className="text-sm font-medium">Página {currentPage} de {totalPages}</p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(createPageUrl(currentPage - 1))}
        disabled={currentPage <= 1}
      >
        Anterior
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(createPageUrl(currentPage + 1))}
        disabled={currentPage >= totalPages}
      >
        Siguiente
      </Button>
    </div>
  )
}