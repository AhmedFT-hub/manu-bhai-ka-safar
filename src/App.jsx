import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useProgress } from '@react-three/drei'
import SceneCanvas from './scene/Scene'
import { scene as S, CENTERS, START, arrivalInfo, clamp, lerp } from './scene/store'
import { CHAPTERS } from './scene/chapters'
import { AERIAL } from './scene/assets'
import Overlay1Welcome from './components/overlays/Overlay1Welcome'
import Overlay2WhenWeBegan from './components/overlays/Overlay2WhenWeBegan'
import Overlay3Drawings from './components/overlays/Overlay3Drawings'
import Overlay4Achievements from './components/overlays/Overlay4Achievements'
import Overlay5Today from './components/overlays/Overlay5Today'
import Overlay6Photos from './components/overlays/Overlay6Photos'
import Overlay7Birthday from './components/overlays/Overlay7Birthday'

const OVERLAY_MAP = { 1: Overlay1Welcome, 2: Overlay2WhenWeBegan, 3: Overlay3Drawings, 4: Overlay4Achievements, 5: Overlay5Today, 6: Overlay6Photos, 7: Overlay7Birthday }
const PAGE_SCREENS = 16 // total scrollable height in viewport-heights (room to land on each stop)

const setS = (el, props) => { if (el) for (const k in props) el.style[k] = props[k] }

