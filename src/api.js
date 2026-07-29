async function req(method, url, body, isForm = false) {
  const res = await fetch(url, {
    method,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
    headers: isForm ? undefined : body ? { 'Content-Type': 'application/json' } : undefined,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`)
  return json
}

export const api = {
  listDecks: () => req('GET', '/api/decks'),
  createDeck: (title) => req('POST', '/api/decks', { title }),
  getDeck: (id) => req('GET', `/api/decks/${id}`),
  saveDeck: (deck) => req('PUT', `/api/decks/${deck.id}`, deck),
  deleteDeck: (id) => req('DELETE', `/api/decks/${id}`),
  generate: (deckId, slideId, prompt) => req('POST', '/api/generate', { deckId, slideId, prompt }),
  outline: (deckId, topic, count) => req('POST', '/api/outline', { deckId, topic, count }),
  uploadContext: (formData) => req('POST', '/api/context-upload', formData, true),
  agents: () => req('GET', '/api/agents'),
  planAgent: (payload) => req('POST', '/api/agent/plan', payload),
  uploadAssets: (deckId, formData) => req('POST', `/api/decks/${deckId}/assets`, formData, true),
  usage: (deckId) => req('GET', `/api/usage${deckId ? `?deckId=${deckId}` : ''}`),
}
