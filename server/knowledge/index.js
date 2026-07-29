// Domain knowledge module for immersive events / experiential marketing / booths / expos.
// Always-on: the planner and the image generator both pull slices from this file so every
// slide has real-world specificity — real materials, real dimensions, real crowd casting,
// real ROI patterns. If a fact isn't in here, the LLM cannot invent it.
//
// This is NOT reference documentation. Every string in this file is written to be pasted
// straight into an image or planner prompt.

// ---------------------------------------------------------------------------
// 1. BOOTH TYPOLOGIES — the actual stand layouts you see on show floors
// ---------------------------------------------------------------------------

export const BOOTH_TYPOLOGIES = {
  inline: {
    label: 'Inline / Linear',
    footprint: 'One open side facing the aisle. Typical sizes: 3×3 m (9 sqm), 3×6 m (18 sqm), 6×6 m (36 sqm).',
    walls: 'Back wall and two side walls solid; front is fully open. Neighbours share the two side walls.',
    stopping_power: 'Low — attendees pass at 1.2–1.6 m/s. Aisle-edge activation must convert in under 3 seconds.',
    design_moves:
      'Anchor the back wall as a hero LED / graphic panel. Push the primary demo to the aisle edge. Reserve the interior corner for a stand-up meeting nook, not seating.',
  },
  corner: {
    label: 'Corner',
    footprint: 'Two open aisles at 90°. Common sizes: 3×3, 6×3, 6×6 m.',
    walls: 'Two solid walls forming the L; two sides open. Corner post at the intersection is a critical branding surface.',
    stopping_power: 'Medium — dual approach vectors. Corner reveal moment matters.',
    design_moves:
      'Wrap the corner with an illuminated brand reveal (tension fabric with backlit graphics or a curved LED). Place the signature interactive on the diagonal so both aisles see it. Use the interior L as a semi-private conversation zone.',
  },
  peninsula: {
    label: 'Peninsula / End-cap',
    footprint: 'Three open sides, one back wall shared with the row. Common: 3×6 m, 6×6 m, 6×9 m.',
    walls: 'Single back wall as anchor. All other sides open to aisles.',
    stopping_power: 'High — approach from three vectors. This is the sweet spot for a photoreal architectural render because it reads as a "pavilion" from any angle.',
    design_moves:
      'Back wall is the theatre — hero LED or master-theme typography. Insert internal architecture (a floating soffit, a raised platform, a signature arch) to break the box. Signature activation on the primary diagonal.',
  },
  island: {
    label: 'Island',
    footprint: 'Four open sides, no shared walls. From 6×6 m up to 20×20 m and beyond.',
    walls: 'No perimeter walls unless designed. Freestanding architectural volumes only.',
    stopping_power: 'Highest — 360° visibility. Reads as a stand-alone building on the floor.',
    design_moves:
      'Design as architecture, not signage: floating canopy or truss ring for identity, ground-level activation zones on each aisle, internal control room / bar / lounge as programmed rooms. Hero moment visible from 20 m.',
  },
  double_deck: {
    label: 'Double-deck',
    footprint: 'Two-storey island. Ground floor for activation and lead capture; upper deck for private hospitality. Min. 6×6 m ground; upper deck typically 70–80% of ground.',
    walls: 'Structural — engineer-signed. Staircase is a critical brand moment.',
    stopping_power: 'Highest possible on an expo floor. Reads as a signature building.',
    design_moves:
      'Ground floor as public gallery, upper deck as private meeting suites. Staircase as sculptural feature — either open-tread with brand-colour risers or a wrapped illuminated volume. Below-stair space becomes storage or a poured-espresso station.',
  },
  pop_up: {
    label: 'Pop-up / Street activation',
    footprint: 'Off-expo, in a retail street, mall atrium, transit hub, or public plaza. Footprint dictated by the venue permit — usually 12–40 sqm.',
    walls: 'Freestanding modular. Must strike in under 6 hours and pass local council approval.',
    stopping_power: 'Depends entirely on passer-by conversion — the aisle here is the street. First 1.5 m of frontage must contain the entire promise.',
    design_moves:
      'One monumental typographic statement, one live demonstration, one give-away or capture mechanism. No enclosed zones — everything visible from the street to defuse the "is this for me?" barrier.',
  },
  retail_experience: {
    label: 'Retail experience / Flagship residency',
    footprint: '80–400 sqm inside a rented retail unit or brand flagship. Multi-week to multi-month dwell.',
    walls: 'Real drywall, real finishes. Reads as an interior, not an expo stand.',
    stopping_power: 'Slow — attendees dwell 8–25 minutes on average. The build must reward exploration.',
    design_moves:
      'Sequential rooms with a designed narrative: arrival → discovery → conversion → after-story. Real cash till or lead-capture concierge. Rotating monthly content to justify repeat visits.',
  },
  auditorium_summit: {
    label: 'Auditorium / Summit',
    footprint: 'Purpose-built stage set inside a conference hall. Stage width 6–14 m, plenary seating 200–2000.',
    walls: 'LED wall (typically 6×3 m to 12×5 m, P2.6–P3.9 pitch). Wings for speaker entry, teleprompter, cue displays.',
    stopping_power: 'Captive — attendees are seated. Storytelling and stagecraft matter more than aisle capture.',
    design_moves:
      'The LED wall carries the master theme continuously. Speaker journey down the aisle → onto the plinth → back-lit against the master image. Photography plane must clear the front row.',
  },
  outdoor_festival: {
    label: 'Outdoor festival footprint',
    footprint: '20–200 sqm in a field, festival ground, or open-air expo. Weather-exposed.',
    walls: 'Truss + tension fabric, or a proper marquee / geodesic structure. Rated for wind (typically 60 km/h) and rain.',
    stopping_power: 'Variable — driven by adjacent programming (stages, food, entrances). Sight-lines from the main flow are everything.',
    design_moves:
      'One tall vertical element (banner tower, LED totem, or truss cross) readable from 50 m. Ground activation in the shade side. Weatherproof everything: no exposed screens, no laminated paper.',
  },
  hospitality_suite: {
    label: 'Hospitality suite / Sponsor lounge',
    footprint: 'Rented private room inside a venue, hotel, or arena — 30–150 sqm.',
    walls: 'Existing venue walls, dressed with tension fabric, gobo lighting, and brand-colour uplighting.',
    stopping_power: 'Not applicable — invite-only. The experience is about depth, not capture.',
    design_moves:
      'Zone for conversation (banquette + low table), zone for demo (touch table or short-throw LED), zone for hospitality (bar or barista). One signature object as the visual centrepiece.',
  },
  demo_theatre: {
    label: 'Demo theatre / Mini-plenary inside a booth',
    footprint: 'Programmed 15–20 minute talks inside a larger booth. Seats 12–40 on tiered benches or fold-out chairs.',
    walls: 'Semi-enclosed acoustic panel wall behind the speaker; open toward the aisle so passers-by can join.',
    stopping_power: 'Medium — the crowd itself becomes the aisle stopper. Draws neighbours when it fills.',
    design_moves:
      'Fixed schedule board at the aisle edge. Speaker plinth is at the seated eye-line, not standing eye-line. Small LED behind speaker for slide-plus-face composition.',
  },
}

