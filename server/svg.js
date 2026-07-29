// SVG -> PNG rasterization.
// Nano Banana Pro (and the vision verifier) accept raster pixels only — never vector XML.
// Any SVG a user uploads (logo, slide reference) must be rasterized before it can be used
// as AI input. We still keep and serve the original SVG for crisp on-screen display.

import { Resvg } from '@resvg/resvg-js'

// Rasterize SVG bytes to a PNG buffer. Fits to a max width/height while preserving aspect
// ratio (most brand logos and reference boards don't need to exceed ~1024px for vision input).
// Background is transparent by default (matches typical logo SVGs); pass `background` to matte it.
export function rasterizeSvgToPng(svgBuffer, { maxSize = 1024, background } = {}) {
  const opts = { fitTo: { mode: 'width', value: maxSize } }
  if (background) opts.background = background
  const resvg = new Resvg(svgBuffer, opts)
  const rendered = resvg.render()
  return rendered.asPng()
}
