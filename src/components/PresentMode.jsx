import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export default function PresentMode({ deck, startIndex = 0, onClose }) {
  const slides = deck.slides.filter((s) => s.image)
  const [index, setIndex] = useState(Math.min(startIndex, Math.max(0, slides.length - 1)))

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight' || e.key === ' ') setIndex((i) => Math.min(i + 1, slides.length - 1))
      else if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slides.length, onClose])

  if (slides.length === 0) return null
  const slide = slides[index]

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <img src={slide.image} alt={slide.title} className="max-w-full max-h-full object-contain" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-zinc-500 text-sm">
        {index + 1} / {slides.length} · ← → navigate · Esc exit
      </div>
      <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
        <X className="w-6 h-6" />
      </button>
    </div>
  )
}
