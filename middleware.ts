import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.tipo; // Obtenemos el rol/tipo del token

  const pathname = nextUrl.pathname;

  // 1. Definir rutas públicas
  const isPublicRoute = pathname === "/"; 
  
  // 2. Definir prefijos de rutas por rol
  const isDocenteRoute = pathname.startsWith("/docente");
  const isAlumnoRoute = pathname.startsWith("/alumno");
  
  // Rutas exclusivas de ADMIN
  const isOnlyAdminRoute = pathname.startsWith("/usuarios") || 
                           pathname.startsWith("/materias");

  // Rutas compartidas (Admin y Administrativo)
  const isSharedAdminRoute = pathname.startsWith("/grupos") || 
                             pathname.startsWith("/semestre") ||
                             pathname.startsWith("/grupos-gestion");

  // --- LÓGICA DE REDIRECCIÓN ---

  // CASO A: Usuario NO logueado intentando entrar a ruta privada
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // CASO B: Usuario logueado intentando entrar al Login (ruta pública "/")
  // Aquí es donde aplicamos la redirección inteligente por rol
  if (isLoggedIn && isPublicRoute) {
    let dashboardPath = "/dashboard"; // Ruta base por si acaso

    if (userRole === "ADMIN") dashboardPath = "/usuarios";
    else if (userRole === "ADMINISTRATIVO") dashboardPath = "/grupos";
    else if (userRole === "DOCENTE") dashboardPath = "/docente/horario";
    else if (userRole === "ALUMNO") dashboardPath = "/alumno/horario";

    return NextResponse.redirect(new URL(dashboardPath, nextUrl));
  }

  // --- PROTECCIÓN POR ROL (Prevención de accesos no autorizados) ---

  // Si no es ADMIN e intenta entrar a rutas de Admin
  if (isOnlyAdminRoute && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Si no es ADMIN ni ADMINISTRATIVO e intenta entrar a grupos/semestre
  if (isSharedAdminRoute && !(userRole === "ADMIN" || userRole === "ADMINISTRATIVO")) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Si intenta entrar a rutas de Docente y no lo es
  if (isDocenteRoute && userRole !== "DOCENTE") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Si intenta entrar a rutas de Alumno y no lo es
  if (isAlumnoRoute && userRole !== "ALUMNO") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Si pasa todas las validaciones, permitimos la respuesta y quitamos el caché
  const response = NextResponse.next();
  
  // Cache-Control para evitar que el botón "atrás" del navegador 
  // muestre páginas protegidas tras hacer logout
  if (!isLoggedIn) {
    response.headers.set('Cache-Control', 'no-store, max-age=0');
  }

  return response;
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};