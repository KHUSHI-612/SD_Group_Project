import type { Prisma, PrismaClient } from "@prisma/client";

export type DBTransactionClient = PrismaClient | Prisma.TransactionClient;
