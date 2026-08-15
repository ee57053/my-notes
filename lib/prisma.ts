// ============================================================
//  lib/prisma.ts  （Prisma 6 版 — 選択肢A）
//  アダプターは不要。import も new PrismaClient() だけ。
//
//  接続URLは .env の DATABASE_URL を自動で読むので、
//  ここには書かなくてOKです。
// ============================================================

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
