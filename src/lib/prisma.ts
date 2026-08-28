import path from 'path';

let PrismaClient: any
try {
  const pkg = require('@prisma/client')
  PrismaClient = pkg.PrismaClient ?? pkg.default ?? pkg
} catch (e) {
  PrismaClient = undefined
}

let prismaClient: any = null

function getSqliteAdapter(dbUrl?: string) {
  const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
  let rawPath = (dbUrl || './dev.db').replace(/^file:/, '').trim()
  if (!rawPath) rawPath = './dev.db'
  const resolvedPath = path.isAbsolute(rawPath) ? rawPath : path.join(process.cwd(), rawPath)
  return new PrismaBetterSqlite3({ url: resolvedPath })
}

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db'

try {
  if (dbUrl.startsWith('file:')) {
    const adapter = getSqliteAdapter(dbUrl)
    prismaClient = new PrismaClient({ adapter } as any)
  } else {
    prismaClient = new PrismaClient()
  }
} catch (error) {
  console.warn('Prisma initialization fallback:', error)
  try {
    const adapter = getSqliteAdapter('./dev.db')
    prismaClient = new PrismaClient({ adapter } as any)
  } catch (err: any) {
    prismaClient = new Proxy({}, {
      get() {
        throw new Error(`Prisma client failed to initialize: ${err?.message || err}`)
      }
    })
  }
}

const globalForPrisma = global as unknown as { prisma: typeof prismaClient }

export const prisma = globalForPrisma.prisma || prismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
