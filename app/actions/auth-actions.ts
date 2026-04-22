// app/actions/auth-actions.ts
"use server"
import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    // IMPORTANTE: redirect: true para que Auth.js maneje la redirección
    // según el middleware que ya configuramos.
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/", // El middleware se encargará de mandarlos a su ruta por rol
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Correo o contraseña incorrectos." };
        default:
          return { error: "Algo salió mal en el servidor." };
      }
    }
    // IMPORTANTE: hay que re-lanzar el error para que la redirección funcione
    throw error;
  }
}