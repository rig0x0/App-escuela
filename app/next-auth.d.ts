import { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Se extiende el objeto 'user' dentro de la sesión
   */
  interface Session {
    user: {
      id: string
      role: string // 👈 Aquí declaramos nuestro campo
    } & DefaultSession["user"]
  }

  /**
   * También extendemos la interfaz User original
   */
  interface User {
    tipo?: string
  }
}

declare module "next-auth/jwt" {
  /**
   * Extendemos el JWT para que reconozca el rol cuando lo pasamos del token a la sesión
   */
  interface JWT {
    role?: string
  }
}