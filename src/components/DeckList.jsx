import { useEffect, useState } from 'react'
import { Plus, Presentation, Trash2, Loader2 } from 'lucide-react'
import { api } from '../api.js'

export default function DeckList({ onOpen }) {
  const [decks, setDecks] = useState(null)
  const [title, setTitle] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)

  const load = () => api.listDecks().then((r) => setDecks(r.decks)).catch((e) => setError(e.message))
  useEffect(() => {
    load()
  }, [])

  async function create(e) {
    e.preventDefault()
    setCreating(true)
    setError(null)
    try {
      const { deck } = await api.createDeck(title.trim() || 'Untitled deck')
      onOpen(deck.id)
    } catch (e2) {
      setError(e2.message)
      setCreating(false)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this deck and its images?')) return
    await api.deleteDeck(id)
    load()
  }

  return (
    <div className="min-h-screen max-w-5xl mx-auto p-8">
      <div className="flex items-center gap-3 mb-2">
        <Presentation className="w-7 h-7 text-amber-400" />
        <h1 className="text-2xl font-semibold">slider</h1>
      </div>
      <p className="text-zinc-400 mb-8">AI slide decks, painted by Nano Banana Pro.</p>

      <form onSubmit={create} className="flex gap-2 mb-8">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New deck title…"
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 outline-none focus:border-amber-400/60"
        />
        <button
          disabled={creating}
          className="flex items-center gap-2 bg-amber-400 text-zinc-950 font-medium px-4 py-2 rounded-lg hover:bg-amber-300 disabled:opacity-50"
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          New deck
        </button>
      </form>

      {error && <div className="text-red-400 mb-4">{error}</div>}

      {!decks ? (
        <div className="text-zinc-500">Loading…</div>
      ) : decks.length === 0 ? (
        <div className="text-zinc-500">No decks yet. Create your first one above.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((d) => (
            <div
              key={d.id}
              className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer hover:border-zinc-600 transition-colors"
              onClick={() => onOpen(d.id)}
            >
              <div className="aspect-video bg-zinc-800 flex items-center justify-center overflow-hidden">
                {d.thumb ? (
                  <img src={d.thumb} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Presentation className="w-8 h-8 text-zinc-700" />
                )}
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium truncate">{d.title}</div>
                  <div className="text-xs text-zinc-500">
                    {d.slideCount} slide{d.slideCount === 1 ? '' : 's'} · {new Date(d.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    remove(d.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 p-1"
                  title="Delete deck"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
