import { useState } from 'react'
import DeckList from './components/DeckList.jsx'
import DeckEditor from './components/DeckEditor.jsx'

export default function App() {
  const [deckId, setDeckId] = useState(null)

  return deckId ? (
    <DeckEditor deckId={deckId} onBack={() => setDeckId(null)} />
  ) : (
    <DeckList onOpen={setDeckId} />
  )
}
