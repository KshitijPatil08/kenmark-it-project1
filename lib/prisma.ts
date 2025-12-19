import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    const url = process.env.DATABASE_URL;
    if (!url) {
        throw new Error('DATABASE_URL is not defined');
    }

    return new PrismaClient({
        datasourceUrl: url,
        log: ['query', 'error', 'warn'],
    } as any)
}

const globalForPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
