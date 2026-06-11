// Mutable, render-free shared state. App writes it from its scroll RAF;
// the Three.js scene reads it inside useFrame. No re-renders involved.
export const scene = {
  progress: 0,     // eased journey progress 0..1
  rawProgress: 0,  // un-eased (instant) progress 0..1
  velocity: 0,     // |scroll delta| this frame, normalized-ish — drives bob/dust
  pointerX: 0,     // eased pointer, -1..1
  pointerY: 0,
  reduceMotion: false,
  // click-to-enter: App registers onEnter; scene calls it when a centred
  // landmark is clicked. zoom.t (0→1) drives the "dive into the landmark".
  onEnter: null,
  hoverIndex: -1,
  zoom: { active: false, index: -1, t: 0 },
}

// expose for screenshot/debug harness only
if (typeof window !== 'undefined') window.__SCENE = scene

// ── journey layout ───────────────────────────────────────────────────────────
// Seven milestones spread across the scroll. Boy walks between them and dwells
// (idles / talks / waves) inside each arrival window.
export const START = 0.07
export const END = 0.95
export const N = 7
export const ARRIVE_HALF = 0.062 // half-width of a "dwell at the stop" window

// normalized travel position across the scenes: 0 (scene 0 centred) → N-1
export const travelPos = (progress) => clamp((progress - START) / (END - START), 0, 1) * (N - 1)

export const milestoneCenter = (i) => START + (END - START) * (i / (N - 1))
export const CENTERS = Array.from({ length: N }, (_, i) => milestoneCenter(i))

// nearest milestone + how "arrived" we are (0 walking … 1 fully at the stop)
export function arrivalInfo(progress) {
  let best = 0, bestD = Infinity
  for (let i = 0; i < N; i++) {
    const d = Math.abs(progress - CENTERS[i])
    if (d < bestD) { bestD = d; best = i }
  }
  const arrived = Math.max(0, 1 - bestD / ARRIVE_HALF) // 1 at center → 0 at edge
  return { index: best, dist: progress - CENTERS[best], arrived }
}

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
export const lerp = (a, b, t) => a + (b - a) * t
// smootherstep 0..1
export const smooth = (t) => { t = clamp(t, 0, 1); return t * t * t * (t * (t * 6 - 15) + 10) }
