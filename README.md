# slider

An AI harness for building **immersive brand-experience decks** — booth designs, expo activations, pop-ups, summit stages, retail experiences — where every slide is a photoreal architectural render painted by Nano Banana Pro (Gemini 3 Pro Image via OpenRouter), grounded in a hardcoded real-world event-industry knowledge module, cast to the actual demographics of the event's location, and QA-verified by a vision agent that repaints anything client-unpresentable.

The harness does one job: get from a brand brief to a client-signable deck in one pass, with every render specifiable enough that a booth builder could quote from the picture.

---

## What it is

A local web app (React + Vite frontend, Hono + Node server, JSON file store) that:

1. Ingests a brand brief (name, description, real stats, brand colour, event footprint, **event location**, audiences, delivery studio).
2. Ingests supporting context (paste text, or drop `.txt / .md / .pdf`).
3. Runs an **agent spec** (currently one: `immersive-brand-experience-deck`) which contains a written brief plus two deck structures — a 15-slide Strategy Deck and a 12-slide Proposal Deck.
4. Uses a **planner** (LLM text call) to write every slide's title + purpose + image prompt + presenter notes, grounded in your brief and the domain-knowledge module.
5. Uses a **painter** (Nano Banana Pro) to render every slide from its image prompt.
6. Uses a **verifier** (vision LLM) to check every render against the agent's `verifyRules`. If it fails, the harness repaints once with the verifier's corrections appended.
7. Exports the finished deck to PDF or a ZIP of images.

Cost per slide is roughly $0.14–0.16 (painter) + $0.005 (verifier) ≈ **$0.15** per slide with the verify loop on. A 15-slide strategy deck typically runs ~$2.30 all-in.

---

## Why the knowledge module matters

Most AI-image tools generate booth renders that look like Silicon Valley pitch-deck stock: same white, same neon accent, same generic-Western crowd, same fake "modern" architecture. That output is unusable for anyone actually pitching a real client at a real event in a real country.

`server/knowledge/index.js` fixes this by hardcoding **~700 lines of real event-industry reference**, always injected into the planner and painter prompts:

- **Booth typologies (11)** — inline, corner, peninsula, island, double-deck, pop-up, retail experience, auditorium, outdoor festival, hospitality suite, demo theatre. Each with real footprints, wall specs, stopping-power benchmarks, and design moves.
- **Material palettes (5)** — gallery-white / industrial-technical / warm-editorial / tech-optical / cultural-museum. Each palette has real material specs (walls, floors, accents, joinery) and a render-prompt string ready to paste.
- **Lighting rigs (5)** — gallery-diffuse / cinematic-low-key / daylight-expo / theatrical / outdoor-dusk. Real Kelvin, real lux, real CRI, real beam angles.
- **Crowd casting by region (13 regions)** — West Africa, East Africa, Southern Africa, North Africa, GCC, South Asia, Southeast Asia, East Asia, Western Europe, Southern/Eastern Europe, North America, Latin America, ANZ. Each region carries: appearance archetypes, corporate dress code, creative dress code, context notes — with explicit anti-Silicon-Valley-default language.
- **ROI patterns** — real capture/intelligence metrics with benchmark rates, cost tables in £/₦/AED, payment terms, the Capture→Twin→Ask→Attribution attribution stack.
- **Event archetypes (8)** — B2B trade show, industry summit, regulator forum, consumer expo, product launch, activation pop-up, investor showcase, cultural biennale. Each with attendee intent and the winning formula.
- **Signage language** — push-through acrylic dimensions, LED halo backlighting, floor route lines, data-wall composition, vitrine plinths, aisle-edge stoppers.
- **AV / interactive tech** — LED wall pitch and processor specs, short-throw projection lumens, touch tables, simulators, AR mirrors, VR pods, lead-capture podiums, poured-espresso stations, scent diffusion, signed-ledger walls.

The knowledge module is **selected contextually per deck**: when you enter `location: "Lagos, Nigeria"` and `event: "3x3 m peninsula HSSE Forum"`, the harness resolves region → West Africa (Lagos casting brief), archetype → Regulator forum (credibility-signalling winning formula), typology → Inline booth (real footprint math), palette → Industrial-technical (right for oil & gas). All of that is written into the LLM prompt before the slide is painted.

---

## Architecture

```
slider/
├── index.html                         # Vite entry
├── vite.config.js                     # dev-server proxy to :8787
├── package.json                       # `npm run dev` = server + web via concurrently
├── src/                               # React frontend
│   ├── main.jsx
│   ├── App.jsx
│   ├── api.js                         # thin fetch wrapper
│   ├── export.js                      # PDF / ZIP export
│   └── components/
│       ├── DeckList.jsx               # deck picker + create
│       ├── DeckEditor.jsx             # editor + agent runner
│       ├── Modals.jsx                 # brand intake, context intake, style guide
│       └── PresentMode.jsx            # full-screen review
└── server/                            # Hono + Node backend
    ├── index.js                       # HTTP routes + orchestration
    ├── openrouter.js                  # OpenRouter client (planner / painter / verifier)
    ├── store.js                       # JSON file store (data/decks, data/images)
    ├── usage.js                       # $ cost counter
    ├── agents/
    │   └── immersive-brand-experience-deck.js   # the current agent spec
    └── knowledge/
        └── index.js                   # hardcoded event-industry domain knowledge
```

