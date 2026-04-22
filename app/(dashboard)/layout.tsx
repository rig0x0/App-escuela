import { AppSidebar } from "@/components/app-sidebar"
import Navbar from "@/components/navbar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  // Mapeamos los datos de la sesión al formato que espera tu Navbar
  const userData = session?.user ? {
    nombre: session.user.name || "",
    email: session.user.email || "",
    tipo: session.user.tipo || "" // Aquí usamos 'role' que extendimos en los tipos
  } : null;

  // Si por algún milagro el middleware fallara, esto es el doble candado
  if (!session) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      {/* 1. Definimos la altura máxima de la pantalla para el contenedor global */}
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar role={session?.user?.tipo} />

        {/* 2. Este contenedor también ocupa toda la altura pero sin scroll propio */}
        <div className="flex flex-col flex-1 h-full overflow-hidden">

          {/* 3. El Navbar se queda en su sitio (top) */}
          <Navbar user={userData} />

          {/* 4. El main es el ÚNICO que tiene permiso de scrollear */}
          <main className="flex-1 overflow-y-auto container mx-auto  bg-slate-50 dark:bg-transparent">
            {children}
          </main>

        </div>
      </div>
    </SidebarProvider>
  )
}