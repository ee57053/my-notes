// ============================================================
//  app/api/notes/[id]/route.ts  （Next.js 15 対応版）
//  URL: /api/notes/123  ← [id] の部分が動的に変わる
//
//  ★ Next.js 15 からの変更点:
//    params が「Promise」になりました。
//    そのため params.id と直接触る前に、await params で
//    中身を取り出す必要があります。
// ============================================================

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// params は Promise<{ id: string }> になった
type Params = { params: Promise<{ id: string }> }

// ---- DELETE /api/notes/:id ----
// 指定IDのメモを1件削除する
export async function DELETE(request: Request, { params }: Params) {
  // ★ まず await で params の中身を取り出す
  const { id } = await params
  const noteId = Number(id) // URLの id は文字列なので数値に変換

  await prisma.note.delete({
    where: { id: noteId },
  })

  return NextResponse.json({ ok: true })
}

// ---- PATCH /api/notes/:id ----
// 指定IDのメモを更新する
export async function PATCH(request: Request, { params }: Params) {
  // ★ ここも同じく await params
  const { id } = await params
  const noteId = Number(id)

  const data = await request.json()

  const note = await prisma.note.update({
    where: { id: noteId },
    data, // { title } や { body } など、送られてきた項目だけ更新される
  })

  return NextResponse.json(note)
}
