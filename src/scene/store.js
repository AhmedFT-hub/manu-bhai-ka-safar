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
export const START = 0.05 // brief hero intro before scene 1 settles
export const END = 1.0    // last scene is centred exactly at the bottom — no dead scroll
export const N = 7

// Dwell plateau: hold near each scene for a generous stretch of scroll, then
// transition only through the middle of each gap. This gives the user an ample,
// forgiving zone to land centred on every landmark (instead of a knife-edge).
function dwellEase(f) {
  const lo = 0.30, hi = 0.70 // 60% of each gap is "landed", 40% is the move
  if (f <= lo) return 0
  if (f >= hi) return 1
  return smooth((f - lo) / (hi - lo))
}

// travel position across the scenes: 0 (scene 0 centred) → N-1 (last centred)
export function travelPos(progress) {
  const raw = clamp((progress - START) / (END - START), 0, 1) * (N - 1)
  const k = Math.floor(raw)
  if (k >= N - 1) return N - 1
  return k + dwellEase(raw - k)
}

// current milestone + how "arrived"/landed we are (1 = centred, 0 = mid-transition)
export function arrivalInfo(progress) {
  const tp = travelPos(progress)
  const index = clamp(Math.round(tp), 0, N - 1)
  const dist = tp - index
  const arrived = clamp(1 - Math.abs(dist) / 0.5, 0, 1)
  return { index, dist, arrived, tp }
}

export const milestoneCenter = (i) => START + (END - START) * (i / (N - 1))
export const CENTERS = Array.from({ length: N }, (_, i) => milestoneCenter(i))

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
export const lerp = (a, b, t) => a + (b - a) * t
// smootherstep 0..1
export const smooth = (t) => { t = clamp(t, 0, 1); return t * t * t * (t * (t * 6 - 15) + 10) }
