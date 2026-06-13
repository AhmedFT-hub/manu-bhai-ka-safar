import puppeteer from 'puppeteer-core'
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--window-size=1440,900','--hide-scrollbars','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows'],defaultViewport:{width:1440,height:900}})
const pg=await b.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push(e.message))
await pg.goto('http://localhost:5177/',{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,8000))
// open Scene 3 (drawings, index 2) and Scene 6 (photos, index 5) overlays directly
await pg.evaluate(()=>window.__SCENE.onEnter(2)); await new Promise(r=>setTimeout(r,1400)); await pg.screenshot({path:'/tmp/shots/ov_drawings.png'})
await pg.keyboard.press('Escape')
