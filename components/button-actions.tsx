"use client" // Asegúrate de que tenga esto

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, Trash2, Edit } from "lucide-react";
import { deleteUsuario } from "@/app/actions/usuarios-actions";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ButtonActionsProps {
  userId: number;
  userName: string;
}

export default function ButtonActions({ userId, userName }: ButtonActionsProps) {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    // Una confirmación rápida para evitar tragedias
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${userName}?`)) return;

    setIsPending(true);
    const result = await deleteUsuario(userId);
    setIsPending(false);

    if (!result.success) {
      alert(result.error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" disabled={isPending}>
          <MoreHorizontalIcon className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer">
          <Edit className="mr-2 size-4" /> Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleDelete}
          className="text-destructive focus:bg-destructive  cursor-pointer"
        >
          <Trash2 className="mr-2 size-4" /> Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}