// ---------------------------------------------------------------------------
// 2. MATERIAL PALETTES — what to specify so renders look photoreal
// ---------------------------------------------------------------------------

export const MATERIAL_PALETTES = {
  gallery_white: {
    label: 'Gallery white (default / editorial)',
    walls: 'Matte white MDF panel with 6 mm shadow-gap reveals; egg-shell finish, not gloss.',
    floors: 'High-gloss white ceramic tile 60×60 cm with 2 mm grout; mirror-like specular but not wet-looking.',
    accents: 'Brushed aluminium trim on wall reveals; pale-oak plinths and shelving; frosted acrylic for backlit signage.',
    joinery: 'CNC-cut MDF with hand-sanded edges; no visible fixings; all screws countersunk and filled.',
    render_prompt:
      'matte white architectural walls with 6 mm shadow-gap reveals, high-gloss white ceramic-tile floor with soft mirror reflections, brushed aluminium trim, pale-oak plinths, frosted acrylic backlit signage panels',
  },
  industrial_technical: {
    label: 'Industrial / technical (engineering brands, energy, logistics)',
    walls: 'Perforated steel mesh panels over black steel frame; brushed stainless where the brand accent touches.',
    floors: 'Polished concrete with a 2% aggregate exposure; sealed matte, not glossy.',
    accents: 'Brand-colour powder-coated tube steel; exposed cable management; industrial pendant lighting.',
    joinery: 'Welded steel; visible bolts as design feature; laser-cut typography instead of vinyl.',
    render_prompt:
      'perforated steel mesh walls, polished concrete floor with matte seal, brand-colour powder-coated steel trim, exposed cable trays overhead, laser-cut steel typography',
  },
  warm_editorial: {
    label: 'Warm editorial (hospitality, consumer, wellness, lifestyle)',
    walls: 'Limewashed plaster in bone / oatmeal; hand-troweled texture visible at raking angles.',
    floors: 'European oak plank floor, matte oil finish, 180 mm plank width; visible knot detail.',
    accents: 'Travertine plinths; unlacquered brass hardware; woven cane inserts on cabinetry.',
    joinery: 'Solid oak with mortise-and-tenon joinery visible as feature.',
    render_prompt:
      'limewashed plaster walls in warm bone tone, wide oak plank floor with matte oil finish, travertine plinths, unlacquered brass hardware, woven cane cabinetry inserts',
  },
  tech_optical: {
    label: 'Tech optical (SaaS, fintech, AI)',
    walls: 'Seamless tension-fabric wall with backlit gradient; light-diffusing polycarbonate for interactive volumes.',
    floors: 'Continuous poured resin floor in cool grey, matte satin finish; no visible seams.',
    accents: 'Anodised aluminium in graphite; frosted glass for touch surfaces; edge-lit acrylic for wayfinding.',
    joinery: 'Machined aluminium — no visible fasteners, tolerances at 0.2 mm.',
    render_prompt:
      'seamless tension-fabric backlit wall, continuous cool-grey poured resin floor, anodised graphite aluminium detailing, frosted glass touch panels, edge-lit acrylic wayfinding',
  },
  cultural_museum: {
    label: 'Cultural / museum (heritage, government, education, sovereign)',
    walls: 'Suede-textured painted plaster in warm charcoal; museum-grade lighting on picture rails.',
    floors: 'End-grain wood block floor or dark quarried stone (basalt / bluestone).',
    accents: 'Bronze plaques etched with primary typography; anti-reflective vitrine glass; oiled-teak plinths.',
    joinery: 'Bench-built cabinetry with mitred returns; conservation-grade UV-filtered lamp fixtures.',
    render_prompt:
      'suede-textured warm charcoal painted plaster walls, end-grain wood block or dark basalt stone floor, etched bronze wall plaques, anti-reflective vitrine cases on oiled teak plinths, museum-grade picture-rail lighting',
  },
}

// ---------------------------------------------------------------------------
// 3. LIGHTING RIGS — how to specify light so it renders correctly
// ---------------------------------------------------------------------------

export const LIGHTING_RIGS = {
  gallery_diffuse: {
    label: 'Gallery-museum diffuse (default)',
    key: '5000 K daylight-balanced ceiling wash from truss-mounted LED panels; 500–800 lux at head height; CRI 95+.',
    accent: 'Warm 3000 K spot on hero object at 3× ambient level; 15° beam angle; PAR-30 form.',
    reveal: 'Brand-colour LED tape along wall shadow-gaps and floor route lines; 2 mm reveal, not a fat glow.',
    render_prompt:
      'soft daylight-balanced ceiling wash from truss-mounted LED panels, warm accent spots on hero objects, brand-colour LED-tape reveals along wall shadow-gaps and floor route lines, no visible fixtures',
  },
  cinematic_low_key: {
    label: 'Cinematic low-key (product reveal, luxury)',
    key: 'Low ambient — 150–250 lux; top-lit only on hero surfaces.',
    accent: 'Hard-edged 3000 K key on the hero volume; 4:1 ratio to ambient; barn doors for spill control.',
    reveal: 'Cool-white edge lights on architectural volumes for shape reading.',
    render_prompt:
      'low ambient lighting, hard-edged warm key light on the hero volume with visible shadow gradient, cool-white edge accents defining architectural shapes',
  },
  daylight_expo: {
    label: 'Daylight expo (large halls with natural roof glazing)',
    key: '5500 K cool daylight through hall roof glazing; 300–500 lux ambient.',
    accent: 'Booth-level warm 3000 K spots to counterbalance and pull the eye down into the stand.',
    reveal: 'Colour-balanced tape lights matching brand colour; must read against the cool ambient.',
    render_prompt:
      'cool daylight from overhead hall glazing, warm 3000 K accent spots inside the booth to counterbalance, brand-colour tape lights colour-corrected to read against the cool ambient',
  },
  theatrical: {
    label: 'Theatrical (auditorium, plenary, keynote)',
    key: '3200 K front key light on stage from front-of-house grid; 800–1200 lux on presenter face.',
    accent: 'Back-light and side-light rim at 5600 K for separation; hazer at 1–3% for beam definition.',
    reveal: 'Programmable LED wall behind speaker; typography rendered at 90+ nits above surrounding light.',
    render_prompt:
      'stage front-key warm light on presenter, cool rim light for separation, low haze for defined beams, LED wall behind speaker rendering typography brightly',
  },
  outdoor_dusk: {
    label: 'Outdoor / dusk activation',
    key: 'Ambient sky at 4000 K falling to 2500 K over the sequence; supplement with warm sodium replacement LEDs.',
    accent: 'Uplight architectural volumes in brand colour; ground-level illumination on foot traffic paths.',
    reveal: 'Silhouette the structure against the sky; typography readable against dusk sky luminance.',
    render_prompt:
      'dusk sky with warm sodium supplement lighting, brand-colour uplight on architectural volumes, ground-level path illumination, structure silhouetted against sky',
  },
}

