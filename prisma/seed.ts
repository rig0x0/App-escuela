// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash('admin123*', salt)

  // 5.13.0 maneja perfectamente el upsert
  await prisma.usuario.upsert({
    where: { email: 'usuario@admin.com' },
    update: {}, 
    create: {
      email: 'usuario@admin.com',
      nombre: 'Administrador General',
      password: hashedPassword,
      tipo: 'ADMIN', 
      telefono: "0000000000"
    },
  })

  console.log('✅ Seed finalizado con éxito')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })