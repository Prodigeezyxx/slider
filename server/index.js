import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
// Import the lib directly: pdf-parse's index.js runs debug code under ESM.
import pdfParse from 'pdf-parse/lib/pdf-parse.js'
import * as store from './store.js'
import { recordUsage, usageSummary } from './usage.js'
import { generateImage, planDeck, planAgentDeck, verifySlide, IMAGE_MODEL, TEXT_MODEL } from './openrouter.js'
import { painterKnowledgeSlice, castingBrief } from './knowledge/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = new Hono()

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
}

// ---------- Agent specs ----------

const AGENTS = {}
for (const f of fs.readdirSync(path.join(__dirname, 'agents'))) {
  if (!f.endsWith('.js')) continue
  const spec = (await import(pathToFileURL(path.join(__dirname, 'agents', f)).href)).default
  AGENTS[spec.id] = spec
}

// ---------- Decks ----------

app.get('/api/decks', (c) => c.json({ decks: store.listDecks() }))

app.post('/api/decks', async (c) => {
  const { title } = await c.req.json().catch(() => ({}))
  return c.json({ deck: store.createDeck(title) })
})

app.get('/api/decks/:id', (c) => {
  const deck = store.getDeck(c.req.param('id'))
  if (!deck) return c.json({ error: 'Deck not found' }, 404)
  return c.json({ deck })
})

app.put('/api/decks/:id', async (c) => {
  const deck = await c.req.json().catch(() => null)
  if (!deck || deck.id !== c.req.param('id')) return c.json({ error: 'Invalid deck' }, 400)
  return c.json({ deck: store.saveDeck(deck) })
})

app.delete('/api/decks/:id', (c) => {
  store.deleteDeck(c.req.param('id'))
  return c.json({ ok: true })
})

// ---------- Context ingestion (txt / md / pdf -> text) ----------

app.post('/api/context-upload', async (c) => {
  const body = await c.req.parseBody()
  const files = [body.files].flat().filter((f) => f instanceof File)
  if (files.length === 0) return c.json({ error: 'No files uploaded' }, 400)

  const items = []
  for (const f of files) {
    const ext = path.extname(f.name).toLowerCase()
    let text = ''
    try {
      if (ext === '.pdf') {
        const data = await pdfParse(Buffer.from(await f.arrayBuffer()))
        text = data.text
      } else {
        text = await f.text()
      }
    } catch (e) {
      return c.json({ error: `Failed to read ${f.name}: ${e.message}` }, 400)
    }
    items.push({ name: f.name, text: text.slice(0, 20000) })
  }
  return c.json({ items })
})

// ---------- Brand assets (logo / reference images) ----------

app.post('/api/decks/:id/assets', async (c) => {
  const deck = store.getDeck(c.req.param('id'))
  if (!deck) return c.json({ error: 'Deck not found' }, 404)
  const body = await c.req.parseBody()
  const role = body.role === 'logo' ? 'logo' : 'reference'
  const files = [body.files].flat().filter((f) => f instanceof File)
  if (files.length === 0) return c.json({ error: 'No files uploaded' }, 400)

  const dir = path.join(store.imageDir(deck.id), 'refs')
  fs.mkdirSync(dir, { recursive: true })
  deck.brand = deck.brand || {}
  deck.references = deck.references || []

  const saved = []
  for (const f of files) {
    const ext = path.extname(f.name).toLowerCase() || '.png'
    const safe = `${role}-${Date.now().toString(36)}${ext}`
    fs.writeFileSync(path.join(dir, safe), Buffer.from(await f.arrayBuffer()))
    const webPath = `/images/${deck.id}/refs/${safe}`
    if (role === 'logo') deck.brand.logo = webPath
    else deck.references.push({ name: f.name, path: webPath })
    saved.push({ name: f.name, path: webPath, role })
  }
  store.saveDeck(deck)
  return c.json({ saved, deck })
})

// ---------- Per-slide reference images ----------

