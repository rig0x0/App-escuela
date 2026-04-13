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
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Users } from "lucide-react"
import Link from "next/link"

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
            <SidebarMenuItem>
              <SidebarMenuAction className="peer-data-[active=true]/menu-button:opacity-100" />
            </SidebarMenuItem>
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