export default function App() {
  const [chapterIdx, setChapterIdx] = useState(0)
  const [phase, setPhase] = useState('hero') // 'hero' | 'journey'
  const [intro, setIntro] = useState('load') // load → aerial → done
  const [introGone, setIntroGone] = useState(false)
  const openingDone = intro === 'done'
  const [currentOverlay, setCurrentOverlay] = useState(null)
  const [visited, setVisited] = useState(new Set())

  // imperatively-animated DOM
  const speechRef = useRef(), cueRef = useRef(), heroRef = useRef()
  const currentOverlayRef = useRef(null)
  const visitedRef = useRef(new Set())

  const st = useRef({ targetY: 0, curY: 0, prog: 0, ptx: 0, pty: 0, tptx: 0, tpty: 0, lastIdx: -1, lastPhase: '' })

  useEffect(() => { S.reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false }, [])

  // Cinematic opening: hold a loader until every texture is in, then play the
  // aerial establishing push-in, then hand off to the (scroll-driven) journey.
  const { active, progress } = useProgress()
  const ready = progress >= 100 && !active
  useEffect(() => {
    if (ready && intro === 'load') { const t = setTimeout(() => setIntro('aerial'), 300); return () => clearTimeout(t) }
  }, [ready, intro])
  useEffect(() => {
    if (intro === 'aerial') { const t = setTimeout(() => setIntro('done'), 4600); return () => clearTimeout(t) }
  }, [intro])
  useEffect(() => {
    if (intro === 'done') { const t = setTimeout(() => setIntroGone(true), 1000); return () => clearTimeout(t) }
  }, [intro])

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
      // Safety: once a dive has opened its panel and the panel is then closed,
      // always release the zoom so the scene returns to the journey (otherwise
      // it stays frozen-zoomed on the milestone and you can't move forward).
      if (S.zoom.active && enterRef.current.opened && !currentOverlayRef.current) {
        S.zoom = { active: false, index: -1, t: 0 }
        enterRef.current.opened = false
      } else if (S.zoom.active) {
        S.zoom.t = Math.min(1, S.zoom.t + 0.035)
        if (!enterRef.current.opened && S.zoom.t > 0.5) {
          enterRef.current.opened = true
          openOverlay(CHAPTERS[S.zoom.index].overlayId)
        }
      }

      // ── after a milestone is viewed, prompt to scroll on to the next ──
      const visitedHere = visitedRef.current.has(CHAPTERS[info.index].overlayId)
      const isLast = info.index === CHAPTERS.length - 1
      const cueOn = info.arrived > 0.5 && !S.zoom.active && !currentOverlayRef.current && visitedHere && !isLast
      setS(cueRef.current, { opacity: cueOn ? 1 : 0 })

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
  useEffect(() => { visitedRef.current = visited }, [visited])
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

      {/* ── after viewing a milestone: prominent "scroll to next" prompt ── */}
      <div ref={cueRef} style={{
        position: 'fixed', left: '50%', bottom: 'clamp(24px,5vh,56px)', transform: 'translateX(-50%)', zIndex: 6,
        opacity: 0, pointerEvents: 'none', transition: 'opacity 0.5s ease',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div className="baloo" style={{ background: 'rgba(20,10,4,0.62)', color: '#FFE8C2', backdropFilter: 'blur(8px)',
          border: '1.5px solid rgba(255,209,128,0.7)', borderRadius: 999, padding: '12px 28px',
          fontSize: 'clamp(15px,1.7vw,21px)', fontWeight: 700, whiteSpace: 'nowrap',
          boxShadow: '0 8px 28px rgba(0,0,0,0.45)' }}>
          Scroll on to the next milestone
        </div>
        <div style={{ fontSize: 26, color: '#FFD180', animation: 'pulsePrompt 1.4s ease-in-out infinite', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>↓</div>
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
      {!introGone && <OpeningScreen intro={intro} progress={progress} />}

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

function OpeningScreen({ intro, progress = 0 }) {
  const loading = intro === 'load'
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, overflow: 'hidden', background: '#0a0e16',
      opacity: intro === 'done' ? 0 : 1, transition: 'opacity 0.9s ease', pointerEvents: intro === 'done' ? 'none' : 'auto' }}>

      {/* aerial establishing shot — slow cinematic push-in toward the entrance */}
      {!loading && (
        <img src={AERIAL} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', transformOrigin: '52% 64%', animation: 'aerialZoom 5.2s ease-in-out forwards' }} />
      )}

      {/* content layer */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24,
        background: loading ? '#0a0e16' : 'linear-gradient(to top, rgba(20,10,4,0.6) 0%, rgba(20,10,4,0.12) 45%, rgba(20,10,4,0.45) 100%)' }}>

        {loading && (
          <svg width="48" height="72" viewBox="0 0 48 72" style={{ marginBottom: 20 }}>
            <ellipse cx="24" cy="58" rx="20" ry="8" fill="#D4A017" />
            <path d="M4 56 Q10 38 24 34 Q38 38 44 56" fill="#FFA726" />
            <g style={{ animation: 'flicker 0.9s ease-in-out infinite', transformOrigin: '24px 32px' }}>
              <path d="M24 34 Q17 18 24 4 Q31 18 24 34" fill="#FF6B00" opacity="0.95" />
              <path d="M24 30 Q19 16 24 8 Q29 16 24 30" fill="#FFC107" />
              <circle cx="24" cy="6" r="5" fill="#FFF176" opacity="0.8" />
            </g>
          </svg>
        )}

        <div style={{ animation: loading ? 'none' : 'fadeIn 1.6s ease both' }}>
          <div className="caveat" style={{ fontSize: 'clamp(13px,1.4vw,17px)', color: 'rgba(253,240,213,0.85)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12, textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
            Rocket Learning Presents
          </div>
          <h1 className="baloo" style={{ fontWeight: 800, fontSize: 'clamp(38px,6.5vw,90px)', color: '#FFB14E', textShadow: '0 4px 40px rgba(0,0,0,0.6), 0 0 70px rgba(244,131,31,0.5)', lineHeight: 1.05, margin: 0 }}>
            Manu Bhai Ka Safar
          </h1>
          <p className="caveat" style={{ fontSize: 'clamp(16px,2.2vw,30px)', color: '#FDF0D5', margin: '12px 0 0', textShadow: '0 2px 16px rgba(0,0,0,0.6)' }}>
            One village. Seven milestones. A journey made just for you.
          </p>
        </div>

        <div style={{ marginTop: 30, height: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {loading ? (
            <div style={{ width: 'min(60vw, 260px)', textAlign: 'center' }}>
              <div style={{ height: 5, width: '100%', borderRadius: 4, background: 'rgba(253,240,213,0.15)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.round(progress)}%`, background: 'linear-gradient(90deg,#FFA726,#F4831F)', borderRadius: 4, transition: 'width 0.3s ease' }} />
              </div>
              <div className="caveat" style={{ fontSize: 15, color: 'rgba(253,240,213,0.7)', marginTop: 10 }}>
                Loading the village… {Math.round(progress)}%
              </div>
            </div>
          ) : (
            <div className="caveat" style={{ fontSize: 'clamp(16px,1.8vw,22px)', color: '#FDF0D5', textShadow: '0 2px 14px rgba(0,0,0,0.7)', animation: 'fadeIn 1.2s ease 2.6s both' }}>
              Chotu is waiting at the gate… ↓
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
