import { zipSync } from 'fflate'
import { jsPDF } from 'jspdf'

function slug(s) {
  return (s || 'deck').replace(/[^\w-]+/g, '_').slice(0, 60)
}

function ratioDims(ratio) {
  const [w = 16, h = 9] = (ratio || '16:9').split(':').map(Number)
  const W = 1600
  return [W, Math.round((W * h) / w)]
}

function downloadBlob(blob, name) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  a.click()
  URL.revokeObjectURL(a.href)
}

async function fetchBlob(url) {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch ${url}`)
  return res.blob()
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export async function exportZip(deck) {
  const slides = deck.slides.filter((s) => s.image)
  if (!slides.length) throw new Error('No generated slides to export')
  const files = {}
  for (let i = 0; i < slides.length; i++) {
    const ext = slides[i].image.split('.').pop()
    const buf = new Uint8Array(await (await fetchBlob(slides[i].image)).arrayBuffer())
    files[`${String(i + 1).padStart(2, '0')}-${slug(slides[i].title) || 'slide'}.${ext}`] = [buf, { level: 0 }]
  }
  downloadBlob(new Blob([zipSync(files)], { type: 'application/zip' }), `${slug(deck.title)}.zip`)
}

export async function exportPdf(deck) {
  const slides = deck.slides.filter((s) => s.image)
  if (!slides.length) throw new Error('No generated slides to export')
  const [w, h] = ratioDims(deck.aspectRatio)
  const orientation = w >= h ? 'landscape' : 'portrait'
  const pdf = new jsPDF({ orientation, unit: 'px', format: [w, h] })
  for (let i = 0; i < slides.length; i++) {
    if (i > 0) pdf.addPage([w, h], orientation)
    const dataUrl = await blobToDataUrl(await fetchBlob(slides[i].image))
    pdf.addImage(dataUrl, 'PNG', 0, 0, w, h)
  }
  pdf.save(`${slug(deck.title)}.pdf`)
}