### Flow

```
User fills brand intake (name, event, LOCATION, audiences, stats, ...)
                            │
                            ▼
POST /api/agent/plan  →  planAgentDeck({ spec, deckType, brand, context })
                            │
                            │  system prompt = spec.brief + plannerKnowledgeBlock(brand)
                            │                             (region + archetype + typology
                            │                              + palettes + lighting + signage
                            │                              + AV + ROI + casting)
                            ▼
                     LLM writes 12–15 slide prompts
                            │
                            ▼
For each slide: POST /api/generate  →  generateImage()
                            │
                            │  image prompt = manifest.aesthetic + slide.prompt
                            │               + painterKnowledgeSlice(brand)   ← materials, lighting, casting
                            │               + logoInstruction
                            ▼
                    Nano Banana Pro paints slide
                            │
                            ▼
                    verifySlide()  (vision QA against spec.verifyRules)
                            │
                    ok? ─── yes ──► save, mark done
                    │
                    no  ─── repaint once with corrections appended, verify again
```

---

## Setup

Requirements: Node 18+, an OpenRouter API key with access to `google/gemini-3-pro-image` and `google/gemini-3.5-flash` (or override the model env vars).

```bash
git clone https://github.com/Prodigeezyxx/slider.git
cd slider
npm install
cp .env.example .env    # then edit .env and paste your key
npm run dev
```

Open http://localhost:5173.

### `.env`

```
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_IMAGE_MODEL=google/gemini-3-pro-image
OPENROUTER_TEXT_MODEL=google/gemini-3.5-flash
PORT=8787
```

### `npm run dev`

Spins up the server on `:8787` and Vite on `:5173`. Vite proxies `/api/*` and `/images/*` to the server. If `:8787` is already occupied (a common one: leftover `wrangler dev` or `workerd` processes from another project), the server won't bind and every `/api` call will 404 — kill the occupant or change `PORT`.

---

## Using it

1. Open http://localhost:5173. Click **New deck**, give it a title, open it.
2. **Attach a logo** (optional but recommended) — top-right icon.
3. **Add context** — click Context, drop your brief, an About page, a research doc, or paste notes.
4. Click the **agent** button (bottom bar). Fill:
   - Brand name, colour, description, credibility stats
   - Event / venue / dates / footprint
   - **Event location (city, country)** — required. This drives the casting brief. Without it the harness will refuse to build, because a Lagos event with a Silicon Valley crowd is a hard fail.
   - Audiences (ranked)
   - Delivery studio
5. Pick **Strategy Deck** or **Proposal Deck**, hit **Build**. The planner writes ~50 seconds of slide prompts, then the painter starts working through them one at a time. Each slide shows a verify badge when done.
6. Individual slides can be regenerated from the editor — edit the prompt, click **Generate**.

### Reference images (per-slide and deck-wide)

Every prompt box in the UI accepts reference images. They are passed to Nano Banana Pro as `input_references` when the slide is painted, and to the planner as vision input when the deck is planned.

- **Per-slide, in the editor.** Below every slide's Image prompt textarea there is a thumbnail strip with a `+` tile. Drop 1–6 images per slide. These are persisted on disk (`data/images/<deckId>/refs/slide-<slideId>/`) and stored on `slide.refs[]`. They come along every time the slide is regenerated, alongside the deck's logo. Delete any thumbnail with the X button — the file is removed too.
- **Deck-wide, in the Agent modal.** When you plan a new deck with the immersive-brand-experience agent, the modal has a "Visual reference board" picker. These images are one-shot: they influence the planner call (the LLM sees them as vision input) but are not persisted. Use them to feed the planner a moodboard, past work samples, subject photos, or product likenesses.
- **Deck-wide, in the AI outline modal.** Same picker, one-shot, for the simpler non-agent deck flow.

### Costs

Roughly (as of writing, subject to OpenRouter pricing):

- Planner call (15 slides): ~$0.005
- Painter call (per slide, one attempt): ~$0.14
- Verifier call (per slide, per attempt): ~$0.002
- Expected verify pass rate on first attempt: ~65–75%. So budget ~1.3 paints per slide on average.

A full 15-slide strategy deck: **~$2.30**. A 12-slide proposal deck: **~$1.85**. Live cost counter is in the deck editor.

---

## Extending

### Add a new agent spec

Drop a file into `server/agents/`, e.g. `immersive-retail-residency.js`. Copy the shape of `immersive-brand-experience-deck.js`:

