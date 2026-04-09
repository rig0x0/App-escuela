import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HoverForgotPassword } from "./hover-password"

export function LoginCard() {
  return (
    <Card className="w-[450px] mb-4">
      <CardHeader className="items-center justify-center">
        <CardTitle className=" bg-red-100 text-center">Iniciar Sesion</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder al sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <HoverForgotPassword />
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Iniciar sesión
        </Button>
      </CardFooter>
    </Card>
  )
}
