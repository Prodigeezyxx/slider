// Agent spec: immersive-brand-experience-deck
// Write the immersive event / booth / activation strategy deck the way a floor-level
// experience director actually writes one — from the aisle inward, cast to match the
// brand's real market, engineered so a sceptical MD signs off on Monday morning.

export default {
  id: 'immersive-brand-experience-deck',
  displayName: 'Immersive Brand Experience Deck',
  description:
    'Paired system: a 15-slide Strategy Deck that sells the vision, plus a 12-slide Proposal Deck that sells the build with a costed commercial framework. Photoreal architectural rendering, a single brand-signal accent colour, a proven three-act structure, and a spatial-attribution measurement pattern.',
  shortDescription: "If the deck can't get the client's MD to sign off on Monday, it's not the deck.",

  // Injected into the planner agent verbatim.
  brief: `
CORE PRINCIPLE
Every slide must be a photoreal architectural moment that a regulator, a principal, and a young engineer would all read fluently — technical enough to be credible, editorial enough to be memorable, cast to match the brand's actual market. Never a corporate stock illustration. Never a generic isometric cartoon. Never neon. Never dark mode. The deck's job is not to look good — its job is to make the client's MD sign off on Monday.

TWO-DECK SYSTEM
- Strategy Deck (15 slides) sells the vision — cinematic, aspirational, built for the first executive pitch. Ends on a monumental positioning statement.
- Proposal Deck (12 slides) sells the build — editorial, technical, built for technical approvers and the finance signatory. Ends on a three-tier pricing card.
- Both share one visual system, one brand voice, one measurement layer. Three acts inside each deck: Frame → Design → Experience (proposal adds Intelligence & ROI, Post-Activation, Commercial).

OPERATIONAL RULES
- The deck is not the pitch — the conversation about the deck is the pitch. Every slide must trigger a question the presenter already knows how to answer.
- The visual system must feel authoritative to a regulator, technical to a principal, and aspirational to a young engineer at the same time — three audiences, one language, zero dilution.
- Real numbers only: every fact on every slide must trace back to the user-supplied brief/context. Never fill from training memory.
- Cast to market: humans in every render reflect the brand's actual customer/market demographic. Never default to Silicon Valley stock demographics.
- Never use the word "pavilion" or "modular / re-usable at next event" unless the user explicitly asks. Every deck is for a specific event.
- No corporate filler: no "seamless", "cutting-edge", "world-class", "solutions", "empowering", "unlock", "delivering".
- Viewpoint-based titles, not noun-based. Bad: "Our HSSE Approach". Good: "TSL doesn't just move goods across Africa."

VISUAL SYSTEM (NON-NEGOTIABLE)
- Photoreal architectural rendering only. Reference: Mercedes flagship showroom × NASA visitor centre.
- One dominant environment + one signal colour. Default: matte white architecture (walls, high-gloss floor, brushed aluminium, pale-oak accents) + brand primary colour as sole accent (route lines, trim reveals, signage, hero content).
- Lighting: soft, diffuse, gallery-museum. Natural ceiling-truss daylight + warm accent spots + subtle brand-colour glow reveals. Never neon. Never dark mode.
- Typography: bold Swiss-style sans-serif in solid white, brand colour, or dark charcoal. Short 2–4 word operational statements. Viewpoint-based titles.
- Data overlays: minimal, precise, wireframe-thin. Real numbers only.

THE SIX ACTIVATIONS MENU (adapt names to the brand's ownable claim)
Tech-enabled (always three):
1. Intelligence Wall — always-on back-wall dashboard showing the brand's ownable operating stats
2. Anchor Simulator/Game — controller-based scenario game tied to the brand's core discipline (safety, custody, ops)
3. Lead Capture Podium — service-interest prompts → email → enriched follow-up
Physical/sensory:
4. Tactile Provenance Object — a museum-plinth object anchoring the brand's most defensible claim
5. Signed Ledger Wall — matte white acrylic wall with pens, a curated prompt, guest signatures
6. Poured Espresso Concierge — dedicated barista in branded apron (Flagship tier only by default)

PRICING FRAMEWORK (three tiers, anchor middle)
- Essential — core booth + activations + basic attribution + post-event report
- Signature (RECOMMENDED) — Essential + full activation set + full attribution stack + docu film + editorial photography + 3-week post-activation
- Flagship — Signature + editorial media placements + espresso concierge + extended nurture + case study + custom scent
Reference UK booth-market pricing (£22k / £34k / £48k for a compact custom peninsula) rendered in the client's local currency. Payment terms default: 60% on scope lock / 30% on event day / 10% on final report. If the event is >12 weeks out, use 40/40/20.
`,

  decks: {
    strategy: {
      label: 'Strategy Deck (15 slides · vision)',
      slides: [
        ['Cover', 'Master theme on hero wall — monumental typographic entry'],
        ['Executive Summary', '3 promises + 3 credibility stats — the one-slide "why"'],
        ['Brand Translation', 'vendor → benchmark, with 3 pillars (X+ Y+ Z+) — reframes the brand'],
        ['Design Language', 'palette swatch table — locks the visual system'],
        ['Master Theme', 'three-word organising idea on hero wall — the deck spine'],
        ['Booth Architecture', 'S / M / L deployment sizes — shows the system scales'],
        ['Zone 01 · Arrival Hero LED', 'the aisle-stopper'],
        ['Zone 02 · Signature Anchor Activation', 'controller-based game — the memorable moment'],
        ['Zone 03 · Web-based Touch Experience', 'lives beyond the event'],
        ['Zone 04 · Digital Twin / Control Room', 'real capability made tangible'],
        ['Zone 05 · Stewardship Pillars', 'X+ Y+ Z+ illuminated — the reflective moment'],
        ['Zone 06 · Premium Client Lounge', '"Where [X] Happen" — the closing environment'],
        ['Attribution Layer', 'Capture · Twin · Ask · Attraction → Attribution → Action — proves ROI'],
        ['Value to Business', '6-tile monetisation grid — how it earns back'],
        ['Positioning Manifesto', 'contrast statement on hero wall — the closing line'],
      ],
    },
    proposal: {
      label: 'Proposal Deck (12 slides · build)',
      slides: [
        ['Cover', 'event, dates, footprint, "3×[X] Peninsula Booth" naming — locks the scope'],
        ['Brief Recap', 'event, footprint, three audiences, tone — playback proves you listened'],
        ['Moodboard', '9-tile material + lighting specimen grid — visual DNA lock'],
        ['Floor Plan + Front Elevation', 'true-scale dimensioned drawings — engineering credibility'],
        ['Signature Render', 'the "money shot" of the finished booth — sells the build'],
        ['The Six Activations', '3 tech + 3 physical/sensory — inventory of what happens inside'],
        ['Lead Capture Station', 'podium mockup + capture→enrich→trigger→handoff flow'],
        ['Attendee Flow → Attribution → Pipeline', 'unified journey across all audiences'],
        ['Attribution Layer', 'Capture · Twin · Ask — compact intelligence spec'],
        ['ROI Framework', 'KPIs per audience segment — how success is measured'],
        ['Media & Post-Activation Wrap', 'editorial + docu film + photography + timeline'],
        ['Commercial', '3 pricing tiers (Essential / Signature RECOMMENDED / Flagship) — the close'],
      ],
    },
  },

  aestheticTemplate: (brand) =>
    `The aesthetic is a photoreal architectural rendering style for a premium exhibition booth — bright, gallery-lit, and unmistakably branded. The visual language is dominated by a pristine white environment: matte white architectural walls, high-gloss white ceramic-tile floors with soft mirror-like reflections, brushed aluminium and pale-oak accent details, and clean tension-fabric surfaces. Against this bright canvas, a single deep brand colour — ${brand.color} — is applied surgically as the sole signal accent: recessed floor route-lines, illuminated trim reveals, signage plates, seating cushions, wayfinding stripes, and hero LED content. Lighting is soft, diffuse, gallery-museum quality with natural ceiling-truss daylight, warm accent spots, and subtle brand-colour glow reveals along architectural edges — never neon, never club-like. Materials render with true photographic fidelity: fine grain in fabric, correct specular highlights on gloss floors, real shadow softness. Business-attire visitors appear at natural scale for context, cast to match ${brand.name}'s actual market demographic at ${brand.location || 'the event location'}${brand.location ? ` — humans on stand must look like the real audience of ${brand.location}, not a generic Silicon Valley demographic` : ''}. Typography inside every render is bold Swiss-style sans-serif in solid white, solid brand colour, or dark charcoal, set generously, with short 2-4 word operational statements. Data overlays and HUD elements — where present — are minimal, precise, wireframe-thin, and rendered in the same brand-colour-on-white system. The overall mood is confident, operational, premium, and quietly technological — the architectural language of a Mercedes flagship showroom crossed with a NASA visitor centre, applied to ${brand.name}. No neon, no dark mode, no gradients beyond soft ambient lighting, no decorative flourishes.`,

  logoInstruction:
    'The logo appears in EXACTLY ONE PLACE on this slide: top-right corner, roughly 220px wide, copied verbatim from the uploaded reference. Do NOT place the logo anywhere else.',

  verifyRules: `
- Photoreal architectural rendering, NOT illustration, NOT cartoon, NOT neon, NOT dark mode.
- If a logo was supplied: it must appear exactly once, top-right, faithful to the reference (no invented variants, no duplicates on walls/signage).
- Headline text is short, legible, and correctly spelled (no gibberish typography in the main title).
- One dominant white environment with a single brand-signal accent colour; no rainbow palettes.
- Humans on stand match the location-appropriate demographic described in the Market casting expectation above. Reject any render where the crowd defaults to a generic Silicon Valley / Western stock demographic when the event location says otherwise (e.g. a Lagos event with an all-white crowd is a hard fail).
- The slide delivers its stated purpose (given as title + intent).
`,
}