```js
export default {
  id: 'immersive-retail-residency',
  displayName: '...',
  description: '...',
  shortDescription: '...',
  brief: `...`,                          // written into planner system prompt
  decks: {
    strategy: { label: '...', slides: [ ['Slide title', 'purpose'], ... ] },
    // more deck types as you like
  },
  aestheticTemplate: (brand) => `...`,   // becomes deck.manifest.aesthetic
  logoInstruction: '...',
  verifyRules: `...`,
}
```

The server auto-loads every `.js` in `server/agents/` at startup.

### Extend the knowledge module

Everything the LLM knows about events lives in `server/knowledge/index.js`. To add a region:

```js
export const CROWD_CASTING = {
  ...
  central_asia: {
    label: 'Central Asia (Kazakhstan, Uzbekistan, ...)',
    countries: ['kazakhstan', 'uzbekistan', 'astana', 'tashkent'],
    appearance: '...',
    corporate_dress: '...',
    creative_dress: '...',
    context_notes: '...',
  },
}
```

Then it's automatically picked up by `regionForLocation()` and `castingBrief()` — no wiring required.

To add a booth typology, a material palette, a lighting rig, an event archetype, a signage move, or an AV pattern — same drill: append an entry to the relevant export in `server/knowledge/index.js`. Then wire it into `plannerKnowledgeBlock()` or `painterKnowledgeSlice()` if you want it selected automatically based on brand inputs.

### Change the models

Set `OPENROUTER_IMAGE_MODEL` and `OPENROUTER_TEXT_MODEL` in `.env`. Any OpenRouter-hosted image model that accepts `{ prompt, aspect_ratio, resolution, input_references }` will work.

---

## API reference (backend)

All endpoints are on `:8787` (proxied through `:5173` in dev).

| Method | Path | Purpose |
|--|--|--|
| GET | `/api/decks` | List all decks |
| POST | `/api/decks` | Create deck. Body: `{ title }` |
| GET | `/api/decks/:id` | Get a deck |
| PUT | `/api/decks/:id` | Save a deck |
| DELETE | `/api/decks/:id` | Delete deck + its images |
| POST | `/api/context-upload` | Multipart upload of `.txt / .md / .pdf`; returns extracted text |
| POST | `/api/decks/:id/assets` | Multipart upload of logo or reference images |
| POST | `/api/decks/:id/slides/:sid/refs` | Multipart upload of per-slide reference images. Stored on `slide.refs[]` and passed to Nano Banana Pro as `input_references` when the slide is painted. |
| DELETE | `/api/decks/:id/slides/:sid/refs` | Remove one slide reference. Body: `{ path }` (the ref web path). Deletes the file from disk too. |
| GET | `/api/agents` | List loaded agent specs |
| POST | `/api/agent/plan` | Plan a deck. Body: `{ deckId, agentId, deckType, brand, refs? }`. `refs` is an optional array of `data:image/...;base64` URLs used as vision input to the planner. |
| POST | `/api/generate` | Paint one slide. Body: `{ deckId, slideId, prompt?, verify? }`. Slide's stored `refs[]` are automatically included alongside the logo. |
| POST | `/api/outline` | Simple non-agent outline. Body: `{ deckId, topic, count, refs? }`. |
| GET | `/api/usage` | Cost counter. Query: `?deckId=...` for per-deck |
| GET | `/images/*` | Serve painted images and reference uploads |

---

## Data on disk

Nothing about the user is sent anywhere except to OpenRouter. All state lives in `data/`:

```
data/
├── decks/<id>.json           # deck record (metadata + slide array)
├── images/<deckId>/          # painted slides (.jpg or .png)
│   ├── <slideId>.jpg
│   └── refs/                 # uploaded logo + reference images
├── usage.jsonl               # append-only usage log for cost counter
├── server.log, vite.log      # runtime logs
```

`data/` is gitignored — nothing sensitive commits.

---

## Design principles

- **The deck is not the pitch — the conversation about the deck is the pitch.** Every slide must trigger a question the presenter already knows how to answer.
- **Real numbers only.** No invented stats. If a stat does not exist in the brand's input, the planner is instructed to write around it, not fabricate.
- **Cast to market.** Humans in every render match the event's actual demographic. Never default to Silicon Valley / generic Western.
- **Photoreal architecture, not corporate illustration.** No cartoons, no neon, no dark mode, no isometric flourishes.
- **One environment + one signal colour.** The brand colour is the only accent; the environment does the credibility work.
- **The verifier is a real quality gate.** Any slide can be repainted with corrections. Verify passes and attempt counts are recorded per slide.

---

## Known limits

- File storage only — no multi-user, no auth. Anyone with access to the local server can edit any deck.
- No revision history — the last `saveDeck()` overwrites.
- OpenRouter is the only image/text provider currently wired.
- The verifier's judgement isn't infallible; occasional false-negatives will trigger unnecessary repaints, and rare false-positives will let a mediocre render through.
- Location inference doesn't cover every city; if a location string doesn't match any of the 13 region lookup keys, the casting brief falls back to a generic "cast to match the actual demographic profile of ${location}, not Silicon Valley" instruction.

---

## License

Not open-sourced. Private tool.
