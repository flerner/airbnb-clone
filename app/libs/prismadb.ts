import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}
//we do this because next instances a lot of PrismaClient by default and throws a warning for the hot reload
const client = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client

export default client