// ---------------------------------------------------------------------------
// 4. CROWD CASTING BY REGION — never default to Silicon Valley stock
// ---------------------------------------------------------------------------
// Each region entry describes: appearance archetypes, dress codes for the specific event type,
// natural demographics. Used verbatim in image prompts.

export const CROWD_CASTING = {
  west_africa: {
    label: 'West Africa (Nigeria, Ghana, Senegal, Côte d\'Ivoire)',
    countries: ['nigeria', 'ghana', 'senegal', 'ivory coast', 'côte d\'ivoire', 'benin', 'togo', 'sierra leone', 'liberia'],
    appearance:
      'Predominantly Black African, mid-tone to deep-tone brown skin, natural or protective hairstyles (locs, fades, low cuts, braids, wraps).',
    corporate_dress:
      'Men: dark tailored suits or well-cut agbadas / kaftans for senior figures; crisp shirts, minimal ties in oil & gas / infrastructure sectors. Women: sharp tailored blazers, midi skirts or trouser suits; some in ankara-print corporate blouses; head-ties on senior stakeholders.',
    creative_dress:
      'Elevated smart-casual: linen trousers, embroidered kaftans, oversized statement earrings, natural-fibre wraps.',
    context_notes:
      'Business audiences are dense with senior men (40s–60s) in oil, banking, logistics, telecoms; women visibly present in banking, consulting, government relations. Younger technologists (25–35) skew smart-casual with sneakers.',
  },
  east_africa: {
    label: 'East Africa (Kenya, Tanzania, Uganda, Rwanda, Ethiopia)',
    countries: ['kenya', 'tanzania', 'uganda', 'rwanda', 'ethiopia', 'burundi'],
    appearance:
      'Black African, ranging from lighter Horn-of-Africa features (Ethiopia, Eritrea, coastal Kenya) to deep-tone East African. Hair: naturals, locs, low fades, wraps.',
    corporate_dress:
      'Men: European-cut suits at senior level, smart-casual (open collar shirt, blazer, chinos) at working level. Women: tailored suits, dresses under blazers; occasional Kitenge or Kikoy corporate accents.',
    creative_dress:
      'Kenyan and Ethiopian creative professionals lean into pan-African tailoring — cropped trousers, linen shirts, artisan leather.',
    context_notes:
      'Nairobi and Kigali skew younger and more tech-forward; Addis carries a distinct Horn-of-Africa aesthetic. Regional summits pull in East African Community delegates.',
  },
  southern_africa: {
    label: 'Southern Africa (South Africa, Namibia, Botswana, Zimbabwe)',
    countries: ['south africa', 'namibia', 'botswana', 'zimbabwe', 'zambia', 'malawi', 'mozambique', 'lesotho', 'swaziland', 'eswatini'],
    appearance:
      'Multi-ethnic: Black African (majority in most contexts), coloured (mixed heritage — significant in SA and Namibia), Indian-South African, white-African. Cast the mix accordingly, not monolithic.',
    corporate_dress:
      'Corporate Sandton style — sharp Italian-cut suits for men, structured dresses and blazers for women; minimal jewellery at boardroom level.',
    creative_dress:
      'Cape Town creative — linen, canvas, understated Africana motifs; Johannesburg creative — sharper, more urbanwear-influenced.',
    context_notes:
      'The Investec / Discovery / Standard Bank corporate world. Mining and energy audiences skew older and more male; fintech and consumer skew younger and more mixed.',
  },
  north_africa: {
    label: 'North Africa (Egypt, Morocco, Tunisia, Algeria, Libya)',
    countries: ['egypt', 'morocco', 'tunisia', 'algeria', 'libya'],
    appearance:
      'Arab-Berber North African features; skin tones from light olive to warm brown. Men often clean-shaven or with well-groomed beards.',
    corporate_dress:
      'Sharp Franco-Levantine tailoring — slim suits, pocket squares, no-tie collars in Casablanca and Cairo; women in structured suits, some in modest business attire with headscarves in Cairo and parts of Morocco/Algeria.',
    creative_dress:
      'Marrakech creative circles blend European tailoring with djellaba, kaftan, or babouche accents.',
    context_notes:
      'Cairo and Casablanca dominate business events; language of the floor is often French (Maghreb) or Arabic + English (Egypt).',
  },
  middle_east_gcc: {
    label: 'Middle East / GCC (UAE, Saudi, Qatar, Kuwait, Bahrain, Oman)',
    countries: ['uae', 'united arab emirates', 'saudi arabia', 'qatar', 'kuwait', 'bahrain', 'oman', 'dubai', 'abu dhabi', 'riyadh', 'doha'],
    appearance:
      'Cast an authentic Gulf mix: Emirati/Saudi nationals in traditional dress alongside a majority expat workforce. Skin tones from light olive to deep brown.',
    corporate_dress:
      'Nationals: white kandura / thobe with ghutra headscarf and agal for men; black abaya (often designer-tailored) with tasteful hijab for women. Expat workforce: sharp Western business suits — Indian and Pakistani senior expats often in Western tailoring; Levantine and Egyptian expats in sharp Italian suits.',
    creative_dress:
      'Design Week Dubai / Sharjah crowd: architectural minimalism, monochrome, statement eyewear.',
    context_notes:
      'A Gulf render without at least some nationals in traditional dress reads as culturally illiterate. But the working majority is expat — cast both truthfully.',
  },
  south_asia: {
    label: 'South Asia (India, Pakistan, Bangladesh, Sri Lanka)',
    countries: ['india', 'pakistan', 'bangladesh', 'sri lanka', 'nepal'],
    appearance:
      'South Asian features; skin tones from wheat to deep brown; women often with long hair worn down or in a low bun.',
    corporate_dress:
      'Men: dark European-cut suits at senior level, smart shirts + trousers at working level. Women: business sarees and salwar-kameez at senior level (Delhi, Mumbai, Chennai), structured Western suits also common; hijab visible in Muslim-majority regions.',
    creative_dress:
      'Sharp designer takes on kurta-pyjama for men, contemporary saree drapes for women.',
    context_notes:
      'Cast to city: Mumbai and Bangalore skew Western-corporate; Delhi carries more traditional-formal; Kolkata and Chennai carry regional textile detail.',
  },
  southeast_asia: {
    label: 'Southeast Asia (Singapore, Indonesia, Malaysia, Vietnam, Thailand, Philippines)',
    countries: ['singapore', 'indonesia', 'malaysia', 'vietnam', 'thailand', 'philippines', 'jakarta', 'bangkok', 'kuala lumpur', 'ho chi minh'],
    appearance:
      'East Asian and South Asian mix per country. Singapore: Chinese majority, Malay, Indian, Eurasian. Indonesia and Malaysia: Malay majority with visible Chinese and Indian minorities. Vietnam and Thailand: East Asian.',
    corporate_dress:
      'Sharp modern business — slim suits, no-tie shirts common in Singapore; batik-shirt Fridays in Indonesia and Malaysia at government / corporate events; hijab visible for Muslim women in Indonesia and Malaysia.',
    creative_dress:
      'Bangkok and Ho Chi Minh design crowds skew avant-garde streetwear; Singapore is precise minimalism.',
    context_notes:
      'Never render Southeast Asia as monolithic "Asian" — the mix is specific per city.',
  },
  east_asia: {
    label: 'East Asia (China, Japan, Korea, Taiwan, Hong Kong)',
    countries: ['china', 'japan', 'south korea', 'taiwan', 'hong kong', 'shanghai', 'beijing', 'tokyo', 'seoul'],
    appearance:
      'East Asian; hair colours from natural black to fashion-dyed in creative/Gen-Z contexts.',
    corporate_dress:
      'Sharp precise tailoring — Japanese corporate men often in dark blue or charcoal suits with white shirts; Korean corporate slightly more fitted with fashion-forward accents; Chinese corporate leans toward international polish in Shanghai/Beijing.',
    creative_dress:
      'Tokyo: intellectual avant-garde. Seoul: hyper-styled and trend-driven. Shanghai: fashion-forward luxury.',
    context_notes:
      'Distinguish by country — a Tokyo tech expo looks nothing like a Shenzhen expo. Cast to city.',
  },
  europe_western: {
    label: 'Western Europe (UK, Germany, France, Netherlands, Nordics)',
    countries: ['united kingdom', 'uk', 'england', 'germany', 'france', 'netherlands', 'sweden', 'norway', 'denmark', 'finland', 'belgium', 'ireland', 'switzerland', 'austria', 'london', 'berlin', 'paris', 'amsterdam'],
    appearance:
      'Cast to actual city demographics — London and Paris are visibly multi-ethnic (white European majority alongside significant Black, South Asian, North African, East Asian communities). Nordic and Alpine cities skew more homogenously white European.',
    corporate_dress:
      'London: sharper suits with occasional flair; Frankfurt/Munich: precise conservative tailoring; Paris: understated luxury, no tie; Amsterdam: business-casual, sneakers acceptable at seniority.',
    creative_dress:
      'London/Berlin: eclectic; Copenhagen: minimalist Scandi; Paris: quiet luxury.',
    context_notes:
      'Never render London or Paris as all-white — that is factually wrong.',
  },
  europe_south_east: {
    label: 'Southern & Eastern Europe (Italy, Spain, Portugal, Greece, Poland, Turkey)',
    countries: ['italy', 'spain', 'portugal', 'greece', 'poland', 'turkey', 'czech republic', 'romania', 'hungary', 'croatia', 'milan', 'madrid', 'istanbul'],
    appearance:
      'Mediterranean, Slavic, Anatolian features. Italy and Spain: warm olive skin common. Poland/Czech: paler Slavic. Turkey: Anatolian mix.',
    corporate_dress:
      'Milan: Italian tailoring at world-class level — men in perfectly-cut suits, women in structured dresses. Warsaw and Prague: sharper conservative business style. Istanbul: sharp modern tailoring, hijab visible for a minority of women.',
    creative_dress:
      'Milan and Florence: fashion capitals — expect designer-level styling. Barcelona: relaxed sophistication.',
    context_notes:
      'Milan Design Week vs Istanbul Design Week vs Warsaw fintech expo are three very different visual worlds.',
  },
  north_america_us: {
    label: 'North America (USA, Canada)',
    countries: ['usa', 'united states', 'canada', 'new york', 'los angeles', 'san francisco', 'chicago', 'toronto', 'vancouver'],
    appearance:
      'Cast to city. NYC and LA: fully multi-ethnic mix — white, Black, Latinx, East Asian, South Asian. SF Bay: heavy East Asian and South Asian tech presence. Toronto: extreme multi-ethnic mix including South Asian, East Asian, Caribbean. Chicago and Midwest: more white-European majority with significant Black urban presence.',
    corporate_dress:
      'NYC finance: sharp Italian suits; SF tech: quarter-zip fleece and white sneakers at CEO level; LA creative: elevated smart-casual with statement outerwear; Toronto: business-formal Canadian polish.',
    creative_dress:
      'Coastal creative: elevated basics, statement eyewear, minimalist palette. Austin/Portland: outdoor-influenced.',
    context_notes:
      'Never default to "white US business audience" — it is nearly always factually wrong outside of very specific industries and locations.',
  },
  latin_america: {
    label: 'Latin America (Mexico, Brazil, Argentina, Chile, Colombia)',
    countries: ['mexico', 'brazil', 'argentina', 'chile', 'colombia', 'peru', 'uruguay', 'mexico city', 'são paulo', 'sao paulo', 'buenos aires', 'bogota'],
    appearance:
      'Mestizo, Indigenous, Afro-Latin, European-descended — mix varies by country. Mexico: Mestizo majority with visible Indigenous. Brazil: Portuguese-European, Afro-Brazilian, Indigenous, Japanese-Brazilian. Argentina and Uruguay: heavily Southern European descent. Colombia and Peru: strong Mestizo-Indigenous mix.',
    corporate_dress:
      'Sharp European-inspired tailoring at senior level (Buenos Aires especially — Italian-cut suits are standard). Business-casual elsewhere. Bogotá and Lima carry a more conservative business tone.',
    creative_dress:
      'São Paulo: hyper-styled fashion-forward. Mexico City: minimalist-with-craft. Buenos Aires: understated European sophistication.',
    context_notes:
      'Cast to country. A São Paulo tech expo, Buenos Aires finance conference, and Mexico City design fair each carry distinct demographic signatures.',
  },
  australia_nz: {
    label: 'Australia / New Zealand',
    countries: ['australia', 'new zealand', 'sydney', 'melbourne', 'auckland', 'brisbane'],
    appearance:
      'European-descended majority alongside significant East Asian, South Asian, and (in NZ especially) Māori and Pasifika presence.',
    corporate_dress:
      'Sydney finance: sharp modern suits. Melbourne creative: elevated casual with black-forward palette. Auckland: relaxed business-casual.',
    creative_dress:
      'Melbourne is the design capital — expect refined craft-forward looks.',
    context_notes:
      'Never render Australia as all-white — Sydney and Melbourne are extremely multi-ethnic. Auckland demographics include significant Māori and Pasifika representation.',
  },
}

