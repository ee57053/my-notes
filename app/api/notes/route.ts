// ============================================================
//  app/api/notes/route.ts
//  URL: /api/notes
//
//  ここが「バックエンド」。ブラウザからは見えないサーバー側で動きます。
//  HTTPメソッド名（GET / POST）の関数をexportするだけでAPIになります。
// ============================================================

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ---- GET /api/notes ----
// メモを全件、新しい順に返す
export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(notes)
}

// ---- POST /api/notes ----
// 送られてきたデータで新しいメモを1件作る
export async function POST(request: Request) {
  // リクエストの本文（JSON）を取り出す
  const { title, body } = await request.json()

  // かんたんなバリデーション：タイトルが無ければ 400 エラーを返す
  if (!title || !title.trim()) {
    return NextResponse.json(
      { error: 'タイトルは必須です' },
      { status: 400 }
    )
  }

  // DBに1件作成
  const note = await prisma.note.create({
    data: {
      title: title.trim(),
      body: (body ?? '').trim(),
    },
  })

  // 作ったメモを 201 Created で返す
  return NextResponse.json(note, { status: 201 })
}
