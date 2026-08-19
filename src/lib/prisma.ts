import { PrismaClient } from '@prisma/client'

let prismaClient: any = null

if (process.env.NODE_ENV !== 'production') {
  // Development: use better-sqlite3 adapter (native). It's a dev-only dependency.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
  const adapter = new PrismaBetterSqlite3({ url: './dev.db' })
  prismaClient = new PrismaClient({ adapter } as any)
} else {
  // Production: prefer a remote DATABASE_URL (postgres/mysql). If provided
  // and not a file: URL, construct PrismaClient normally. If no suitable
  // DATABASE_URL is present, export a proxy that throws a clear runtime error
  // so builds succeed on platforms that don't install devDependencies.
  const dbUrl = process.env.DATABASE_URL
  if (dbUrl) {
    if (dbUrl.startsWith('file:')) {
      // Try to load the sqlite adapter if available. In CI/prod where
      // devDependencies are not installed, this will throw and we fallback
      // to the proxy to avoid build-time crashes.
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
        const adapter = new PrismaBetterSqlite3({ url: dbUrl.replace('file:', '') || './dev.db' })
        prismaClient = new PrismaClient({ adapter } as any)
      } catch (e) {
        const message = `Prisma sqlite adapter not available in this environment. To deploy, set a non-file DATABASE_URL (e.g. Postgres) or install @prisma/adapter-better-sqlite3 as a production dependency.`
        prismaClient = new Proxy({}, { get() { throw new Error(message) } })
      }
    } else {
      prismaClient = new PrismaClient()
    }
  } else {
    const message = `Prisma client not configured for production. Set a non-file DATABASE_URL (e.g. a Postgres URL) or move @prisma/adapter-better-sqlite3 into dependencies.`
    prismaClient = new Proxy({}, {
      get() {
        throw new Error(message)
      }
    })
  }
}

const globalForPrisma = global as unknown as { prisma: typeof prismaClient }

export const prisma = globalForPrisma.prisma || prismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
