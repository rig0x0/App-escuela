"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { useState } from "react"

// Mantenemos los grados como strings
const gradosEscolares = [
  "1", "2", "3", "4", "5", "6", "7", "8"
] as const;

interface ComboboxSemestreProps {
  onSelect: (value: string) => void;
}

export function ComboboxSemestre({ onSelect }: ComboboxSemestreProps) {
  const [selected, setSelected] = useState<string | null>("");

  // CORRECCIÓN: Ajustamos los parámetros para que coincidan con la firma del componente
  // Añadimos 'null' al tipo de value y usamos el resto de argumentos (details) para el tipado de la librería
  const handleSelect = (value: string | null) => {
    setSelected(value);
    
    // Solo notificamos al padre si tenemos un valor real
    if (value) {
      onSelect(value);
    }
  };

  return (
    <Combobox 
      items={gradosEscolares} 
      value={selected} 
      onValueChange={handleSelect}
    >
      <ComboboxInput placeholder="Selecciona un semestre escolar..." />
      <ComboboxContent>
        <ComboboxEmpty>No se encontraron semestres.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}° Semestre
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}