// Resolve a location string ("Lagos, Nigeria" or "Dubai" or "London") to a region key.
export function regionForLocation(location) {
  const s = (location || '').toLowerCase()
  if (!s) return null
  for (const [key, entry] of Object.entries(CROWD_CASTING)) {
    for (const country of entry.countries) {
      if (s.includes(country)) return key
    }
  }
  return null
}

// A single formatted casting brief for a location, dropped straight into an image prompt.
export function castingBrief(location) {
  const key = regionForLocation(location)
  if (!key) {
    return location
      ? `CASTING (location: ${location}): cast humans to match the actual demographic profile of ${location}. Do not default to Silicon Valley or generic Western stock imagery. Business-appropriate attire for the specific city.`
      : ''
  }
  const c = CROWD_CASTING[key]
  return `CASTING (region: ${c.label}, location: ${location}):
- Appearance: ${c.appearance}
- Dress code (corporate context): ${c.corporate_dress}
- Dress code (creative context): ${c.creative_dress}
- Context: ${c.context_notes}
Every human rendered in this scene must match this brief. Do not substitute a Silicon Valley or generic Western demographic.`
}

// ---------------------------------------------------------------------------
// 5. ROI / MEASUREMENT PATTERNS — real event-industry metrics
// ---------------------------------------------------------------------------

