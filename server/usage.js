import fs from 'node:fs'
import path from 'node:path'

const FILE = path.resolve('data', 'usage.jsonl')
fs.mkdirSync(path.dirname(FILE), { recursive: true })

export function recordUsage(entry) {
  const line = JSON.stringify({ ts: Date.now(), ...entry })
  fs.appendFileSync(FILE, line + '\n')
  return entry
}

export function readUsage() {
  if (!fs.existsSync(FILE)) return []
  return fs
    .readFileSync(FILE, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((l) => {
      try {
        return JSON.parse(l)
      } catch {
        return null
      }
    })
    .filter(Boolean)
}

export function usageSummary(deckId = null) {
  const all = readUsage()
  const entries = deckId ? all.filter((e) => e.deckId === deckId) : all
  const total = entries.reduce((s, e) => s + (e.cost || 0), 0)
  const byKind = {}
  const byDeck = {}
  for (const e of entries) {
    byKind[e.kind] = (byKind[e.kind] || 0) + (e.cost || 0)
    if (e.deckId) byDeck[e.deckId] = (byDeck[e.deckId] || 0) + (e.cost || 0)
  }
  return {
    total,
    byKind,
    byDeck,
    calls: entries.length,
    recent: all.slice(-30).reverse(),
  }
}
