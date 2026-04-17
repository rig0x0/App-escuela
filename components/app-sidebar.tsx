import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { BookOpenText, ChevronRight, University, Users } from "lucide-react"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"


export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-6 bg-green-100">
        <SidebarMenuButton >
          <Users className="mr-2 " />
          <h1 className="text-3xl">EducAPP</h1>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className="bg-orange-100">
        <SidebarGroup >
          <SidebarMenu>
            <SidebarMenuItem >
              <Link href="/usuarios">
                <SidebarMenuButton >
                  <Users />
                  <span className="text-xl">Usuarios</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem >
              <Link href="/materias">
                <SidebarMenuButton >
                  <BookOpenText />
                  <span className="text-xl">Materias</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <Collapsible>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild className="w-full">
                  <SidebarMenuButton>
                    <University />
                  <span className="text-xl">Escuela</span>
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <Link href="/grupos">
                        <SidebarMenuSubButton>Grupos</SidebarMenuSubButton>
                      </Link>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <Link href="/semestre">
                      <SidebarMenuSubButton>Semestres</SidebarMenuSubButton>
                      </Link>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup >
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  )
}