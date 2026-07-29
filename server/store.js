import fs from 'node:fs'
import path from 'node:path'

const DATA = path.resolve('data')
const DECKS = path.join(DATA, 'decks')
export const IMAGES = path.join(DATA, 'images')

for (const dir of [DECKS, IMAGES]) fs.mkdirSync(dir, { recursive: true })

export function newId(prefix = '') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function deckFile(id) {
  return path.join(DECKS, `${id}.json`)
}

export function listDecks() {
  return fs
    .readdirSync(DECKS)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      try {
        const d = JSON.parse(fs.readFileSync(path.join(DECKS, f), 'utf8'))
        return {
          id: d.id,
          title: d.title,
          updatedAt: d.updatedAt,
          slideCount: d.slides?.length || 0,
          thumb: d.slides?.find((s) => s.image)?.image || null,
        }
      } catch {
        return null
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.updatedAt - a.updatedAt)
}

export function getDeck(id) {
  const file = deckFile(id)
  if (!fs.existsSync(file)) return null
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

export function saveDeck(deck) {
  deck.updatedAt = Date.now()
  fs.writeFileSync(deckFile(deck.id), JSON.stringify(deck, null, 2))
  return deck
}

export function createDeck(title) {
  const deck = {
    id: newId('d_'),
    title: title || 'Untitled deck',
    style: '',
    aspectRatio: '16:9',
    resolution: '2K',
    context: [],
    slides: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  fs.writeFileSync(deckFile(deck.id), JSON.stringify(deck, null, 2))
  return deck
}

export function deleteDeck(id) {
  const file = deckFile(id)
  if (fs.existsSync(file)) fs.unlinkSync(file)
  const imgDir = path.join(IMAGES, id)
  if (fs.existsSync(imgDir)) fs.rmSync(imgDir, { recursive: true, force: true })
}

export function imageDir(deckId) {
  const dir = path.join(IMAGES, deckId)
  fs.mkdirSync(dir, { recursive: true })
  return dir
}