app.post('/api/decks/:id/slides/:sid/refs', async (c) => {
  const deck = store.getDeck(c.req.param('id'))
  if (!deck) return c.json({ error: 'Deck not found' }, 404)
  const slide = deck.slides.find((s) => s.id === c.req.param('sid'))
  if (!slide) return c.json({ error: 'Slide not found' }, 404)

  const body = await c.req.parseBody()
  const files = [body.files].flat().filter((f) => f instanceof File)
  if (files.length === 0) return c.json({ error: 'No files uploaded' }, 400)

  const dir = path.join(store.imageDir(deck.id), 'refs', `slide-${slide.id}`)
  fs.mkdirSync(dir, { recursive: true })
  slide.refs = Array.isArray(slide.refs) ? slide.refs : []

  const added = []
  for (const f of files) {
    const ext = path.extname(f.name).toLowerCase() || '.png'
    const safe = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}${ext}`
    fs.writeFileSync(path.join(dir, safe), Buffer.from(await f.arrayBuffer()))
    const webPath = `/images/${deck.id}/refs/slide-${slide.id}/${safe}`
    slide.refs.push({ name: f.name, path: webPath })
    added.push({ name: f.name, path: webPath })
  }
  store.saveDeck(deck)
  return c.json({ added, slide })
})

app.delete('/api/decks/:id/slides/:sid/refs', async (c) => {
  const deck = store.getDeck(c.req.param('id'))
  if (!deck) return c.json({ error: 'Deck not found' }, 404)
  const slide = deck.slides.find((s) => s.id === c.req.param('sid'))
  if (!slide) return c.json({ error: 'Slide not found' }, 404)
  const { path: refPath } = await c.req.json().catch(() => ({}))
  if (!refPath) return c.json({ error: 'ref path required' }, 400)

  slide.refs = (slide.refs || []).filter((r) => r.path !== refPath)
  const rel = path.normalize(refPath.replace(/^\/images\//, ''))
  const file = path.join(store.IMAGES, rel)
  if (file.startsWith(store.IMAGES) && fs.existsSync(file)) fs.unlinkSync(file)

  store.saveDeck(deck)
  return c.json({ slide })
})

// ---------- Agents ----------

app.get('/api/agents', (c) =>
  c.json({
    agents: Object.values(AGENTS).map((s) => ({
      id: s.id,
      displayName: s.displayName,
      description: s.description,
      shortDescription: s.shortDescription,
      decks: Object.fromEntries(Object.entries(s.decks).map(([k, v]) => [k, { label: v.label, count: v.slides.length }])),
    })),
  }),
)

app.post('/api/agent/plan', async (c) => {
  const { deckId, agentId, deckType, brand, refs } = await c.req.json().catch(() => ({}))
  const spec = AGENTS[agentId]
  if (!spec) return c.json({ error: 'Unknown agent' }, 404)
  if (!spec.decks[deckType]) return c.json({ error: `Unknown deck type "${deckType}"` }, 400)
  const deck = store.getDeck(deckId)
  if (!deck) return c.json({ error: 'Deck not found' }, 404)

  // Merge brand inputs (logo path may already be set via /assets).
  deck.brand = { ...(deck.brand || {}), ...brand, logo: deck.brand?.logo || null }
  deck.agent = agentId
  deck.aspectRatio = '16:9'

  const context = (deck.context || [])
    .map((x) => `--- ${x.name} ---\n${x.text}`)
    .join('\n\n')
    .slice(0, 12000)

  // Sanitize inbound refs: must be data:image/...;base64 URLs, cap count to keep tokens sane.
  const cleanRefs = Array.isArray(refs)
    ? refs.filter((s) => typeof s === 'string' && s.startsWith('data:image/')).slice(0, 6)
    : []

  try {
    const { slides, cost } = await planAgentDeck({ spec, deckType, brand: deck.brand, context, refs: cleanRefs })
    recordUsage({ deckId: deck.id, kind: 'plan', model: TEXT_MODEL, cost: cost || 0 })
    deck.manifest = {
      agent: agentId,
      deckType,
      aesthetic: spec.aestheticTemplate(deck.brand),
      plannedAt: Date.now(),
    }
    deck.slides = slides.map((s) => ({
      id: store.newId('s_'),
      title: s.title,
      purpose: s.purpose,
      prompt: s.prompt,
      notes: s.notes,
      image: null,
      status: 'idle',
    }))
    store.saveDeck(deck)
    return c.json({ deck })
  } catch (e) {
    return c.json({ error: e.message }, 502)
  }
})

// ---------- Painting (with optional verify loop) ----------

function logoDataUrl(deck) {
  if (!deck.brand?.logo) return null
  const rel = deck.brand.logo.replace(/^\/images\//, '')
  const file = path.join(store.IMAGES, rel)
  if (!file.startsWith(store.IMAGES) || !fs.existsSync(file)) return null
  const mime = MIME[path.extname(file).toLowerCase()] || 'image/png'
  return `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`
}

function imagePathToDataUrl(webPath) {
  if (!webPath || typeof webPath !== 'string') return null
  const rel = path.normalize(webPath.replace(/^\/images\//, ''))
  const file = path.join(store.IMAGES, rel)
  if (!file.startsWith(store.IMAGES) || !fs.existsSync(file)) return null
  const mime = MIME[path.extname(file).toLowerCase()] || 'image/png'
  return `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`
}

app.post('/api/generate', async (c) => {
  const { deckId, slideId, prompt, verify = true } = await c.req.json().catch(() => ({}))
  const deck = store.getDeck(deckId)
  if (!deck) return c.json({ error: 'Deck not found' }, 404)
  const slide = deck.slides.find((s) => s.id === slideId)
  if (!slide) return c.json({ error: 'Slide not found' }, 404)

  if (typeof prompt === 'string') slide.prompt = prompt

  const spec = deck.agent ? AGENTS[deck.agent] : null
  const logo = logoDataUrl(deck)

  // Slide-level references the user uploaded next to the prompt.
  const slideRefs = Array.isArray(slide.refs) ? slide.refs : []
  const slideRefData = slideRefs.map((r) => imagePathToDataUrl(r.path)).filter(Boolean)

  const knowledgeSlice = spec ? painterKnowledgeSlice(deck.brand || {}) : ''
  const parts = [
    deck.manifest?.aesthetic ? deck.manifest.aesthetic : deck.style ? `Visual style guide (follow it strictly): ${deck.style}` : null,
    `A single presentation slide image. ${slide.prompt}`,
    knowledgeSlice || null,
    slideRefData.length
      ? `The user has attached ${slideRefData.length} reference image${slideRefData.length === 1 ? '' : 's'} to guide this slide. Use them as primary visual reference for composition, subjects, materials, lighting, or product likeness as appropriate — do not copy them verbatim, and preserve the deck's overall visual system.`
      : null,
    logo && spec?.logoInstruction ? spec.logoInstruction : null,
    'Render all text crisply and legibly. Clean, professional slide design.',
  ].filter(Boolean)
  const basePrompt = parts.join('\n\n')
  const references = []
  if (logo) references.push({ type: 'image_url', image_url: { url: logo } })
  for (const url of slideRefData) references.push({ type: 'image_url', image_url: { url } })

  const ext = (mediaType) => Object.keys(MIME).find((k) => MIME[k] === mediaType) || '.png'

  async function paint(extraPrompt = '') {
    const { img, cost } = await generateImage({
      prompt: basePrompt + extraPrompt,
      aspectRatio: deck.aspectRatio || '16:9',
      resolution: deck.resolution || '2K',
      references,
    })
    recordUsage({ deckId, slideId, kind: 'image', model: IMAGE_MODEL, cost: cost || 0 })
    const file = path.join(store.imageDir(deckId), `${slideId}${ext(img.media_type)}`)
    fs.writeFileSync(file, Buffer.from(img.b64_json, 'base64'))
    return { file, ext: ext(img.media_type), dataUrl: `data:${img.media_type || 'image/png'};base64,${img.b64_json}` }
  }

  try {
    let painted = await paint()
    slide.image = `/images/${deckId}/${slideId}${painted.ext}`
    slide.status = 'done'
    slide.error = null
    slide.verify = null

    // Verifier agent: inspect, and repaint once with corrections if it fails.
    if (spec && verify) {
      const markets = [deck.brand?.audiences, deck.brand?.location, castingBrief(deck.brand?.location || '')]
        .filter(Boolean)
        .join(' | ')
      let verdict = await verifySlide({ spec, slide, dataUrl: painted.dataUrl, hasLogo: !!logo, markets })
      recordUsage({ deckId, slideId, kind: 'verify', model: TEXT_MODEL, cost: verdict.cost || 0 })
      if (!verdict.ok && verdict.fixPrompt) {
        painted = await paint(`\n\nCORRECTIONS FROM QA (apply exactly): ${verdict.fixPrompt}`)
        slide.image = `/images/${deckId}/${slideId}${painted.ext}`
        verdict = await verifySlide({ spec, slide, dataUrl: painted.dataUrl, hasLogo: !!logo, markets })
        recordUsage({ deckId, slideId, kind: 'verify', model: TEXT_MODEL, cost: verdict.cost || 0 })
        verdict.attempts = 2
      } else {
        verdict.attempts = 1
      }
      delete verdict.usage
      delete verdict.cost
      delete verdict.fixPrompt
      slide.verify = verdict
    }

    store.saveDeck(deck)
    return c.json({ slide, usage: usageSummary(deckId) })
  } catch (e) {
    slide.status = 'error'
    slide.error = e.message
    store.saveDeck(deck)
    return c.json({ error: e.message, slide }, 502)
  }
})

