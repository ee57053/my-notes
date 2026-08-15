// ============================================================
//  prisma.config.ts  （プロジェクトのルートに置く）
//  Prisma 7 から、接続URLはこのファイルで管理します。
//  CLI（migrate など）はここのURLを読みます。
// ============================================================

import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
})
