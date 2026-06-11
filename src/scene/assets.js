// Cleaned, web-ready assets live in /public (served at /scene/…)
// ?v=N busts the browser cache whenever the PNGs are regenerated.
const V = '9'
const B = `/scene`
const u = (name) => `${B}/${name}?v=${V}`

// Seven complete, full-bleed scenes — one per milestone — that we travel through.
export const SCENES = [
  u('scn1.png'), u('scn2.png'), u('scn3.png'),
  u('scn4.png'), u('scn5.png'), u('scn6.png'), u('scn7.png'),
]

export const BOY = {
  walkStrip: u('boy-walk-strip.png'), // 10-frame walk cycle, horizontal
  walkFrames: 10,
  walkAspect: 188 / 321,              // one frame's w/h
  idle:  u('boy-idle.png'),
  wave:  u('boy-wave.png'),
  talk:  u('boy-talk.png'),
  celebrateStrip: u('boy-celebrate-strip.png'), // 6-frame finale celebration loop
  celebrateFrames: 6,
  celebrateAspect: 266 / 380,
}

export const PROPS = {
  cart:    u('prop-cart.png'),
  chai:    u('prop-chai.png'),
  pump:    u('prop-pump.png'),
  washing: u('prop-washing.png'),
  goat:    u('prop-goat.png'),
  crow:    u('prop-crow.png'),
}
