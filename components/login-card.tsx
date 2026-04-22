"use client"

import { useActionState } from "react"
import { loginAction } from "@/app/actions/auth-actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HoverForgotPassword } from "./hover-password"
import { Loader2 } from "lucide-react"

export function LoginCard() {
  // useActionState recibe la función action y el estado inicial
  // 'pending' reemplaza tu 'loading' manual
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <Card className="w-[450px] mb-4">
      <CardHeader className="items-center justify-center">
        <CardTitle className="text-center w-full py-2 rounded-t-md">
          Iniciar Sesión
        </CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder al sistema.
        </CardDescription>
      </CardHeader>
      
      {/* Usamos directamente formAction aquí */}
      <form action={formAction}>
        <CardContent>
          <div className="flex flex-col gap-6">
            
            {/* Mensaje de Error: Accedemos a state.error porque el Action devuelve un objeto */}
            {state?.error && (
              <div className="bg-destructive/15 p-3 rounded-md text-destructive text-sm text-center font-medium">
                {state.error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <HoverForgotPassword />
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                disabled={isPending}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2 pt-5">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validando...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}