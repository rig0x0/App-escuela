"use client"

import { BookOpen, Users, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

// Definimos la interfaz para que TypeScript no nos regañe
interface MateriaProps {
  materia: {
    id: number;
    nombre: string;
    semestre: string;
    grupos: { id: number; nombre: string }[];
  }
}

export default function CardMaterias({ materia }: MateriaProps) {
  const tieneVariosGrupos = materia.grupos.length > 1;

  return (
    <Card className='w-full max-w-[290px] hover:shadow-md transition-all border-slate-200 overflow-hidden group'>
      <CardHeader className="space-y-3 pb-4">
        {/* Icono con fondo suave para que resalte */}
        <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary'>
          <BookOpen size={28} />
        </div>
        
        <CardTitle className="space-y-1">
          <h1 className='font-bold text-xl tracking-tight'>{materia.nombre}</h1>
          <p className='text-sm font-medium text-muted-foreground italic'>
            Semestre {materia.semestre}
          </p>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className='flex items-center gap-2 pb-2'>
          <Users className="text-slate-400" size={20} />
          <span className='text-sm font-semibold text-slate-600'>
            {materia.grupos.length} {materia.grupos.length === 1 ? 'Grupo' : 'Grupos'}
          </span>
        </div>

        {/* LISTA DE GRUPOS: Aquí es donde el docente elige a dónde ir */}
        <div className='grid gap-2'>
          {materia.grupos.map((grupo) => (
            <Link 
              key={grupo.id}
              href={`/docente/calificaciones/${grupo.id}`}
              className='flex items-center justify-between p-2 rounded-md bg-secondary/50 hover:bg-primary hover:text-white transition-colors group/item'
            >
              <span className='text-xs font-bold uppercase tracking-wider'>
                Grupo {grupo.nombre}
              </span>
              <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}