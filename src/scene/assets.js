// Cleaned, web-ready assets live in /public (served at /scene/…), as WebP for
// fast loading. ?v=N busts the browser cache when the assets are regenerated.
const V = '10'
const B = `/scene`
const u = (name) => `${B}/${name}?v=${V}`

// Seven complete, full-bleed scenes — one per milestone — that we travel through.
export const SCENES = [
  u('scn1.webp'), u('scn2.webp'), u('scn3.webp'),
  u('scn4.webp'), u('scn5.webp'), u('scn6.webp'), u('scn7.webp'),
]

export const BOY = {
  walkStrip: u('boy-walk-strip.webp'), // 10-frame walk cycle, horizontal
  walkFrames: 10,
  walkAspect: 188 / 321,
  idle:  u('boy-idle.webp'),
  wave:  u('boy-wave.webp'),
  talk:  u('boy-talk.webp'),
  celebrateStrip: u('boy-celebrate-strip.webp'), // 6-frame finale celebration loop
  celebrateFrames: 6,
  celebrateAspect: 266 / 380,
}