// ---------- Simple (non-agent) outline ----------

app.post('/api/outline', async (c) => {
  const { deckId, topic, count = 8, refs } = await c.req.json().catch(() => ({}))
  if (!topic) return c.json({ error: 'topic is required' }, 400)
  const deck = store.getDeck(deckId)
  const context = (deck?.context || [])
    .map((x) => `--- ${x.name} ---\n${x.text}`)
    .join('\n\n')
    .slice(0, 12000)
  const cleanRefs = Array.isArray(refs)
    ? refs.filter((s) => typeof s === 'string' && s.startsWith('data:image/')).slice(0, 6)
    : []
  try {
    const { slides, cost } = await planDeck({ topic, context, count, style: deck?.style || '', refs: cleanRefs })
    recordUsage({ deckId: deckId || null, kind: 'plan', model: TEXT_MODEL, cost: cost || 0 })
    return c.json({ slides })
  } catch (e) {
    return c.json({ error: e.message }, 502)
  }
})

// ---------- Usage / cost counter ----------

app.get('/api/usage', (c) => {
  const deckId = c.req.query('deckId') || null
  return c.json({ deck: usageSummary(deckId), allTime: usageSummary() })
})

// ---------- Images ----------

app.get('/images/*', (c) => {
  const rel = path.normalize(c.req.path.replace(/^\/images\//, ''))
  const file = path.join(store.IMAGES, rel)
  if (!file.startsWith(store.IMAGES) || !fs.existsSync(file)) return c.notFound()
  const mime = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream'
  return c.body(fs.readFileSync(file), 200, { 'Content-Type': mime })
})

// ---------- Production: serve built frontend ----------

if (fs.existsSync('dist')) {
  app.use('/*', serveStatic({ root: './dist' }))
  app.get('*', (c, next) => {
    if (c.req.path.startsWith('/api') || c.req.path.startsWith('/images')) return c.notFound()
    return serveStatic({ path: './dist/index.html' })(c, next)
  })
} else {
  app.get('/', (c) => c.redirect('http://localhost:5173'))
}

const port = Number(process.env.PORT) || 8787
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`slider server on http://localhost:${info.port}`)
  console.log(`image model: ${IMAGE_MODEL} | text model: ${TEXT_MODEL}`)
  console.log(`agents loaded: ${Object.keys(AGENTS).join(', ') || '(none)'}`)
})
