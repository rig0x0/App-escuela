"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, Trash2, Edit } from "lucide-react";
import { deleteUsuario } from "@/app/actions/usuarios-actions";
import { useState } from "react";
// 1. Importamos el componente que creamos para editar
import { UserEdit } from "@/components/dialog-edit"; 

interface ButtonActionsProps {
  userId: number;
  userName: string;
  userFullData: any; // 2. Necesitamos el objeto completo para que el form se rellene
}

export default function ButtonActions({ userId, userName, userFullData }: ButtonActionsProps) {
  const [isPending, setIsPending] = useState(false);
  // 3. Estado para controlar si el modal de edición está abierto
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${userName}?`)) return;

    setIsPending(true);
    const result = await deleteUsuario(userId);
    setIsPending(false);

    if (!result.success) {
      alert(result.error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" disabled={isPending}>
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* 4. Usamos onSelect para activar el estado. Esto abre el modal. */}
          <DropdownMenuItem 
            className="cursor-pointer" 
            onClick={() => setIsEditOpen(true)}
          >
            <Edit className="mr-2 size-4" /> Editar
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleDelete}
            className="text-destructive focus:bg-destructive cursor-pointer"
          >
            <Trash2 className="mr-2 size-4" /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 5. Renderizamos el componente de edición aquí. 
          Solo será visible cuando isEditOpen sea true. */}
      <UserEdit 
        user={userFullData} 
        open={isEditOpen} 
        setOpen={setIsEditOpen} 
      />
    </>
  );
}