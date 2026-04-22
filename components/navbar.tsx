"use client"

import Link from 'next/link'
import { ModeToggle } from './theme-toggle-button'
import { ChevronDown, LogOut } from 'lucide-react'
// 1. IMPORTA EL SIGNOUT DE REACT
import { signOut } from 'next-auth/react' 

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavbarProps {
  user: {
    nombre: string;
    email: string;
    tipo: string;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  
  // 2. FUNCIÓN CORREGIDA
  const handleLogout = async () => {
    // callbackUrl: "/" asegura que tras cerrar sesión te mande al login/inicio
    await signOut({ callbackUrl: "/" })
  }

  return (
    <nav className="py-4 bg-[#4F6D84] dark:bg-slate-900 border-b">
      <div className='max-w-7xl mx-auto px-4 flex justify-between items-center'>
        <Link href='/'>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100"> CBTa 188</h1>
        </Link>

        <div className="flex gap-x-2 items-center">
          <ModeToggle />
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className='flex items-center gap-x-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-lg transition-colors'>
                  <div className='text-right hidden sm:block'>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">
                      {user.nombre}
                    </p>
                    <p className="text-xs text-white dark:text-slate-400 mt-1 capitalize">
                      {user.tipo}
                    </p>
                  </div>
                  <ChevronDown size={16} className='text-white' />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{user.nombre}</p>
                      <p className="text-xs leading-none text-muted-foreground italic">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-600 focus:bg-red-50 dark:focus:bg-red-950 focus:text-red-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  )
}