const API = 'https://openrouter.ai/api/v1'

import { plannerKnowledgeBlock } from './knowledge/index.js'

const KEY = process.env.OPENROUTER_API_KEY
export const IMAGE_MODEL = process.env.OPENROUTER_IMAGE_MODEL || 'google/gemini-3-pro-image'
export const TEXT_MODEL = process.env.OPENROUTER_TEXT_MODEL || 'google/gemini-3.5-flash'

function headers() {
  if (!KEY) {
    throw new Error('OPENROUTER_API_KEY is not set. Add it to .env and restart the server.')
  }
  return {
    Authorization: `Bearer ${KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'http://localhost:8787',
    'X-Title': 'slider',
  }
}

function costOf(json) {
  return json?.usage?.cost ?? null
}

// ---------- Painter agent (Nano Banana Pro) ----------

export async function generateImage({ prompt, aspectRatio = '16:9', resolution = '2K', references = [] }) {
  const body = { model: IMAGE_MODEL, prompt, aspect_ratio: aspectRatio, resolution }
  if (references.length) body.input_references = references
  const res = await fetch(`${API}/images`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json?.error?.message || `OpenRouter image request failed (${res.status})`)
  }
  const img = json.data?.[0]
  if (!img?.b64_json) throw new Error('OpenRouter returned no image')
  return { img, usage: json.usage || null, cost: costOf(json) }
}

// ---------- Text/vision helper (chat completions, with usage accounting) ----------

async function chat(messages, { jsonMode = false } = {}) {
  const body = { model: TEXT_MODEL, messages, usage: { include: true } }
  if (jsonMode) body.response_format = { type: 'json_object' }
  const res = await fetch(`${API}/chat/completions`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json?.error?.message || `OpenRouter chat request failed (${res.status})`)
  }
  return { text: json.choices?.[0]?.message?.content || '', usage: json.usage || null, cost: costOf(json) }
}

function parseJsonArray(text) {
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('Could not parse a JSON array from the model response')
  return JSON.parse(match[0])
}

function parseJsonObject(text) {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Could not parse a JSON object from the model response')
  return JSON.parse(match[0])
}

// ---------- Simple outline agent (generic decks) ----------

export async function planDeck({ topic, context = '', count = 8, style = '' }) {
  const system =
    'You are a world-class presentation designer. You create slide decks where every slide is a single AI-generated image.'

  const user = `Create a ${count}-slide presentation deck about: "${topic}".
${style ? `\nThe deck's visual style guide (all slides must follow it): ${style}` : ''}
${context ? `\nUse the following reference material as the source of truth for the content:\n${context}` : ''}

Return ONLY a JSON array of exactly ${count} objects with this shape:
[{"title": "...", "prompt": "...", "notes": "..."}, ...]

Rules:
- "title": short slide title (a few words).
- "prompt": a detailed image-generation prompt for the slide. Describe the layout, the exact headline text to render, supporting visuals, charts or diagrams if relevant, and color treatment. Every slide must feel like part of one cohesive deck.
- "notes": 2-3 sentences of speaker notes.
- Ground the content in the reference material when provided. Do not invent facts that contradict it.
- Output raw JSON only. No markdown fences, no commentary.`

  const { text, usage, cost } = await chat([
    { role: 'system', content: system },
    { role: 'user', content: user },
  ])
  const slides = parseJsonArray(text)
  if (!Array.isArray(slides) || slides.length === 0) throw new Error('Model returned an empty outline')
  return {
    slides: slides.map((s) => ({
      title: String(s.title || 'Untitled'),
      prompt: String(s.prompt || s.title || ''),
      notes: String(s.notes || ''),
    })),
    usage,
    cost,
  }
}

// ---------- Planner agent (agent-spec decks) ----------

export async function planAgentDeck({ spec, deckType, brand, context = '' }) {
  const structure = spec.decks[deckType]
  const table = structure.slides.map((row, i) => `${i + 1}. ${row[0]} — ${row[1]}`).join('\n')

  const knowledge = plannerKnowledgeBlock(brand)

  const system = `You are a floor-level experience director writing an immersive brand experience deck.
${spec.brief}

${knowledge}`

  const user = `BRAND INPUTS:
- Brand name: ${brand.name}
- What they do (their own words): ${brand.description || '(not supplied — infer carefully and keep claims conservative)'}
- Credibility stats (real numbers, the ownable spine): ${brand.stats || '(none supplied — do NOT invent numbers)'}
- Primary brand colour: ${brand.color}
- Event / venue / dates / footprint: ${brand.event}
- Event location (city, country): ${brand.location || '(not supplied — cannot cast humans without this)'}
- Audiences (ranked primary first): ${brand.audiences}
- Delivery studio: ${brand.studio || 'the studio'}
${context ? `\nREFERENCE MATERIAL (source of truth):\n${context}` : ''}

DECK TO WRITE: ${structure.label}
Follow this required structure exactly — one output slide per row:
${table}

Return ONLY a JSON array of ${structure.slides.length} objects: [{"title": "...", "purpose": "...", "prompt": "...", "notes": "..."}, ...]

Rules for each slide:
- "title": viewpoint-based title, 2-8 words (never a noun title like "Our Approach").
- "purpose": the purpose text from the structure row, verbatim.
- "prompt": a complete image-generation prompt for this slide (90-160 words). It must be:
   - A photoreal architectural rendering of the booth / gallery moment described above.
   - Use the DOMAIN CONTEXT block's material palette, lighting, signage, AV, and typology guidance — do not default to generic showroom language.
   - Include the exact headline text to render on the slide (short, 2-6 words, viewpoint-based).
   - Any data overlays use ONLY real numbers from the BRAND INPUTS above. Never invent stats. If a stat does not exist, write around it.
   - Cast humans to match the CASTING block for ${brand.location || 'the event location'} — never default to Silicon Valley / generic Western stock demographics.
   - Do not mention the logo — logo placement is handled separately.
- "notes": 2-3 sentence presenter script that answers the question this slide is designed to trigger.
Raw JSON only. No markdown fences.`

  const { text, usage, cost } = await chat([
    { role: 'system', content: system },
    { role: 'user', content: user },
  ])
  const slides = parseJsonArray(text)
  if (!Array.isArray(slides) || slides.length === 0) throw new Error('Planner returned an empty deck')
  return {
    slides: slides.map((s, i) => ({
      title: String(s.title || structure.slides[i]?.[0] || 'Untitled'),
      purpose: String(s.purpose || structure.slides[i]?.[1] || ''),
      prompt: String(s.prompt || ''),
      notes: String(s.notes || ''),
    })),
    usage,
    cost,
  }
}

// ---------- Verifier agent (vision QA) ----------

export async function verifySlide({ spec, slide, dataUrl, hasLogo, markets }) {
  const rules = spec?.verifyRules || ''
  const text = `You are a ruthless slide QA checker for a high-stakes executive deck. Inspect this generated slide image against the rules below.

SLIDE INTENT: "${slide.title}" — ${slide.purpose || slide.prompt?.slice(0, 200) || ''}
${hasLogo ? 'A brand logo reference WAS supplied for this slide.' : 'No logo reference was supplied.'}
${markets ? `Market casting expectation: ${markets}` : ''}

RULES:
${rules}

Return ONLY a JSON object: {"ok": true|false, "issues": ["..."], "fixPrompt": "..."}
- "ok" is true only if the slide is client-presentable.
- "issues": short concrete list of what is wrong (empty if ok).
- "fixPrompt": if not ok, one paragraph of correction instructions to append to the image prompt to fix it on a repaint. Empty string if ok.
Judge harshly on: gibberish headline text, logo duplication/misplacement, wrong aesthetic, off-market casting. Do not nitpick minor styling.`

  const { text: out, usage, cost } = await chat([
    {
      role: 'user',
      content: [
        { type: 'text', text },
        { type: 'image_url', image_url: { url: dataUrl } },
      ],
    },
  ])
  try {
    const verdict = parseJsonObject(out)
    return {
      ok: Boolean(verdict.ok),
      issues: Array.isArray(verdict.issues) ? verdict.issues.map(String) : [],
      fixPrompt: String(verdict.fixPrompt || ''),
      usage,
      cost,
    }
  } catch {
    // If the verifier can't be parsed, don't block the pipeline.
    return { ok: true, issues: ['verifier-unparseable'], fixPrompt: '', usage, cost }
  }
}
