// Capture the experience at several scroll positions for visual tuning.
import puppeteer from 'puppeteer-core'

const URL = process.argv[2] || 'http://localhost:5177/'
const OUT = '/tmp/shots'
import { mkdirSync } from 'fs'
mkdirSync(OUT, { recursive: true })

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader',
    '--window-size=1440,900', '--hide-scrollbars',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows'],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
})
const page = await browser.newPage()
const errs = []
page.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()) })
page.on('requestfailed', (r) => errs.push('REQFAIL: ' + r.url()))
page.on('response', (r) => { if (r.status() >= 400) errs.push('HTTP ' + r.status() + ': ' + r.url()) })
page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message))

await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise((r) => setTimeout(r, 5500)) // let opening finish + textures load

const max = await page.evaluate(() => document.body.scrollHeight - window.innerHeight)
// progress points: hero, stop0..6, plus a couple of between-gaps
// centres for 7 scenes: START=0.07, END=0.95
const C = (i) => 0.07 + (0.95 - 0.07) * i / 6
const lerpP = (a, b, t) => a + (b - a) * t
const points = [
  ['scene1', C(0)],
  ['t_25', lerpP(C(0), C(1), 0.25)], ['t_50', lerpP(C(0), C(1), 0.5)], ['t_75', lerpP(C(0), C(1), 0.75)],
  ['scene2', C(1)],
]
for (const [name, p] of points) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(p * max))
  await page.evaluate(async (target) => {
    const ok = () => Math.abs((window.__SCENE?.progress ?? -1) - target) < 0.004
    for (let i = 0; i < 240 && !ok(); i++) await new Promise((r) => setTimeout(r, 50))
  }, p)
  await new Promise((r) => setTimeout(r, 600))
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log('shot', name)
}
// dive-in interaction on scene 1
await page.evaluate(() => window.__SCENE.onEnter && window.__SCENE.onEnter(0))
await new Promise((r) => setTimeout(r, 220))
await page.screenshot({ path: `${OUT}/dive_mid.png` }); console.log('shot dive_mid')
console.log(errs.length ? errs.join('\n') : 'NO ERRORS')
await browser.close()
