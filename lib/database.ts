import { PrismaClient } from '@prisma/client'

export let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else if ('prisma' in globalThis) {
  prisma = (globalThis as any).prisma
} else {
  prisma = new PrismaClient()
  ;(globalThis as any).prisma = prisma
}