export const ROI_PATTERNS = {
  capture_metrics: [
    'Aisle stopping rate — % of aisle passers-by who stop for ≥5 seconds. Industry benchmark: 3–7% inline, 8–15% peninsula, 15–25% island.',
    'Booth dwell time — median seconds a stopped visitor spends inside. Benchmark: 90–180 s for capture booths, 6–15 min for experience booths.',
    'Lead capture rate — % of dwellers who leave contact details. Benchmark: 30–55% at a well-designed capture podium with a value trade.',
    'Qualified lead rate — % of captured leads that match ICP (Ideal Customer Profile) after enrichment. Benchmark: 40–65%.',
    'Sales-accepted lead conversion — % of qualified leads sales accepts. Benchmark: 55–75% inside 14 days.',
    'Pipeline attribution — $ value of pipeline opportunities traceable to the event within 90 days. This is the single number the finance signatory cares about.',
  ],
  intelligence_metrics: [
    'Dwell heatmap — 2D density map of where visitors spent time inside the footprint. Sourced from Wi-Fi triangulation, LiDAR, or overhead camera counting.',
    'Interactive engagement rate — % of visitors who interacted with the signature demo. Benchmark: 40–70% of dwellers.',
    'Twin conversion — % of on-stand interactions that translated to a post-event digital touchpoint (email open, portal login, meeting booked). Benchmark: 25–45%.',
    'Content amplification — organic mentions, share of voice, editorial pickups, PR value equivalent. Reported in reach + estimated $.',
  ],
  cost_benchmarks_uk: {
    label: 'UK / Western Europe booth-build market rates (2024–2026)',
    peninsula_3x6:
      '£22,000 essential / £34,000 signature / £48,000 flagship — for a 3×6 m peninsula custom build including design, structure, AV, install, dismantle, and post-event report. Excludes travel, per-diems, and venue fees.',
    island_6x6:
      '£45,000 essential / £68,000 signature / £95,000 flagship — 6×6 m custom island.',
    activation_pop_up:
      '£12,000 essential / £22,000 signature / £34,000 flagship — 3-day street activation, 12–20 sqm.',
    hospitality_suite:
      '£8,000 essential / £16,000 signature / £26,000 flagship — dressed venue suite for a single day.',
  },
  cost_benchmarks_nigeria: {
    label: 'Nigeria / West Africa booth-build market rates (2024–2026)',
    peninsula_3x6:
      '₦18M essential / ₦28M signature / ₦42M flagship (roughly £9k / £14k / £21k at ~₦2000/£) — Lagos-built 3×6 m peninsula. Cost premium of 30–50% if AV imported.',
    activation_pop_up:
      '₦7M essential / ₦12M signature / ₦20M flagship — mall or street activation over 2–4 days.',
    hospitality_suite:
      '₦4M essential / ₦8M signature / ₦14M flagship — dressed suite for a day inside a Lagos hotel.',
  },
  cost_benchmarks_gcc: {
    label: 'GCC (UAE / Saudi / Qatar) booth-build market rates (2024–2026)',
    peninsula_3x6:
      'AED 130,000 essential / AED 200,000 signature / AED 285,000 flagship (roughly £28k / £43k / £62k) — Dubai or Riyadh custom peninsula. Saudi is currently ~15–25% premium on Dubai due to import + local content requirements.',
    activation_pop_up:
      'AED 65,000 essential / AED 110,000 signature / AED 180,000 flagship — Dubai Mall or DIFC activation.',
    hospitality_suite:
      'AED 45,000 essential / AED 85,000 signature / AED 140,000 flagship — 5-star hotel suite dressed for a day.',
  },
  payment_terms_default: '60% on scope lock / 30% on event day / 10% on final report. For events >12 weeks out, 40/40/20.',
  attribution_stack:
    'Capture (lead form) → Twin (digital counterpart of booth interaction) → Ask (post-event survey or content prompt) → Attraction/Attribution/Action framework tying an aisle-stopper impression to a booked meeting to a closed opportunity.',
}

// ---------------------------------------------------------------------------
// 6. EVENT ARCHETYPES — what event this is and what it demands
// ---------------------------------------------------------------------------

