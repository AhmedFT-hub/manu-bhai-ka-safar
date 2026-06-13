// Cleaned, web-ready assets live in /public (served at /scene/…), as WebP for
// fast loading. ?v=N busts the browser cache when the assets are regenerated.
const V = '18'
const B = `/scene`
const u = (name) => `${B}/${name}?v=${V}`

// Seven complete, full-bleed scenes — one per milestone — that we travel through.
export const SCENES = [
  u('scn1.webp'), u('scn2.webp'), u('scn3.webp'),
  u('scn4.webp'), u('scn5.webp'), u('scn6.webp'), u('scn7.webp'),
]

// Real milestone content
export const DRAWINGS = [1, 2, 3, 4, 5].map((n) => u(`drawing-${n}.webp`)) // notice board (Scene 3)
export const PHOTOS = [1, 2, 3, 4].map((n) => u(`photo-${n}.webp`))         // memory wall (Scene 6)
// designed infographic slides shown as the popup view for these milestones
export const SLIDES = { 2: u('slide-2.webp'), 4: u('slide-4.webp'), 5: u('slide-5.webp') }

// Opening establishing shot (aerial view of the whole village). Placeholder is
// the entrance scene (reads as a zoom-into-the-village); swap to the real aerial
// illustration once it's dropped in as village-aerial.webp.
export const AERIAL = u('scn1.webp')

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
  talk: u('boy-talk.webp'), // talking/gesturing — used at each milestone
  talkAspect: 348 / 665,
  celebrateStrip: u('boy-celebrate-strip.webp'), // 6-frame finale celebration loop
  celebrateFrames: 6,
  celebrateAspect: 300 / 377,
}
