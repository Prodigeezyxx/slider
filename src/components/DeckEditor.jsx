import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft, Sparkles, Palette, Paperclip, Play, Trash2, Copy, ChevronUp, ChevronDown,
  ImageIcon, Loader2, Plus, Wand2, FileArchive, FileDown, Bot, BadgeCheck, AlertTriangle, Coins,
} from 'lucide-react'
import { api } from '../api.js'
import { exportPdf, exportZip } from '../export.js'
import { StyleModal, ContextModal, AIDeckModal, AgentModal } from './Modals.jsx'
import PresentMode from './PresentMode.jsx'

const uid = () => crypto.randomUUID().replace(/-/g, '').slice(0, 12)
const ASPECTS = ['16:9', '4:3', '3:2', '1:1', '9:16']

export default function DeckEditor({ deckId, onBack }) {
  const [deck, setDeck] = useState(null)
  const [currentId, setCurrentId] = useState(null)
  const [generating, setGenerating] = useState(new Set())
  const [modal, setModal] = useState(null) // 'style' | 'context' | 'ai' | 'agent'
  const [presenting, setPresenting] = useState(false)
  const [bulk, setBulk] = useState(null) // { done, total, label }
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState(null)
  const [agents, setAgents] = useState([])
  const [usage, setUsage] = useState(null)
  const [usageOpen, setUsageOpen] = useState(false)

  const deckRef = useRef(deck)
  useEffect(() => {
    deckRef.current = deck
  }, [deck])

  function refreshUsage() {
    api.usage(deckId).then(setUsage).catch(() => {})
  }

  useEffect(() => {
    api
      .getDeck(deckId)
      .then(({ deck }) => {
        setDeck(deck)
        setCurrentId(deck.slides[0]?.id || null)
      })
      .catch((e) => setError(e.message))
    api.agents().then((r) => setAgents(r.agents)).catch(() => {})
    refreshUsage()
  }, [deckId])

  // Apply a mutation, update local state, persist to disk.
  function update(mutator) {
    setDeck((d) => {
      const next = structuredClone(d)
      mutator(next)
      api.saveDeck(next).catch((e) => setError(e.message))
      return next
    })
  }

  // ---------- Slide operations ----------

  function addSlide() {
    const slide = { id: uid(), title: `Slide ${(deck?.slides.length || 0) + 1}`, prompt: '', notes: '', image: null, status: 'idle' }
    update((d) => d.slides.push(slide))
    setCurrentId(slide.id)
  }

  function removeSlide(id) {
    update((d) => {
      d.slides = d.slides.filter((s) => s.id !== id)
    })
    if (currentId === id) {
      const rest = deckRef.current.slides.filter((s) => s.id !== id)
      setCurrentId(rest[0]?.id || null)
    }
  }

  function duplicateSlide(id) {
    update((d) => {
      const i = d.slides.findIndex((s) => s.id === id)
      const copy = { ...d.slides[i], id: uid(), title: `${d.slides[i].title} (copy)` }
      d.slides.splice(i + 1, 0, copy)
    })
  }

  function moveSlide(id, dir) {
    update((d) => {
      const i = d.slides.findIndex((s) => s.id === id)
      const j = i + dir
      if (i < 0 || j < 0 || j >= d.slides.length) return
      ;[d.slides[i], d.slides[j]] = [d.slides[j], d.slides[i]]
    })
  }

  // ---------- Generation ----------

  async function generateSlide(slide) {
    setGenerating((s) => new Set(s).add(slide.id))
    setError(null)
    try {
      await api.saveDeck(deckRef.current) // make sure the server has the latest prompt
      const { slide: updated } = await api.generate(deckRef.current.id, slide.id, slide.prompt)
      update((d) => {
        const i = d.slides.findIndex((s) => s.id === slide.id)
        if (i >= 0) d.slides[i] = { ...d.slides[i], ...updated, imageT: Date.now() }
      })
    } catch (e) {
      setError(e.message)
      update((d) => {
        const s = d.slides.find((x) => x.id === slide.id)
        if (s) {
          s.status = 'error'
          s.error = e.message
        }
      })
    } finally {
      setGenerating((s) => {
        const next = new Set(s)
        next.delete(slide.id)
        return next
      })
      refreshUsage()
    }
  }

  async function addSlideRefs(slideId, files) {
    if (!files || !files.length) return
    const fd = new FormData()
    for (const f of files) fd.append('files', f)
    try {
      const { slide: updated } = await api.uploadSlideRefs(deckRef.current.id, slideId, fd)
      update((d) => {
        const s = d.slides.find((x) => x.id === slideId)
        if (s) s.refs = updated.refs
      })
    } catch (e) {
      setError(e.message)
    }
  }

  async function removeSlideRef(slideId, refPath) {
    try {
      await api.deleteSlideRef(deckRef.current.id, slideId, refPath)
      update((d) => {
        const s = d.slides.find((x) => x.id === slideId)
        if (s) s.refs = (s.refs || []).filter((r) => r.path !== refPath)
      })
    } catch (e) {
      setError(e.message)
    }
  }

  async function generateMissing() {
    const targets = deckRef.current.slides.filter((s) => !s.image)
    if (!targets.length) return
    setBulk({ done: 0, total: targets.length })
    for (const s of targets) {
      await generateSlide(s)
      setBulk((b) => ({ done: b.done + 1, total: b.total }))
    }
    setBulk(null)
  }

  async function buildDeck(topic, count, refs) {
    setModal(null)
    setError(null)
    setBulk({ done: 0, total: 1, label: 'Planning outline…' })
    try {
      const { slides } = await api.outline(deckRef.current.id, topic, count, refs)
      const newSlides = slides.map((s) => ({ id: uid(), title: s.title, prompt: s.prompt, notes: s.notes, image: null, status: 'idle' }))
      const next = { ...deckRef.current, slides: newSlides }
      setDeck(next)
      await api.saveDeck(next)
      setCurrentId(newSlides[0]?.id || null)
      setBulk({ done: 0, total: newSlides.length })
      for (const s of newSlides) {
        await generateSlide(s)
        setBulk((b) => ({ done: b.done + 1, total: b.total }))
      }
    } catch (e) {
      setError(e.message)
    }
    setBulk(null)
  }

  async function buildAgentDeck({ agentId, deckType, brand, logoFile, refs }) {
    setModal(null)
    setError(null)
    setBulk({ done: 0, total: 1, label: 'Planning deck…' })
    try {
      if (logoFile) {
        const fd = new FormData()
        fd.append('role', 'logo')
        fd.append('files', logoFile)
        await api.uploadAssets(deckRef.current.id, fd)
      }
      const { deck: planned } = await api.planAgent({ deckId: deckRef.current.id, agentId, deckType, brand, refs })
      setDeck(planned)
      deckRef.current = planned
      refreshUsage()
      setCurrentId(planned.slides[0]?.id || null)
      setBulk({ done: 0, total: planned.slides.length })
      for (const s of planned.slides) {
        await generateSlide(s)
        setBulk((b) => ({ done: b.done + 1, total: b.total }))
      }
    } catch (e) {
      setError(e.message)
    }
    setBulk(null)
  }

  // ---------- Export ----------

  async function onExport(kind) {
    setExporting(true)
    setError(null)
    try {
      if (kind === 'pdf') await exportPdf(deckRef.current)
      else await exportZip(deckRef.current)
    } catch (e) {
      setError(e.message)
    } finally {
      setExporting(false)
    }
  }

  if (!deck) {
    return (
      <div className="h-screen flex items-center justify-center text-zinc-500">
        {error ? <span className="text-red-400">{error}</span> : <Loader2 className="w-6 h-6 animate-spin" />}
      </div>
    )
  }

  const current = deck.slides.find((s) => s.id === currentId) || null
  const hasImages = deck.slides.some((s) => s.image)
  const busy = generating.size > 0 || !!bulk

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800 bg-zinc-900">
        <button onClick={onBack} className="p-2 text-zinc-400 hover:text-zinc-100" title="Back to decks">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <input
          value={deck.title}
          onChange={(e) => setDeck({ ...deck, title: e.target.value })}
          onBlur={() => api.saveDeck(deckRef.current).catch((e) => setError(e.message))}
          className="bg-transparent font-medium px-2 py-1 rounded outline-none focus:bg-zinc-800 w-56"
        />
        <div className="flex-1" />

        <select
          value={deck.aspectRatio}
          onChange={(e) => update((d) => (d.aspectRatio = e.target.value))}
          className="bg-zinc-800 rounded-lg px-2 py-1.5 text-sm outline-none"
          title="Aspect ratio (applies to newly generated slides)"
        >
          {ASPECTS.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
        <select
          value={deck.resolution}
          onChange={(e) => update((d) => (d.resolution = e.target.value))}
          className="bg-zinc-800 rounded-lg px-2 py-1.5 text-sm outline-none"
          title="Resolution (applies to newly generated slides)"
        >
          {['1K', '2K', '4K'].map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>

        <button onClick={() => setModal('style')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-zinc-800 hover:bg-zinc-700" title="Deck style guide">
          <Palette className="w-4 h-4" /> Style
        </button>
        <button onClick={() => setModal('context')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-zinc-800 hover:bg-zinc-700" title="Context & source material">
          <Paperclip className="w-4 h-4" /> Context{deck.context?.length ? ` (${deck.context.length})` : ''}
        </button>
        <button onClick={() => setModal('ai')} disabled={busy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50" title="Quick AI outline -> full deck">
          <Sparkles className="w-4 h-4" /> AI deck
        </button>
        {agents.length > 0 && (
          <button onClick={() => setModal('agent')} disabled={busy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-amber-400 text-zinc-950 font-medium hover:bg-amber-300 disabled:opacity-50" title="Run an agent spec (planner + painter + verifier)">
            <Bot className="w-4 h-4" /> Agent
          </button>
        )}
        <button onClick={generateMissing} disabled={busy || !deck.slides.some((s) => !s.image)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50" title="Generate all slides that have no image yet">
          <Wand2 className="w-4 h-4" /> Generate missing
        </button>
        <button onClick={() => onExport('zip')} disabled={exporting || !hasImages} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50" title="Export PNG zip">
          <FileArchive className="w-4 h-4" />
        </button>
        <button onClick={() => onExport('pdf')} disabled={exporting || !hasImages} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50" title="Export PDF">
          <FileDown className="w-4 h-4" />
        </button>
        <button onClick={() => setPresenting(true)} disabled={!hasImages} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50" title="Present">
          <Play className="w-4 h-4" /> Present
        </button>

        {usage && (
          <div className="relative">
            <button
              onClick={() => setUsageOpen((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-zinc-800 hover:bg-zinc-700 tabular-nums"
              title="OpenRouter credit usage"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              ${usage.deck.total.toFixed(3)}
              <span className="text-zinc-500">· all ${usage.allTime.total.toFixed(2)}</span>
            </button>
            {usageOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-xl z-30">
                <div className="text-sm font-medium mb-2">Credit usage</div>
                <div className="text-xs text-zinc-400 space-y-1 mb-3">
                  <div className="flex justify-between"><span>This deck</span><span className="tabular-nums">${usage.deck.total.toFixed(4)}</span></div>
                  <div className="flex justify-between"><span>All time</span><span className="tabular-nums">${usage.allTime.total.toFixed(4)}</span></div>
                  {Object.entries(usage.deck.byKind).map(([k, v]) => (
                    <div key={k} className="flex justify-between"><span className="text-zinc-500">· {k} ({usage.deck.calls} calls)</span><span className="tabular-nums">${v.toFixed(4)}</span></div>
                  ))}
                </div>
                <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Recent calls</div>
                <div className="max-h-44 overflow-y-auto space-y-1">
                  {usage.allTime.recent.slice(0, 15).map((r, i) => (
                    <div key={i} className="flex justify-between text-xs text-zinc-400">
                      <span>{r.kind} · {r.model?.split('/')[1] || r.model}</span>
                      <span className="tabular-nums">${(r.cost || 0).toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress / error */}
      {bulk && (
        <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-sm text-amber-300 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {bulk.label || `Painting slides… ${bulk.done} / ${bulk.total}`}
        </div>
      )}
      {error && (
        <div className="px-4 py-2 bg-red-950/60 border-b border-red-900 text-sm text-red-300 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-200 text-xs">dismiss</button>
        </div>
      )}

      <div className="flex-1 flex min-h-0">
        {/* Slide strip */}
        <div className="w-44 border-r border-zinc-800 overflow-y-auto p-2 space-y-2 bg-zinc-900">
          {deck.slides.map((s, i) => (
            <div
              key={s.id}
              onClick={() => setCurrentId(s.id)}
              className={`group relative rounded-lg border overflow-hidden cursor-pointer ${
                s.id === currentId ? 'border-amber-400' : 'border-zinc-800 hover:border-zinc-600'
              }`}
            >
              <div className="aspect-video bg-zinc-800 flex items-center justify-center">
                {s.image ? (
                  <img src={`${s.image}?t=${s.imageT || ''}`} alt="" className="w-full h-full object-cover" />
                ) : generating.has(s.id) ? (
                  <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-zinc-700" />
                )}
              </div>
              <div className="px-2 py-1 text-xs flex items-center justify-between bg-zinc-900">
                <span className="truncate">{i + 1}. {s.title}</span>
                <span className="flex items-center gap-1 shrink-0">
                  {s.verify && (s.verify.ok
                    ? <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                    : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />)}
                  {s.status === 'error' && <span className="w-2 h-2 rounded-full bg-red-500" title={s.error} />}
                </span>
              </div>
              <div className="absolute top-1 right-1 hidden group-hover:flex gap-0.5">
                <button onClick={(e) => { e.stopPropagation(); moveSlide(s.id, -1) }} className="p-1 bg-zinc-900/90 rounded text-zinc-300 hover:text-white" title="Move up"><ChevronUp className="w-3.5 h-3.5" /></button>
                <button onClick={(e) => { e.stopPropagation(); moveSlide(s.id, 1) }} className="p-1 bg-zinc-900/90 rounded text-zinc-300 hover:text-white" title="Move down"><ChevronDown className="w-3.5 h-3.5" /></button>
                <button onClick={(e) => { e.stopPropagation(); duplicateSlide(s.id) }} className="p-1 bg-zinc-900/90 rounded text-zinc-300 hover:text-white" title="Duplicate"><Copy className="w-3.5 h-3.5" /></button>
                <button onClick={(e) => { e.stopPropagation(); removeSlide(s.id) }} className="p-1 bg-zinc-900/90 rounded text-zinc-300 hover:text-red-400" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
          <button
            onClick={addSlide}
            className="w-full py-2 rounded-lg border border-dashed border-zinc-700 text-zinc-500 hover:text-zinc-200 hover:border-zinc-500 flex items-center justify-center gap-1 text-sm"
          >
            <Plus className="w-4 h-4" /> Add slide
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 min-w-0 bg-zinc-950 flex items-center justify-center p-6">
          {current ? (
            (() => {
              const [rw, rh] = deck.aspectRatio.split(':').map(Number)
              const ratio = rw / rh
              return (
                <div
                  className="relative bg-zinc-900 rounded-lg overflow-hidden"
                  style={{ aspectRatio: `${rw} / ${rh}`, width: `min(100%, calc((100vh - 200px) * ${ratio}))` }}
                >
                  {current.image ? (
                    <img src={`${current.image}?t=${current.imageT || ''}`} alt={current.title} className="absolute inset-0 w-full h-full object-contain" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 gap-3 p-8 text-center">
                      {generating.has(current.id) ? (
                        <>
                          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                          <span className="text-sm">Nano Banana Pro is painting…</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-10 h-10" />
                          <span className="text-sm">Write a prompt on the right, then Generate.</span>
                        </>
                      )}
                    </div>
                  )}
                  {generating.has(current.id) && current.image && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                    </div>
                  )}
                </div>
              )
            })()
          ) : (
            <div className="text-zinc-600 text-sm">No slides yet. Add one, or use “AI deck”.</div>
          )}
        </div>

        {/* Right panel */}
        {current && (
          <div className="w-80 border-l border-zinc-800 p-4 overflow-y-auto space-y-4 bg-zinc-900">
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wide">Title</label>
              <input
                value={current.title}
                onChange={(e) => update((d) => { d.slides.find((s) => s.id === current.id).title = e.target.value })}
                className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400/60"
              />
              {current.purpose && <div className="mt-1 text-xs text-zinc-500">{current.purpose}</div>}
            </div>
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wide">Image prompt</label>
              <textarea
                value={current.prompt}
                onChange={(e) => update((d) => { d.slides.find((s) => s.id === current.id).prompt = e.target.value })}
                rows={8}
                placeholder="Describe the slide: headline text, layout, visuals…"
                className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm outline-none focus:border-amber-400/60"
              />
              <div className="mt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {(current.refs || []).map((r) => (
                    <div key={r.path} className="relative w-14 h-14 rounded overflow-hidden border border-zinc-800 group">
                      <img src={r.path} alt={r.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeSlideRef(current.id, r.path)}
                        className="absolute top-0 right-0 bg-black/70 text-white p-0.5 opacity-0 group-hover:opacity-100 hover:bg-red-500"
                        title="Remove reference"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {(current.refs || []).length < 6 && (
                    <label className="w-14 h-14 rounded border border-dashed border-zinc-700 hover:border-amber-400/60 flex items-center justify-center cursor-pointer text-zinc-500 hover:text-amber-300" title="Attach reference image for this slide">
                      <ImageIcon className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*,.svg"
                        multiple
                        onChange={(e) => { const fs = [...e.target.files]; e.target.value = ''; addSlideRefs(current.id, fs) }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {(current.refs || []).length > 0 && (
                  <div className="text-xs text-zinc-500 mt-1">
                    {(current.refs || []).length} reference{(current.refs || []).length === 1 ? '' : 's'} attached — passed to Nano Banana Pro on Generate.
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => generateSlide(current)}
              disabled={busy || !current.prompt.trim()}
              className="w-full flex items-center justify-center gap-2 bg-amber-400 text-zinc-950 font-medium py-2 rounded-lg hover:bg-amber-300 disabled:opacity-50"
            >
              {generating.has(current.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              {current.image ? 'Regenerate' : 'Generate'}
            </button>
            {current.error && <div className="text-sm text-red-400">{current.error}</div>}
            {current.verify && !current.verify.ok && current.verify.issues?.length > 0 && (
              <div className="text-xs text-amber-300/90 bg-amber-950/40 border border-amber-900/50 rounded-lg p-2">
                <div className="font-medium mb-1">QA verifier flagged (after {current.verify.attempts} attempt{current.verify.attempts === 1 ? '' : 's'}):</div>
                <ul className="list-disc pl-4 space-y-0.5">
                  {current.verify.issues.map((iss, i) => <li key={i}>{iss}</li>)}
                </ul>
                <div className="mt-1 text-zinc-500">Hit Regenerate to try again.</div>
              </div>
            )}
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wide">Speaker notes</label>
              <textarea
                value={current.notes || ''}
                onChange={(e) => update((d) => { d.slides.find((s) => s.id === current.id).notes = e.target.value })}
                rows={4}
                className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm outline-none focus:border-amber-400/60"
              />
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal === 'style' && (
        <StyleModal deck={deck} onClose={() => setModal(null)} onSave={(style) => { update((d) => (d.style = style)); setModal(null) }} />
      )}
      {modal === 'context' && (
        <ContextModal deck={deck} onClose={() => setModal(null)} uploadContext={api.uploadContext} onSave={(items) => update((d) => (d.context = items))} />
      )}
      {modal === 'ai' && (
        <AIDeckModal deck={deck} busy={busy} onClose={() => setModal(null)} onGenerate={buildDeck} />
      )}
      {modal === 'agent' && agents[0] && (
        <AgentModal deck={deck} agent={agents.find((a) => a.id === deck.agent) || agents[0]} busy={busy} onClose={() => setModal(null)} onRun={buildAgentDeck} />
      )}
      {presenting && <PresentMode deck={deck} startIndex={Math.max(0, deck.slides.filter((s) => s.image).findIndex((s) => s.id === currentId))} onClose={() => setPresenting(false)} />}
    </div>
  )
}
