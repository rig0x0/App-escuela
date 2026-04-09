import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function HoverForgotPassword() {
  return (
    <HoverCard>
      <HoverCardTrigger delay={10} closeDelay={100} render={<Button variant="link">Olvidaste tu contraseña?</Button>} />
      <HoverCardContent className="flex w-64 flex-col gap-0.5">
        <div>Pongase en contacto con el administrador </div>
        <div className="mt-1 text-xs text-muted-foreground">
          admin@example.com
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
