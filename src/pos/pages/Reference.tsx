import { useState } from 'react'
import { useToast } from '../../context/ToastContext'
import { usePos } from '../store/PosContext'

export function PosReferencePage() {
  const { articles, updateArticle } = usePos()
  const { notify } = useToast()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  function startEdit(id: string) {
    const article = articles.find((a) => a.id === id)
    if (!article) return
    setEditingId(id)
    setTitle(article.title)
    setBody(article.body)
  }

  async function save() {
    if (!editingId) return
    try {
      await updateArticle(editingId, { title: title.trim(), body: body.trim() })
      notify('Article saved')
      setEditingId(null)
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not save article')
    }
  }

  return (
    <div>
      <div>
        <h1 className="text-3xl">Flower reference</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--pos-muted)' }}>
          Meanings and color notes for staff answering Messenger chats. Seed CMS — editable in demo.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {articles.map((article) => (
          <article key={article.id} className="pos-surface p-5">
            {editingId === article.id ? (
              <div className="grid gap-3">
                <label className="pos-label">
                  Title
                  <input className="pos-field mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>
                <label className="pos-label">
                  Body
                  <textarea className="pos-field mt-1 min-h-40" value={body} onChange={(e) => setBody(e.target.value)} />
                </label>
                <div className="flex gap-2">
                  <button type="button" className="pos-btn pos-btn-primary" onClick={save}>
                    Save
                  </button>
                  <button type="button" className="pos-btn pos-btn-secondary" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--pos-muted)' }}>
                      {article.category}
                    </p>
                    <h2 className="mt-1 text-2xl">{article.title}</h2>
                  </div>
                  <button type="button" className="pos-btn pos-btn-secondary" onClick={() => startEdit(article.id)}>
                    Edit
                  </button>
                </div>
                <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: 'var(--pos-ink)' }}>
                  {article.body.split('\n\n').map((para) => (
                    <p key={para.slice(0, 24)}>{para}</p>
                  ))}
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
