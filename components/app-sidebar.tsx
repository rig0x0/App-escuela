"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { 
  BookOpenText, 
  ChevronRight, 
  University, 
  Users, 
  GraduationCap, 
  Calendar, 
  UserCircle 
} from "lucide-react"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"

// Recibimos el rol para filtrar el menú
interface AppSidebarProps {
  role?: string;
}

export function AppSidebar({ role }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-6 bg-[#02060A] border-b">
        <SidebarMenuButton >
          <Users className="mr-2 text-[#93764F]" />
          <h1 className="text-3xl text-[#93764F]">EducAPP</h1>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent className="bg-[#02060A]">
        <SidebarGroup>
          <SidebarMenu>
            
            {/* --- SECCIÓN ADMIN --- */}
            {role === "ADMIN" && (
              <>
                <SidebarMenuItem>
                  <Link href="/usuarios">
                    <SidebarMenuButton>
                      <Users className="text-[#93764F]"/>
                      <span className="text-xl text-[#93764F]">Usuarios</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/materias">
                    <SidebarMenuButton>
                      <BookOpenText className="text-[#93764F]"/>
                      <span className="text-xl text-[#93764F]">Materias</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </>
            )}

            {/* --- SECCIÓN ESCUELA (Shared: Admin y Administrativo) --- */}
            {(role === "ADMIN" || role === "ADMINISTRATIVO") && (
              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild className="w-full">
                    <SidebarMenuButton>
                      <University className="text-[#93764F]"/>
                      <span className="text-xl text-[#93764F]">Escuela</span>
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <Link href="/grupos">
                          <SidebarMenuSubButton className="text-[#93764F]">Grupos</SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <Link href="/semestre">
                          <SidebarMenuSubButton className="text-[#93764F]">Semestres</SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )}

            {/* --- SECCIÓN DOCENTE --- */}
            {role === "DOCENTE" && (
              <>
                <SidebarMenuItem>
                  <Link href="/docente/calificaciones">
                    <SidebarMenuButton>
                      <GraduationCap className="text-[#93764F]"/>
                      <span className="text-xl text-[#93764F]">Calificaciones</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/docente/horario">
                    <SidebarMenuButton>
                      <Calendar className="text-[#93764F]"/>
                      <span className="text-xl text-[#93764F]">Mi Horario</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </>
            )}

            {/* --- SECCIÓN ALUMNO --- */}
            {role === "ALUMNO" && (
              <>
                <SidebarMenuItem>
                  <Link href="/alumno/datos-alumno">
                    <SidebarMenuButton>
                      <UserCircle className="text-[#93764F]"/>
                      <span className="text-xl text-[#93764F]">Mis Datos</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/alumno/calificaciones">
                    <SidebarMenuButton>
                      <GraduationCap className="text-[#93764F]"/>
                      <span className="text-xl text-[#93764F]">Mis Notas</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/alumno/horario">
                    <SidebarMenuButton>
                      <Calendar className="text-[#93764F]"/>
                      <span className="text-xl text-[#93764F]">Horario Clase</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </>
            )}

          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-[#0c1c2b] dark:bg-slate-900">
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center p-2">
            <SidebarTrigger className="text-[#93764F]"/>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}