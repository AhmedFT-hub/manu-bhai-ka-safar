// Cleaned, web-ready assets live in /public (served at /scene/…), as WebP for
// fast loading. ?v=N busts the browser cache when the assets are regenerated.
const V = '13'
const B = `/scene`
const u = (name) => `${B}/${name}?v=${V}`

// Seven complete, full-bleed scenes — one per milestone — that we travel through.
export const SCENES = [
  u('scn1.webp'), u('scn2.webp'), u('scn3.webp'),
  u('scn4.webp'), u('scn5.webp'), u('scn6.webp'), u('scn7.webp'),
]

// One consistent character throughout (from character_anim / birthday_anim):
// walk cycle while moving, a single standing frame at rest, celebration at the end.
export const BOY = {
  walkStrip: u('boy-walk-strip.webp'), // 10-frame walk cycle, horizontal
  walkFrames: 10,
  walkAspect: 190 / 318,
  stand: u('boy-stand.webp'), // upright standing frame (frame 5 of the walk)
  standAspect: 152 / 312,
  front: u('boy-front.webp'), // facing the viewer — used at the village entrance
  frontAspect: 292 / 640,
  celebrateStrip: u('boy-celebrate-strip.webp'), // 6-frame finale celebration loop
  celebrateFrames: 6,
  celebrateAspect: 300 / 377,
}