export const EVENT_ARCHETYPES = {
  b2b_trade_show: {
    label: 'B2B trade show / industry expo',
    example_shows: 'Gastech, ADIPEC, MWC, Money20/20, IBC, NRF, Big 5, IFSEC',
    scale: 'Hundreds of exhibitors, thousands to tens of thousands of attendees, 2–5 days.',
    attendee_intent: 'Discovery + comparison + relationship. Attendees walk multiple aisles and stack meetings.',
    winning_formula:
      'Aisle stopping power + a signature memorable activation + genuine ability to hold a 15-minute conversation with a qualified buyer. Post-event follow-up is where the pipeline actually converts.',
  },
  industry_summit: {
    label: 'Industry summit / conference',
    example_shows: 'CERAWeek, Davos, Africa CEO Forum, GITEX Global',
    scale: 'Selective — hundreds to low thousands of senior attendees, 1–3 days.',
    attendee_intent: 'Peer recognition + thought leadership + private conversations.',
    winning_formula:
      'A hospitality footprint, not a booth. A programmed private conversation series, a signature dinner, a briefing paper delivered to attendees\' hotel rooms. The show floor is secondary to the invite list.',
  },
  regulator_forum: {
    label: 'Regulator / policy forum',
    example_shows: 'HSSE forums, GRC forums, ESG summits, industry association AGMs',
    scale: 'Sector-specific — hundreds of attendees, 1–3 days.',
    attendee_intent: 'Compliance + benchmarking + relationships with the regulator.',
    winning_formula:
      'Credibility signalling above all. Real numbers, real people from your operations, no marketing gloss. A quiet white peninsula with data on the wall beats a flashy activation. Presence of technical leadership on stand matters more than the booth.',
  },
  consumer_expo: {
    label: 'Consumer / retail expo',
    example_shows: 'Salone del Mobile, Milan Fashion Week, CES consumer floor, Comic-Con, Web Summit consumer',
    scale: 'Mass — tens of thousands to hundreds of thousands, 3–7 days.',
    attendee_intent: 'Discovery + Instagrammable moment + social validation.',
    winning_formula:
      'One monumental photographable moment. A queue-worthy interactive. A giveaway or content unlock. Social share rate is the leading indicator.',
  },
  product_launch: {
    label: 'Product launch / brand reveal',
    example_shows: 'Apple keynote, automotive reveals, Nike drop events, pharma product days',
    scale: 'Curated — hundreds of press + partners + influencers, half-day to 1 day.',
    attendee_intent: 'Witness the launch, generate content, be seen there.',
    winning_formula:
      'One theatrical reveal moment. Broadcast-quality photography and video. A press package that writes the story for the attendees.',
  },
  activation_pop_up: {
    label: 'Street activation / pop-up',
    example_shows: 'Selfridges activations, Nike NYC pop-ups, Netflix launch takeovers',
    scale: 'Public — passer-by driven, 1–14 days.',
    attendee_intent: 'Serendipitous — not seeking the brand, discovering it.',
    winning_formula:
      'First 3 seconds must land the promise. One immediately obvious value trade (photo op, free product, unique unlock). Social virality is the KPI.',
  },
  investor_showcase: {
    label: 'Investor / demo day',
    example_shows: 'YC Demo Day, Web3 Summit, Slush pitch stages',
    scale: 'Selective — dozens to hundreds of investors + reporters, half-day.',
    attendee_intent: 'Deal-flow discovery + comparison shopping across startups.',
    winning_formula:
      'The founders are the experience — booth is minimal, pitch is everything. If a booth is used at all, it exists to hold two chairs and a coffee.',
  },
  cultural_biennale: {
    label: 'Cultural biennale / design week',
    example_shows: 'Venice Biennale, Milan Design Week, Dutch Design Week, London Design Festival',
    scale: 'Distributed — city-wide, thousands of installations, 1–2 weeks.',
    attendee_intent: 'Cultural discovery + intellectual reference-building.',
    winning_formula:
      'A curated installation, not a booth. Real materials, real craft, real ideas. Commercial signage is culturally penalised — the work must speak.',
  },
}

// ---------------------------------------------------------------------------
// 7. SIGNAGE, WAYFINDING, TYPOGRAPHY — how brands actually appear on-floor
// ---------------------------------------------------------------------------

export const SIGNAGE_LANGUAGE = {
  wall_mounted_type: {
    label: 'Wall-mounted typography',
    spec:
      'Push-through acrylic letters in brand colour on matte white wall, 12–18 mm proud of surface, LED-back-lit for a soft halo. Type: bold Swiss-style sans-serif (think Söhne, Neue Haas Grotesk, Helvetica Now, Söhne Breit, Untitled Sans). Letter height 180–320 mm for hero, 60–90 mm for supporting.',
    render_prompt:
      'push-through acrylic typography in brand colour, 15 mm proud of matte white wall with soft LED halo backlight, bold Swiss-style sans-serif typeface, hero letters 250 mm tall',
  },
  overhead_identity: {
    label: 'Overhead / soffit identity',
    spec:
      'Floating soffit or ring truss carrying the brand identity above the booth. Height off the floor: 2.7–3.4 m clear. Identity is either edge-lit acrylic or projected. Never a fabric banner (reads cheap).',
    render_prompt:
      'floating illuminated overhead soffit or ring truss carrying the brand identity, 2.9 m clear height, edge-lit acrylic identity, not fabric',
  },
  aisle_edge_stopper: {
    label: 'Aisle-edge stopper',
    spec:
      'Vertical stopping element visible from 15 m down the aisle. Options: tall (2.4–3.2 m) illuminated totem with rotating LED content; sculptural product-mounted-on-plinth; a live person doing a demo.',
    render_prompt:
      'a 2.7 m tall aisle-edge stopping element (illuminated totem, or a sculpted product plinth, or a live demo station) visible from far down the aisle',
  },
  floor_route_lines: {
    label: 'Floor route lines',
    spec:
      'Inset LED strip or vinyl in brand colour flush with the floor finish; typically 12–20 mm wide; guides visitor circulation from arrival to signature to capture. On gloss floors the reflection doubles the visual weight.',
    render_prompt:
      'brand-colour inset LED strips or flush vinyl running along the floor, 15 mm wide, guiding circulation with a matching soft reflection in the gloss floor finish',
  },
  data_wall: {
    label: 'Data wall / intelligence wall',
    spec:
      'A back-wall dashboard showing live or curated brand operating stats. Numbers rendered at 220–320 mm tall in brand colour on white. Labels 40–60 mm in dark charcoal or graphite grey. Wire-thin dividers, no chart junk.',
    render_prompt:
      'a curated back-wall dashboard showing 4–6 key operating statistics rendered at large scale in brand colour on white, with wire-thin dividers and dark-charcoal labels; no chart junk, no faux 3D',
  },
  vitrine_object: {
    label: 'Vitrine / plinth object',
    spec:
      'A single defensible product or artefact on a museum-grade plinth under anti-reflective glass. Plinth: pale oak or travertine, 900 mm tall, 400×400 mm top. Object is spotlit with a 15° warm PAR-30 at 3× ambient.',
    render_prompt:
      'a single object on a 900 mm tall pale-oak or travertine plinth under anti-reflective vitrine glass, spotlit with a warm 15° PAR-30 spot at three times the ambient light level, museum-grade presentation',
  },
}

