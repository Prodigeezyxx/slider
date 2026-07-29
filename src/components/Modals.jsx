import { useEffect, useState } from 'react'
import { X, ImagePlus } from 'lucide-react'

// Read a File into a data:image/...;base64 string. Cap side to keep prompt tokens sane.
async function fileToDataUrl(file, maxSide = 1024) {
  const bmp = await createImageBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height))
  const w = Math.round(bmp.width * scale)
  const h = Math.round(bmp.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d').drawImage(bmp, 0, 0, w, h)
  return canvas.toDataURL('image/jpeg', 0.85)
}

// Reusable transient image picker: stores base64 data URLs in local state.
// Used by AgentModal + AIDeckModal (refs don't persist beyond the request).
export function RefImagePicker({ refs, setRefs, max = 6, label = 'Reference images (optional)' }) {
  const [error, setError] = useState(null)

  async function onFiles(e) {
    const files = [...(e.target.files || [])].filter((f) => f.type.startsWith('image/'))
    e.target.value = ''
    if (!files.length) return
    setError(null)
    try {
      const urls = await Promise.all(files.map((f) => fileToDataUrl(f)))
      setRefs([...refs, ...urls].slice(0, max))
    } catch (err) {
      setError(err.message || 'Could not read image')
    }
  }

  return (
    <div>
      <label className="text-xs text-zinc-500 uppercase tracking-wide">{label}</label>
      <div className="mt-1 flex flex-wrap gap-2">
        {refs.map((url, i) => (
          <div key={i} className="relative w-16 h-16 rounded overflow-hidden border border-zinc-800">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => setRefs(refs.filter((_, j) => j !== i))}
              className="absolute top-0 right-0 bg-black/70 text-white p-0.5 hover:bg-red-500"
              title="Remove"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {refs.length < max && (
          <label className="w-16 h-16 rounded border border-dashed border-zinc-700 hover:border-amber-400/60 flex items-center justify-center cursor-pointer text-zinc-500 hover:text-amber-300">
            <ImagePlus className="w-5 h-5" />
            <input type="file" accept="image/*" multiple onChange={onFiles} className="hidden" />
          </label>
        )}
      </div>
      {error && <div className="text-xs text-red-400 mt-1">{error}</div>}
    </div>
  )
}

export function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`bg-zinc-900 border border-zinc-700 rounded-xl p-5 max-h-[85vh] overflow-y-auto ${wide ? 'w-full max-w-2xl' : 'w-full max-w-md'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">{title}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function StyleModal({ deck, onSave, onClose }) {
  const [style, setStyle] = useState(deck.style || '')
  return (
    <Modal title="Deck style guide" onClose={onClose} wide>
      <p className="text-sm text-zinc-400 mb-3">
        This is prepended to every slide prompt. Describe look &amp; feel: palette, typography vibe, layout
        language, mood.
      </p>
      <textarea
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        rows={7}
        placeholder="e.g. Minimal dark slides, deep navy background, off-white text, one bold headline per slide, thin gold accent lines, generous whitespace, no clip art."
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm outline-none focus:border-amber-400/60"
      />
      <div className="flex justify-end mt-4">
        <button
          onClick={() => onSave(style)}
          className="bg-amber-400 text-zinc-950 font-medium px-4 py-2 rounded-lg hover:bg-amber-300"
        >
          Save style
        </button>
      </div>
    </Modal>
  )
}

export function ContextModal({ deck, onSave, onClose, uploadContext }) {
  const [items, setItems] = useState(deck.context || [])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  function persist(next) {
    setItems(next)
    onSave(next)
  }

  function addPasted() {
    if (!text.trim()) return
    persist([...items, { name: name.trim() || 'pasted-notes', text: text.trim().slice(0, 20000) }])
    setName('')
    setText('')
  }

  async function addFiles(e) {
    const files = [...e.target.files]
    e.target.value = ''
    if (!files.length) return
    const fd = new FormData()
    files.forEach((f) => fd.append('files', f))
    setBusy(true)
    setError(null)
    try {
      const { items: extracted } = await uploadContext(fd)
      persist([...items, ...extracted])
    } catch (e2) {
      setError(e2.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal title="Context & source material" onClose={onClose} wide>
      <p className="text-sm text-zinc-400 mb-3">
        Reference material for the deck. The AI outline writer grounds the slides in this. Upload .txt / .md /
        .pdf or paste text.
      </p>

      <div className="space-y-2 mb-4">
        {items.length === 0 && <div className="text-sm text-zinc-500">No context yet.</div>}
        {items.map((it, i) => (
          <div key={i} className="flex items-center justify-between gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2">
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{it.name}</div>
              <div className="text-xs text-zinc-500">{it.text.length.toLocaleString()} chars</div>
            </div>
            <button
              onClick={() => persist(items.filter((_, j) => j !== i))}
              className="text-zinc-500 hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <label className="block mb-4">
        <span className="text-sm text-zinc-400">{busy ? 'Extracting text…' : 'Upload files'}</span>
        <input
          type="file"
          multiple
          accept=".txt,.md,.markdown,.pdf,.csv,.json"
          onChange={addFiles}
          disabled={busy}
          className="mt-1 block w-full text-sm text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700"
        />
      </label>

      <div className="border-t border-zinc-800 pt-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (e.g. research-notes)"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm mb-2 outline-none focus:border-amber-400/60"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Paste notes, an article, an outline…"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm outline-none focus:border-amber-400/60"
        />
        {error && <div className="text-sm text-red-400 mt-2">{error}</div>}
        <div className="flex justify-end mt-2">
          <button
            onClick={addPasted}
            className="bg-zinc-800 px-4 py-2 rounded-lg text-sm hover:bg-zinc-700"
          >
            Add text
          </button>
        </div>
      </div>
    </Modal>
  )
}

export function AgentModal({ deck, agent, busy, onRun, onClose }) {
  const b = deck.brand || {}
  const [deckType, setDeckType] = useState('strategy')
  const [form, setForm] = useState({
    name: b.name || '',
    description: b.description || '',
    stats: b.stats || '',
    color: b.color || '#A21615',
    event: b.event || '',
    location: b.location || '',
    audiences: b.audiences || '',
    studio: b.studio || '',
  })
  const [logoFile, setLogoFile] = useState(null)
  const [refs, setRefs] = useState([])
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const types = Object.entries(agent.decks)

  const field = (label, key, placeholder, rows = 0) => (
    <div>
      <label className="text-xs text-zinc-500 uppercase tracking-wide">{label}</label>
      {rows > 0 ? (
        <textarea
          value={form[key]}
          onChange={set(key)}
          rows={rows}
          placeholder={placeholder}
          className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm outline-none focus:border-amber-400/60"
        />
      ) : (
        <input
          value={form[key]}
          onChange={set(key)}
          placeholder={placeholder}
          className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400/60"
        />
      )}
    </div>
  )

  return (
    <Modal title={agent.displayName} onClose={onClose} wide>
      <p className="text-sm text-zinc-400 mb-4">{agent.shortDescription}</p>

      <div className="flex gap-2 mb-4">
        {types.map(([key, t]) => (
          <button
            key={key}
            onClick={() => setDeckType(key)}
            className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
              deckType === key ? 'border-amber-400 bg-amber-400/10 text-amber-300' : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {field('Brand name', 'name', 'e.g. TSL Logistics Limited')}
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-wide">Brand colour</label>
          <div className="mt-1 flex gap-2">
            <input type="color" value={form.color} onChange={set('color')} className="w-10 h-9 rounded bg-zinc-950 border border-zinc-800" />
            <input value={form.color} onChange={set('color')} className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none" />
          </div>
        </div>
      </div>
      <div className="mt-3">{field('What they do (their own words)', 'description', 'Paste their About page paragraph verbatim…', 2)}</div>
      <div className="mt-3">{field('Credibility stats (real numbers only)', 'stats', 'e.g. 9 terminals · 500,000 MT throughput · 169 km pipeline · 0% product loss since inception', 2)}</div>
      <div className="mt-3">{field('Event / venue / dates / footprint', 'event', 'e.g. PSRG-Richardson HSSE Forum · 15–16 Sept 2026 · 3×3 m peninsula, 3 sides open')}</div>
      <div className="mt-3">{field('Event location (city, country)', 'location', 'e.g. Lagos, Nigeria · so people rendered on the stand match the real audience')}</div>
      <div className="mt-3">{field('Audiences (ranked primary first)', 'audiences', 'e.g. Clients & collaborators; regulators & institutional stakeholders; prospective talent')}</div>
      <div className="mt-3">{field('Delivery studio', 'studio', 'e.g. Floats Anywhere × RealmSpace')}</div>

      <div className="mt-3">
        <label className="text-xs text-zinc-500 uppercase tracking-wide">Official logo (goes top-right on every slide)</label>
        {deck.brand?.logo && !logoFile && (
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
            <img src={deck.brand.logo} alt="logo" className="h-6 bg-white rounded px-1" /> already attached — upload to replace
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files[0] || null)}
          className="mt-1 block w-full text-sm text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700"
        />
      </div>

      <div className="mt-3">
        <RefImagePicker refs={refs} setRefs={setRefs} label="Visual reference board (moodboard, past work, subjects) — optional" />
      </div>

      <p className="text-xs text-zinc-500 mt-4">
        Uses deck context ({deck.context?.length || 0} item{deck.context?.length === 1 ? '' : 's'}) as the source of truth. Planner
        writes all {agent.decks[deckType].count} slides, then Nano Banana Pro paints each one with the QA verifier loop. This
        replaces existing slides.
      </p>
      <div className="flex justify-end mt-4">
        <button
          disabled={!form.name.trim() || !form.location.trim() || busy}
          onClick={() => onRun({ agentId: agent.id, deckType, brand: form, logoFile, refs })}
          className="bg-amber-400 text-zinc-950 font-medium px-4 py-2 rounded-lg hover:bg-amber-300 disabled:opacity-50"
          title={!form.location.trim() ? 'Event location is required so the render casts real people, not stock ones' : ''}
        >
          {busy ? 'Working…' : `Build ${deckType} deck`}
        </button>
      </div>
    </Modal>
  )
}

export function AIDeckModal({ deck, busy, onGenerate, onClose }) {
  const [topic, setTopic] = useState('')
  const [count, setCount] = useState(8)
  const [refs, setRefs] = useState([])
  return (
    <Modal title="Generate a full deck with AI" onClose={onClose} wide>
      <p className="text-sm text-zinc-400 mb-3">
        Describe the deck. The AI writes slide prompts (grounded in your context material
        {deck.context?.length ? ` — ${deck.context.length} item${deck.context.length === 1 ? '' : 's'} attached` : ''}
        ), then Nano Banana Pro paints every slide. This replaces existing slides.
      </p>
      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        rows={4}
        placeholder="e.g. A pitch deck for a solar-powered water purification startup targeting East African municipalities"
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm outline-none focus:border-amber-400/60"
      />
      <div className="flex items-center gap-3 mt-3">
        <label className="text-sm text-zinc-400">Slides</label>
        <input
          type="number"
          min={2}
          max={20}
          value={count}
          onChange={(e) => setCount(Math.max(2, Math.min(20, Number(e.target.value) || 8)))}
          className="w-20 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none"
        />
      </div>
      <div className="mt-3">
        <RefImagePicker refs={refs} setRefs={setRefs} label="Reference images to guide the whole deck (optional)" />
      </div>
      <div className="flex justify-end mt-4">
        <button
          disabled={!topic.trim() || busy}
          onClick={() => onGenerate(topic.trim(), count, refs)}
          className="bg-amber-400 text-zinc-950 font-medium px-4 py-2 rounded-lg hover:bg-amber-300 disabled:opacity-50"
        >
          {busy ? 'Working…' : 'Build deck'}
        </button>
      </div>
    </Modal>
  )
}
