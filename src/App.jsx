import React, { useState, useEffect, useRef, useCallback } from 'react'
import SceneCanvas from './scene/Scene'
import { scene as S, CENTERS, START, arrivalInfo, clamp, lerp } from './scene/store'
import { CHAPTERS } from './scene/chapters'
import { BOY } from './scene/assets'
import Overlay1Welcome from './components/overlays/Overlay1Welcome'
import Overlay2WhenWeBegan from './components/overlays/Overlay2WhenWeBegan'
import Overlay3Drawings from './components/overlays/Overlay3Drawings'
import Overlay4Achievements from './components/overlays/Overlay4Achievements'
import Overlay5Today from './components/overlays/Overlay5Today'
import Overlay6Photos from './components/overlays/Overlay6Photos'
import Overlay7Birthday from './components/overlays/Overlay7Birthday'

const OVERLAY_MAP = { 1: Overlay1Welcome, 2: Overlay2WhenWeBegan, 3: Overlay3Drawings, 4: Overlay4Achievements, 5: Overlay5Today, 6: Overlay6Photos, 7: Overlay7Birthday }
const PAGE_SCREENS = 12 // total scrollable height in viewport-heights

const setS = (el, props) => { if (el) for (const k in props) el.style[k] = props[k] }

export default function App() {
  const [chapterIdx, setChapterIdx] = useState(0)
  const [phase, setPhase] = useState('hero') // 'hero' | 'journey'
  const [openingDone, setOpeningDone] = useState(false)
  const [openStep, setOpenStep] = useState(0)
  const [currentOverlay, setCurrentOverlay] = useState(null)
  const [visited, setVisited] = useState(new Set())

  // imperatively-animated DOM
  const speechRef = useRef(), hintRef = useRef(), heroRef = useRef()
  const currentOverlayRef = useRef(null)

  const st = useRef({ targetY: 0, curY: 0, prog: 0, ptx: 0, pty: 0, tptx: 0, tpty: 0, lastIdx: -1, lastPhase: '' })

  // opening beats
  useEffect(() => {
    S.reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false
    const t = [
      setTimeout(() => setOpenStep(1), 500),
      setTimeout(() => setOpenStep(2), 1500),
      setTimeout(() => setOpenStep(3), 2600),
      setTimeout(() => setOpeningDone(true), 4200),
    ]
    return () => t.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    document.body.style.height = `${PAGE_SCREENS * 100}vh`
    return () => { document.body.style.height = '' }
  }, [])

  // pointer parallax target
  useEffect(() => {
    const onMove = (e) => {
      st.current.tptx = (e.clientX / window.innerWidth - 0.5) * 2
      st.current.tpty = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // main loop: scroll → eased progress → store + imperative DOM
  useEffect(() => {
    const s = st.current
    let raf
    const maxScroll = () => Math.max(1, document.body.scrollHeight - window.innerHeight)

    const tick = () => {
      s.targetY = window.scrollY
      const prev = s.curY
      s.curY += (s.targetY - s.curY) * 0.09
      const raw = clamp(s.curY / maxScroll(), 0, 1)
      s.prog += (raw - s.prog) * 0.16
      const vel = clamp(Math.abs(s.curY - prev) / window.innerHeight * 4, 0, 1)

      // pointer ease
      s.ptx = lerp(s.ptx, s.tptx, 0.06); s.pty = lerp(s.pty, s.tpty, 0.06)

      // publish to scene
      S.progress = s.prog; S.rawProgress = raw
      S.velocity = lerp(S.velocity, vel, 0.2)
      S.pointerX = s.ptx; S.pointerY = s.pty

      const info = arrivalInfo(s.prog)
      const isHero = s.prog < START * 0.55
      const ph = isHero ? 'hero' : 'journey'

      // ── hero title ──
      setS(heroRef.current, { opacity: clamp(1 - s.prog / (START * 0.6), 0, 1) })

      // ── boy speech bubble (the only on-scene text) ──
      const spOp = info.arrived > 0.5 ? clamp((info.arrived - 0.5) / 0.2, 0, 1) : 0
      setS(speechRef.current, { opacity: spOp, transform: `scale(${0.9 + spOp * 0.1})` })

      // ── dive-in zoom ramp (drives the scene; opens the panel mid-dive) ──
      if (S.zoom.active) {
        S.zoom.t = Math.min(1, S.zoom.t + 0.035)
        if (!enterRef.current.opened && S.zoom.t > 0.5) {
          enterRef.current.opened = true
          openOverlay(CHAPTERS[S.zoom.index].overlayId)
        }
      }

      // ── "click to enter" hint ──
      const hintOn = info.arrived > 0.8 && !S.zoom.active && !currentOverlayRef.current
      setS(hintRef.current, { opacity: hintOn ? 1 : 0, pointerEvents: hintOn ? 'all' : 'none' })

      // ── React state only on meaningful change ──
      if (info.index !== s.lastIdx) { s.lastIdx = info.index; setChapterIdx(info.index) }
      if (ph !== s.lastPhase) { s.lastPhase = ph; setPhase(ph) }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const enterRef = useRef({ opened: false })
  const openOverlay = useCallback((id) => { setCurrentOverlay(id); setVisited((p) => new Set([...p, id])) }, [])
  const startEnter = useCallback((i) => {
    if (S.zoom.active) return
    enterRef.current.opened = false
    S.zoom = { active: true, index: i, t: 0 }
  }, [])
  const closeOverlay = useCallback(() => {
    setCurrentOverlay(null)
    S.zoom = { active: false, index: -1, t: 0 }
    enterRef.current.opened = false
    S.hoverIndex = -1
    document.body.style.cursor = 'default'
  }, [])
  useEffect(() => { S.onEnter = startEnter; return () => { S.onEnter = null } }, [startEnter])
  useEffect(() => { currentOverlayRef.current = currentOverlay }, [currentOverlay])
  const scrollToStop = useCallback((i) => {
    const max = document.body.scrollHeight - window.innerHeight
    window.scrollTo({ top: CENTERS[i] * max, behavior: 'smooth' })
  }, [])

  const chapter = CHAPTERS[chapterIdx]
  const OverlayComp = currentOverlay ? OVERLAY_MAP[currentOverlay] : null

  return (
    <>
      <SceneCanvas />

      {/* warm readability scrim along the bottom for the text block */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(20,10,4,0.78) 0%, rgba(20,10,4,0.30) 26%, transparent 52%)' }} />

      {/* ── Hero title ── */}
      <div ref={heroRef} style={{ position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="caveat" style={{ fontSize: 'clamp(13px,1.4vw,17px)', color: 'rgba(253,240,213,0.8)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>
          Rocket Learning Presents
        </div>
        <h1 className="baloo" style={{ fontWeight: 800, fontSize: 'clamp(40px,7vw,92px)', color: '#FFB14E', textShadow: '0 4px 40px rgba(0,0,0,0.6), 0 0 70px rgba(244,131,31,0.5)', lineHeight: 1.04, margin: 0 }}>
          Manu Bhai Ka Safar
        </h1>
        <p className="caveat" style={{ fontSize: 'clamp(19px,2.4vw,32px)', color: '#FDF0D5', margin: '14px 0 0', textShadow: '0 2px 16px rgba(0,0,0,0.6)' }}>
          One village. Seven milestones. A journey made just for you.
        </p>
        <div className="caveat" style={{ marginTop: 54, fontSize: 20, color: 'rgba(253,240,213,0.85)', animation: 'pulsePrompt 2s ease-in-out infinite' }}>
          Scroll to begin — Chotu will walk you there ↓
        </div>
      </div>

      {/* ── Boy's speech bubble (only on-scene text) ── */}
      <div ref={speechRef} style={{ position: 'fixed', left: 'clamp(12px,5vw,90px)', top: '30%', zIndex: 6, pointerEvents: 'none', opacity: 0, transformOrigin: 'bottom left' }}>
        <div style={{ background: '#fff', border: '2.5px dashed #F4831F', borderRadius: 16, padding: '10px 18px', maxWidth: 320, position: 'relative', boxShadow: '3px 6px 22px rgba(0,0,0,0.35)' }}>
          <span className="caveat" style={{ fontSize: 'clamp(16px,1.7vw,22px)', color: '#6B4226', lineHeight: 1.25 }}>{chapter.kidSpeech}</span>
          <div style={{ position: 'absolute', bottom: -12, left: 34, width: 0, height: 0, borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderTop: '13px solid #fff' }} />
        </div>
      </div>

      {/* ── click-to-enter hint (the whole scene is clickable) ── */}
      <div ref={hintRef} onClick={() => startEnter(chapterIdx)} style={{
        position: 'fixed', left: '50%', bottom: 'clamp(26px,6vh,70px)', transform: 'translateX(-50%)', zIndex: 6,
        opacity: 0, pointerEvents: 'none', cursor: 'pointer', transition: 'opacity 0.5s ease' }}>
        <div className="baloo" style={{ background: 'rgba(20,10,4,0.5)', color: '#FFE8C2', backdropFilter: 'blur(6px)',
          border: '1.5px solid rgba(255,209,128,0.6)', borderRadius: 999, padding: '10px 24px',
          fontSize: 'clamp(13px,1.4vw,18px)', fontWeight: 600, whiteSpace: 'nowrap',
          boxShadow: '0 6px 24px rgba(0,0,0,0.4)', animation: 'signpostFloat 2.2s ease-in-out infinite' }}>
          {chapter.enterLabel} ✨
        </div>
      </div>

      {/* ── Progress diyas ── */}
      {openingDone && (
        <div style={{ position: 'fixed', right: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 50, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CHAPTERS.map((ch, i) => {
            const lit = i === chapterIdx || visited.has(ch.overlayId)
            return (
              <div key={ch.id} className="progress-diya" onClick={() => scrollToStop(i)} title={ch.location}>
                <span className="diya-label">{ch.location}</span>
                <svg width="26" height="30" viewBox="0 0 26 30">
                  <ellipse cx="13" cy="24" rx="11" ry="4.5" fill={lit ? '#D4A017' : '#6B5020'} opacity="0.9" />
                  <path d="M3 22 Q5 13 13 11 Q21 13 23 22" fill={lit ? '#FFA726' : '#5A4015'} />
                  {lit && (
                    <g style={{ animation: 'flicker 0.8s ease-in-out infinite', transformOrigin: '13px 9px' }}>
                      <path d="M13 11 Q9 5 13 -1 Q17 5 13 11" fill="#FF6B00" opacity="0.95" />
                      <path d="M13 9 Q11 4 13 1 Q15 4 13 9" fill="#FFC107" />
                      <circle cx="13" cy="1" r="2.5" fill="#FFF176" opacity="0.7" />
                    </g>
                  )}
                </svg>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Opening screen ── */}
      {!openingDone && <OpeningScreen step={openStep} />}

      {/* ── Content overlay ── */}
      {OverlayComp && (
        <div className={`overlay-backdrop ${currentOverlay ? 'open' : ''}`} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='5' height='5'%3E%3Ccircle cx='1' cy='1' r='0.5' fill='rgba(120,80,40,0.06)'/%3E%3C/svg%3E\")" }}>
          <div className="overlay-content"><OverlayComp onClose={closeOverlay} /></div>
          <button className="overlay-close" onClick={closeOverlay}>
            <svg width="20" height="20" viewBox="0 0 20 20"><path d="M2 2 L18 18 M18 2 L2 18" stroke="white" strokeWidth="3" strokeLinecap="round" /></svg>
          </button>
        </div>
      )}
    </>
  )
}

function OpeningScreen({ step }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0e16', transition: 'opacity 0.8s ease' }}>
      <svg width="48" height="72" viewBox="0 0 48 72">
        <ellipse cx="24" cy="58" rx="20" ry="8" fill="#D4A017" />
        <path d="M4 56 Q10 38 24 34 Q38 38 44 56" fill="#FFA726" />
        <g style={{ animation: 'flicker 0.9s ease-in-out infinite', transformOrigin: '24px 32px' }}>
          <path d="M24 34 Q17 18 24 4 Q31 18 24 34" fill="#FF6B00" opacity="0.95" />
          <path d="M24 30 Q19 16 24 8 Q29 16 24 30" fill="#FFC107" />
          <circle cx="24" cy="6" r="5" fill="#FFF176" opacity="0.8" />
        </g>
      </svg>
      <div style={{ opacity: step >= 1 ? 1 : 0, transform: step >= 1 ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 1s ease, transform 1s ease', textAlign: 'center', marginTop: 26 }}>
        <h1 className="baloo" style={{ fontWeight: 800, fontSize: 'clamp(32px,5vw,72px)', color: '#FFB14E', textShadow: '0 0 60px rgba(244,131,31,0.55)', lineHeight: 1.1, margin: 0 }}>Manu Bhai Ka Safar</h1>
        <p className="caveat" style={{ fontSize: 'clamp(16px,2vw,26px)', color: '#FDF0D5', margin: '10px 0 0' }}>A special journey — made for you</p>
      </div>
      {step >= 2 && (
        <div style={{ margin: '30px 0 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'noteUnfurl 0.5s ease both' }}>
          <img src={BOY.wave} alt="" style={{ height: 'min(34vh, 280px)', filter: 'drop-shadow(0 14px 26px rgba(0,0,0,0.5))' }} />
          <div style={{ background: 'rgba(255,255,255,0.08)', border: '2px dashed rgba(244,131,31,0.55)', borderRadius: 16, padding: '12px 22px', maxWidth: 460, textAlign: 'center', backdropFilter: 'blur(8px)', marginTop: 14 }}>
            <span className="caveat" style={{ fontSize: 20, color: '#FDF0D5' }}>"Hello Manu Bhai! I'm Chotu — come, let me show you around my village! 🌟"</span>
          </div>
        </div>
      )}
      <div className="caveat" style={{ fontSize: 20, color: '#FDF0D5', marginTop: 24, opacity: step >= 3 ? 1 : 0, transition: 'opacity 0.8s ease', animation: step >= 3 ? 'pulsePrompt 2s ease-in-out infinite' : 'none' }}>
        Scroll to continue ↓
      </div>
    </div>
  )
}