// ---------------------------------------------------------------------------
// 8. AV / INTERACTIVE TECH — what's actually specifiable
// ---------------------------------------------------------------------------

export const AV_INTERACTIVE = {
  led_wall: {
    label: 'LED video wall',
    spec:
      'P2.5–P3.9 pitch indoor LED tiles, seamless. Common sizes: 3×2 m (6 sqm), 4×2.5 m (10 sqm), 6×3 m (18 sqm). Content at 1920×1080 minimum, ideally native pixel-mapped. Processor: Novastar or Brompton. Refresh 3840 Hz for broadcast.',
    render_prompt:
      'seamless indoor LED video wall at P3 pitch, edge-to-edge with no visible tile grid at 3 m viewing distance, playing brand hero content, no visible bezel',
  },
  short_throw_projection: {
    label: 'Short-throw projection',
    spec:
      '4K laser short-throw projectors (Epson EB-810E, Christie DWU850-GS) onto matte white wall or floor. 5000–7000 lumens for expo hall daylight. Not suitable if hall ambient exceeds 800 lux.',
    render_prompt:
      '4K short-throw laser projection onto a matte white wall or floor, sharp and bright even at hall ambient light',
  },
  touch_table: {
    label: 'Interactive touch table',
    spec:
      '55–86" 4K PCAP touch surface at 900 mm height, canted 10° for reading. Content: brand configurator, digital twin, product selector. Supports up to 20 simultaneous touch points.',
    render_prompt:
      'a 65" 4K touch table set at 900 mm height with a 10° reading cant, running a brand configurator with multi-touch interaction',
  },
  simulator_controller: {
    label: 'Signature simulator / controller experience',
    spec:
      'A single seat + a real controller (steering wheel, joystick, HOTAS, physical console) driving a bespoke scenario game. 3–5 minute session. Leaderboard drives repeat play.',
    render_prompt:
      'a signature simulator: a single seat with a real physical controller (steering wheel or joystick), a large screen in front, and a live leaderboard behind — visitor is mid-session, engaged',
  },
  ar_mirror: {
    label: 'AR mirror / body-tracking',
    spec:
      'Vertical 65–85" screen with front-facing depth camera. Overlays product, brand content, or scan visualisation on the visitor. Photo-share unlock.',
    render_prompt:
      'a vertical body-scale AR mirror with front-facing depth camera, overlaying brand content on the visitor, ending in a photo-share unlock',
  },
  vr_pod: {
    label: 'VR / immersive pod',
    spec:
      'Enclosed 2×2 m volume with acoustic panelling, single Quest 3 or Vive Focus headset, seated or stand-and-turn. 4–6 minute experience. Attendant required for hygiene turnover.',
    render_prompt:
      'a 2×2 m enclosed VR pod with acoustic panelling, one visitor mid-experience with a headset on, an attendant nearby',
  },
  lead_capture_podium: {
    label: 'Lead capture podium',
    spec:
      '900 mm tall podium with an inset iPad or Surface, custom-branded capture form: name → email → 3 interest tags → optional company. Enrichment fires immediately from a webhook to the CRM. QR alternative for touchless.',
    render_prompt:
      'a 900 mm tall custom lead-capture podium with an inset tablet running a branded capture form, one visitor mid-input, subtle brand-colour edge lighting',
  },
  espresso_station: {
    label: 'Poured-espresso station',
    spec:
      'Real barista behind a compact 2.5 m bar with a proper commercial espresso machine (La Marzocco Linea Mini or GS3), branded apron, ceramic branded cups. Not a Nespresso pod machine — the ritual is the point.',
    render_prompt:
      'a real barista in a branded apron behind a compact 2.5 m espresso bar with a commercial espresso machine, ceramic branded cups, mid-pour on an espresso shot',
  },
  scent_diffusion: {
    label: 'Scent diffusion',
    spec:
      'HVAC-integrated aroma diffuser (Aera Pro, ScentAir) with a bespoke fragrance briefed from the brand palette. 30–50 sqm coverage per unit. Never noticeable — should register only after visitors leave and remember it.',
    render_prompt:
      '(invisible in render) HVAC-integrated scent diffusion of a bespoke brand fragrance, atmospheric only',
  },
  live_signing_wall: {
    label: 'Signed ledger / commitment wall',
    spec:
      'Matte white acrylic wall with a curated prompt in dark charcoal at eye height, with real pens on a small ledge. Visitors sign, leave notes, take a photo. Wall is retained post-event.',
    render_prompt:
      'a matte white acrylic wall with a single curated prompt at eye height in dark charcoal, real pens on a small ledge, visitors mid-signing, hundreds of previous signatures already visible',
  },
}

// ---------------------------------------------------------------------------
// contextFor(brand, deckType) — the compact prompt-ready slice
// ---------------------------------------------------------------------------
// Given brand.location + brand.eventType (optional inference), return a
// bounded text block the planner and painter can inject into every prompt.

export function contextFor(brand = {}) {
  const location = brand.location || ''
  const eventDescription = brand.event || ''

  const casting = castingBrief(location)
  const eventArchetype = inferEventArchetype(eventDescription, brand)

  const parts = []
  if (casting) parts.push(casting)
  if (eventArchetype) {
    parts.push(
      `EVENT ARCHETYPE (${eventArchetype.label}): ${eventArchetype.winning_formula} Attendee intent: ${eventArchetype.attendee_intent}`,
    )
  }
  return parts.join('\n\n')
}

