import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  // 1. EL SECRET ES OBLIGATORIO: Asegúrate de tenerlo en tu .env
  secret: process.env.AUTH_SECRET,
  
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Buscamos al usuario en Prisma
        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email as string }
        });

        // Si no existe o no tiene password (usuarios de OAuth), rechazamos
        if (!user || !user.password) return null;

        // Comparamos el hash de la contraseña
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordCorrect) return null;

        // Retornamos el objeto que queremos que se guarde en el JWT
        return {
          id: user.id.toString(),
          name: user.nombre,
          email: user.email,
          tipo: user.tipo, // Asegúrate de usar el mismo nombre que en tu interfaz
        };
      }
    })
  ],
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      // 'user' aquí es lo que devuelve el authorize() de Prisma
      token.id = user.id;
      token.tipo = user.tipo; // Guardamos 'tipo' en el token
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;
      session.user.tipo = token.tipo as string; // Pasamos 'tipo' a la sesión
    }
    return session;
  },
},
  pages: {
    signIn: "/", // Donde tienes tu LoginCard
  },
  // Recomendado: Usar estrategia de JWT para sesiones
  session: {
    strategy: "jwt",
  }
})