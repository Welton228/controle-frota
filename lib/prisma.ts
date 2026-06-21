import { PrismaClient } from "@prisma/client";

// Evita múltiplas instâncias em desenvolvimento
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"], // Loga apenas erros para não poluir o terminal
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;