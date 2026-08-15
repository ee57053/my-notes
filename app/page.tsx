'use client'

// ============================================================
//  メモ帳アプリ — Step 3: 編集機能（Update / PATCH）を追加
//
//  Step 2 からの追加点は「編集まわり」だけ:
//   - editingId  : 今どのメモを編集中かを覚える state
//   - editTitle / editBody : 編集中の入力値
//   - startEdit / cancelEdit / saveEdit の3関数
//   - 一覧の map の中で「編集中のメモだけ入力欄に切り替え」
//
//  これで CRUD の C・R・U・D が全部そろいます！
// ============================================================

import { useState, useEffect } from 'react'

type Note = {
  id: number
  title: string
  body: string
  createdAt: string
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(true)

  // ---- 編集用の state（今回の追加分）----
  const [editingId, setEditingId] = useState<number | null>(null) // 編集中のメモID
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')

  useEffect(() => {
    loadNotes()
  }, [])

  async function loadNotes() {
    setLoading(true)
    const res = await fetch('/api/notes')
    const data = await res.json()
    setNotes(data)
    setLoading(false)
  }

  async function addNote() {
    if (!title.trim()) return
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body }),
    })
    setTitle('')
    setBody('')
    loadNotes()
  }

  async function deleteNote(id: number) {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' })
    loadNotes()
  }

  // ---- 編集開始: そのメモのIDと現在値を記憶する ----
  function startEdit(note: Note) {
    setEditingId(note.id)
    setEditTitle(note.title)
    setEditBody(note.body)
  }

  // ---- 編集キャンセル: 何も保存せず通常表示に戻す ----
  function cancelEdit() {
    setEditingId(null)
    setEditTitle('')
    setEditBody('')
  }

  // ---- 編集を保存: PATCH で更新 → 編集終了 → 再取得 ----
  async function saveEdit(id: number) {
    if (!editTitle.trim()) return
    await fetch(`/api/notes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, body: editBody }),
    })
    setEditingId(null)
    loadNotes()
  }

  return (
    <main style={styles.main}>
      <h1 style={styles.h1}>📝 My Notes</h1>
      <p style={styles.count}>
        {loading ? '読み込み中...' : `${notes.length} 件のメモ`}
      </p>

      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          style={styles.textarea}
          placeholder="内容を入力..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button style={styles.addButton} onClick={addNote} disabled={!title.trim()}>
          メモを追加
        </button>
      </div>

      <div style={styles.list}>
        {loading ? (
          <p style={styles.empty}>読み込み中...</p>
        ) : notes.length === 0 ? (
          <p style={styles.empty}>まだメモがありません。上から追加してみましょう！</p>
        ) : (
          notes.map((note) =>
            // ★ 編集中のメモかどうかで表示を切り替える
            editingId === note.id ? (
              // ---- 編集モード: 入力欄を表示 ----
              <div key={note.id} style={styles.noteEditing}>
                <input
                  style={styles.editInput}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  autoFocus
                />
                <textarea
                  style={styles.editTextarea}
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                />
                <div style={styles.editButtons}>
                  <button
                    style={styles.saveButton}
                    onClick={() => saveEdit(note.id)}
                    disabled={!editTitle.trim()}
                  >
                    保存
                  </button>
                  <button style={styles.cancelButton} onClick={cancelEdit}>
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              // ---- 通常モード: テキストを表示 ----
              <div key={note.id} style={styles.note}>
                <div style={styles.noteHeader}>
                  <h3 style={styles.noteTitle}>{note.title}</h3>
                  <div style={styles.noteActions}>
                    <button style={styles.editButton} onClick={() => startEdit(note)}>
                      編集
                    </button>
                    <button style={styles.deleteButton} onClick={() => deleteNote(note.id)}>
                      削除
                    </button>
                  </div>
                </div>
                {note.body && <p style={styles.noteBody}>{note.body}</p>}
              </div>
            )
          )
        )}
      </div>
    </main>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  main: { maxWidth: 600, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' },
  h1: { fontSize: 28, marginBottom: 4 },
  count: { color: '#888', fontSize: 14, marginBottom: 24 },
  form: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 },
  input: { padding: '10px 12px', fontSize: 16, borderRadius: 8, border: '1px solid #ddd' },
  textarea: { padding: '10px 12px', fontSize: 14, borderRadius: 8, border: '1px solid #ddd', minHeight: 80, resize: 'vertical', fontFamily: 'inherit' },
  addButton: { padding: '10px', fontSize: 15, fontWeight: 600, color: '#fff', background: '#0070f3', border: 'none', borderRadius: 8, cursor: 'pointer' },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  empty: { color: '#aaa', textAlign: 'center', padding: '40px 0' },
  note: { padding: '14px 16px', borderRadius: 10, background: '#faf8f2', border: '1px solid #eee' },
  noteEditing: { padding: '14px 16px', borderRadius: 10, background: '#fff', border: '2px solid #0070f3' },
  noteHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  noteTitle: { fontSize: 16, margin: 0 },
  noteActions: { display: 'flex', gap: 6, flexShrink: 0 },
  editButton: { fontSize: 12, color: '#0070f3', background: 'transparent', border: '1px solid #b3d4fc', borderRadius: 6, padding: '3px 10px', cursor: 'pointer' },
  deleteButton: { fontSize: 12, color: '#c00', background: 'transparent', border: '1px solid #f0c0c0', borderRadius: 6, padding: '3px 10px', cursor: 'pointer' },
  noteBody: { fontSize: 14, color: '#555', marginTop: 6, marginBottom: 0, whiteSpace: 'pre-wrap' },
  editInput: { width: '100%', padding: '8px 10px', fontSize: 15, borderRadius: 6, border: '1px solid #0070f3', marginBottom: 6, boxSizing: 'border-box' },
  editTextarea: { width: '100%', padding: '8px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #0070f3', minHeight: 60, resize: 'vertical', fontFamily: 'inherit', marginBottom: 8, boxSizing: 'border-box' },
  editButtons: { display: 'flex', gap: 6 },
  saveButton: { fontSize: 13, fontWeight: 600, color: '#fff', background: '#00a862', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer' },
  cancelButton: { fontSize: 13, color: '#666', background: '#f0f0f0', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer' },
}
