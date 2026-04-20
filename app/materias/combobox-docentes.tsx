"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { useState, useEffect } from "react"
import { getDocentesDisponibles } from "@/app/actions/materias-actions" // Necesitarás esta acción
import { Loader2 } from "lucide-react"

interface Docente {
  id: number;
  nombre: string;
}

interface ComboboxDocentesProps {
  onSelect: (value: string) => void;
}

export function ComboboxDocentes({ onSelect }: ComboboxDocentesProps) {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [selected, setSelected] = useState<string | null>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  async function cargarDocentes() {
    setLoading(true);
    try {
      const res = await getDocentesDisponibles();
      
      // La clave está en el '?? []' para asegurar que nunca sea undefined
      if (res.success) {
        setDocentes(res.docentes ?? []); 
      }
    } catch (error) {
      console.error("Error cargando docentes", error);
      setDocentes([]); // En caso de error, limpiamos el estado
    } finally {
      setLoading(false);
    }
  }
  cargarDocentes();
}, []);

  const handleSelect = (value: string | null) => {
    setSelected(value);
    if (value) {
      onSelect(value);
    }
  };

  return (
    <Combobox 
      // Mapeamos los docentes para que la librería pueda filtrar por nombre (label)
      items={docentes.map(d => ({ label: d.nombre, value: d.id.toString() }))} 
      value={selected} 
      onValueChange={handleSelect}
    >
      <div className="relative w-full">
        <ComboboxInput placeholder={loading ? "Cargando docentes..." : "Busca un docente..."} />
        {loading && (
          <div className="absolute right-2 top-2.5">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      <ComboboxContent>
        <ComboboxEmpty>No se encontraron docentes.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item.value}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}