function inferEventArchetype(eventDescription = '', brand = {}) {
  const s = (eventDescription + ' ' + (brand.description || '') + ' ' + (brand.audiences || '')).toLowerCase()
  if (/regulator|hsse|compliance|policy|forum|agm/.test(s)) return EVENT_ARCHETYPES.regulator_forum
  if (/investor|demo day|pitch/.test(s)) return EVENT_ARCHETYPES.investor_showcase
  if (/design week|biennale|festival|milan|venice/.test(s)) return EVENT_ARCHETYPES.cultural_biennale
  if (/consumer|retail|cx|fashion|comic-con|web summit/.test(s)) return EVENT_ARCHETYPES.consumer_expo
  if (/pop-up|activation|street|takeover/.test(s)) return EVENT_ARCHETYPES.activation_pop_up
  if (/launch|reveal|keynote/.test(s)) return EVENT_ARCHETYPES.product_launch
  if (/summit|davos|ceraweek|ceo forum/.test(s)) return EVENT_ARCHETYPES.industry_summit
  if (/expo|trade show|adipec|gastech|mwc|money20/.test(s)) return EVENT_ARCHETYPES.b2b_trade_show
  // Sensible default for immersive-brand-experience work.
  return EVENT_ARCHETYPES.b2b_trade_show
}

// A larger reference block for the planner — dense, structured, cached once per plan call.
export function plannerKnowledgeBlock(brand = {}) {
  const arche = inferEventArchetype(brand.event || '', brand)
  const casting = castingBrief(brand.location || '')

  // Pick two most relevant material palettes based on brand color and description.
  const paletteKeys = ['gallery_white']
  const desc = (brand.description || '').toLowerCase()
  if (/oil|gas|logistics|energy|manufactur|infrastructure/.test(desc)) paletteKeys.push('industrial_technical')
  else if (/tech|saas|fintech|ai|software|platform/.test(desc)) paletteKeys.push('tech_optical')
  else if (/hospitality|lifestyle|wellness|consumer/.test(desc)) paletteKeys.push('warm_editorial')
  else if (/culture|heritage|government|museum|policy/.test(desc)) paletteKeys.push('cultural_museum')

  const palettes = paletteKeys.map((k) => `- ${MATERIAL_PALETTES[k].label}: ${MATERIAL_PALETTES[k].render_prompt}`).join('\n')

  // Pick most relevant booth typology.
  const eventLower = (brand.event || '').toLowerCase()
  let typologyKey = 'peninsula'
  if (/inline|linear|3x3|3 ?× ?3/.test(eventLower)) typologyKey = 'inline'
  else if (/island|6x6|6 ?× ?6|20x20/.test(eventLower)) typologyKey = 'island'
  else if (/double.?deck|two.?storey/.test(eventLower)) typologyKey = 'double_deck'
  else if (/pop.?up|street|activation/.test(eventLower)) typologyKey = 'pop_up'
  else if (/summit|plenary|auditorium|stage/.test(eventLower)) typologyKey = 'auditorium_summit'
  else if (/outdoor|festival|open.?air/.test(eventLower)) typologyKey = 'outdoor_festival'
  else if (/lounge|suite|hospitality/.test(eventLower)) typologyKey = 'hospitality_suite'
  else if (/retail|residency|flagship/.test(eventLower)) typologyKey = 'retail_experience'
  const typology = BOOTH_TYPOLOGIES[typologyKey]

  // ROI benchmark by location.
  let costKey = 'cost_benchmarks_uk'
  const region = regionForLocation(brand.location || '')
  if (region === 'west_africa' || region === 'east_africa' || region === 'southern_africa') costKey = 'cost_benchmarks_nigeria'
  else if (region === 'middle_east_gcc') costKey = 'cost_benchmarks_gcc'
  const costs = ROI_PATTERNS[costKey]

  return `
DOMAIN CONTEXT — read this before writing the deck. This is real event-industry knowledge.

EVENT ARCHETYPE: ${arche.label}
Attendee intent: ${arche.attendee_intent}
Winning formula: ${arche.winning_formula}
Comparable shows: ${arche.example_shows}

BOOTH TYPOLOGY (best fit for this footprint): ${typology.label}
${typology.footprint}
Stopping power: ${typology.stopping_power}
Design moves: ${typology.design_moves}

MATERIAL PALETTES (specify one of these on every architectural render):
${palettes}

LIGHTING (default): ${LIGHTING_RIGS.gallery_diffuse.render_prompt}
LIGHTING (dramatic alternative): ${LIGHTING_RIGS.cinematic_low_key.render_prompt}

SIGNAGE + TYPOGRAPHY: ${SIGNAGE_LANGUAGE.wall_mounted_type.spec}
DATA WALL: ${SIGNAGE_LANGUAGE.data_wall.spec}
VITRINE OBJECT: ${SIGNAGE_LANGUAGE.vitrine_object.spec}
AISLE-EDGE STOPPER: ${SIGNAGE_LANGUAGE.aisle_edge_stopper.spec}

AV / INTERACTIVE INVENTORY (pick per zone, do not stack every item):
- LED wall: ${AV_INTERACTIVE.led_wall.spec}
- Touch table: ${AV_INTERACTIVE.touch_table.spec}
- Signature simulator: ${AV_INTERACTIVE.simulator_controller.spec}
- Lead capture podium: ${AV_INTERACTIVE.lead_capture_podium.spec}
- Espresso station (flagship only by default): ${AV_INTERACTIVE.espresso_station.spec}
- Signed ledger wall: ${AV_INTERACTIVE.live_signing_wall.spec}

MEASUREMENT / ROI PATTERNS:
${ROI_PATTERNS.capture_metrics.map((x) => '- ' + x).join('\n')}
Attribution stack: ${ROI_PATTERNS.attribution_stack}

COMMERCIAL PRICING BENCHMARK (${costs.label}):
- Peninsula 3×6: ${costs.peninsula_3x6 || '(not specified for this region)'}
- Pop-up activation: ${costs.activation_pop_up || '(not specified)'}
- Hospitality suite: ${costs.hospitality_suite || '(not specified)'}
- Payment terms default: ${ROI_PATTERNS.payment_terms_default}

${casting}
`.trim()
}

// A short slice for injection into individual image prompts.
export function painterKnowledgeSlice(brand = {}) {
  const casting = castingBrief(brand.location || '')
  const materialKey =
    /oil|gas|logistics|energy|infrastructure/.test((brand.description || '').toLowerCase())
      ? 'industrial_technical'
      : /tech|saas|fintech|ai/.test((brand.description || '').toLowerCase())
      ? 'tech_optical'
      : 'gallery_white'
  const material = MATERIAL_PALETTES[materialKey]

  return [
    `Material specification: ${material.render_prompt}.`,
    `Lighting: ${LIGHTING_RIGS.gallery_diffuse.render_prompt}.`,
    casting || '',
  ]
    .filter(Boolean)
    .join(' ')
}
