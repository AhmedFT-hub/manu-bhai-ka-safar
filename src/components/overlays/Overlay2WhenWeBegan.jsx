import React, { useEffect, useState, useRef } from 'react'

function useCountUp(target, duration = 2000, shouldStart = false) {
  const [count, setCount] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    if (!shouldStart) return
    startRef.current = null
    const step = (ts) => {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [shouldStart, target, duration])

  return count
}

const STATES_OLD = ['Maharashtra', 'Mumbai', 'UP', 'Haryana', 'Delhi', 'Uttarakhand', 'Rajasthan']

export default function Overlay2WhenWeBegan() {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 400)
    return () => clearTimeout(t)
  }, [])

  const children = useCountUp(2300000, 2000, started)
  const awws = useCountUp(65000, 2000, started)
  const states = useCountUp(7, 2000, started)

  const fmt = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K'
    return n.toString()
  }

  const notes = [
    { emoji: '🧒', value: fmt(children), label: 'Children Reached', delay: 0 },
    { emoji: '🏫', value: fmt(awws), label: 'AWWs & Classrooms', delay: 400 },
    { emoji: '🗺️', value: states.toString(), label: 'States', delay: 800 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
      {/* Branch with hanging notes */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 800 }}>
        <svg width="100%" height="80" viewBox="0 0 800 80" style={{ display: 'block' }}>
          {/* Main branch */}
          <path d="M0 50 Q200 30 400 45 Q600 60 800 40" stroke="#6B4C2A" strokeWidth="12" fill="none" strokeLinecap="round"/>
          <path d="M0 50 Q200 30 400 45 Q600 60 800 40" stroke="#8B6914" strokeWidth="6" fill="none" strokeLinecap="round"/>
          {/* Leaf clusters */}
          {[100, 250, 400, 550, 700].map((x, i) => (
            <ellipse key={i} cx={x} cy={40 + Math.sin(x/200)*8} rx="25" ry="15" fill="#2E7D32" opacity="0.7"/>
          ))}
          {/* Strings for notes */}
          {[180, 390, 600].map((x, i) => (
            <line key={i} x1={x} y1={45 + Math.sin(x/200)*8} x2={x} y2={80} stroke="#8B6914" strokeWidth="2"/>
          ))}
        </svg>

        {/* Hanging notes */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 0, padding: '0 60px' }}>
          {notes.map((note, i) => (
            <div
              key={i}
              className="hanging-note"
              style={{
                transform: `rotate(${[-3,2,-2][i]}deg)`,
                animationDelay: `${note.delay}ms`,
                flex: '0 0 auto',
                width: 180,
                textAlign: 'center',
                minHeight: 120,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <div style={{ fontSize: 28 }}>{note.emoji}</div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontWeight: 800, fontSize: 32, color: '#F4831F', lineHeight: 1 }}>
                {note.value}
              </div>
              <div style={{ fontFamily: 'Hind, sans-serif', fontSize: 14, color: '#795548', fontWeight: 500 }}>
                {note.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 style={{ fontFamily: 'Baloo 2, cursive', fontWeight: 800, fontSize: 28, color: '#795548', textAlign: 'center' }}>
        Jab Humne Shuruat Ki...
      </h2>
      <p style={{ fontFamily: 'Hind, sans-serif', fontSize: 16, color: '#6D4C41', textAlign: 'center', maxWidth: 600 }}>
        Rocket Learning ki journey tab shuru hui jab 2.3 million bacchon tak pahunchna ek sapna tha.
        Unke haath mein sirf kuch rang the — aur sikhne ki tamanna.
      </p>

      {/* State chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        {STATES_OLD.map((s, i) => (
          <span key={i} className="state-chip" style={{ animationDelay: `${i * 200}ms` }}>{s}</span>
        ))}
      </div>

      {/* Simple India map placeholder */}
      <div style={{ width: '100%', maxWidth: 500, position: 'relative' }}>
        <IndiaMapSimple highlightCount={7} />
      </div>

      <div className="placeholder-block" style={{ maxWidth: 500, width: '100%' }}>
        Yeh tha hamaara pehla kadam — chota sa, lekin solid.
      </div>
    </div>
  )
}

function IndiaMapSimple({ highlightCount }) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i++
      setVisibleCount(i)
      if (i >= highlightCount) clearInterval(interval)
    }, 300)
    return () => clearInterval(interval)
  }, [highlightCount])

  // Simplified India state regions as colored circles on approximate positions
  const stateMarkers = [
    { x: 180, y: 220, name: 'Maharashtra' },
    { x: 175, y: 200, name: 'Mumbai' },
    { x: 205, y: 120, name: 'UP' },
    { x: 175, y: 100, name: 'Haryana' },
    { x: 175, y: 110, name: 'Delhi' },
    { x: 180, y: 95, name: 'Uttarakhand' },
    { x: 140, y: 130, name: 'Rajasthan' },
  ]

  return (
    <svg width="100%" height="340" viewBox="0 0 340 360" style={{ display: 'block', margin: '0 auto' }}>
      {/* Simplified India outline */}
      <path
        d="M120 30 Q145 20 165 30 Q190 25 210 40 Q235 38 250 55 Q265 70 268 90 Q275 110 270 135 Q278 155 270 175 Q262 200 255 220 Q245 245 230 265 Q215 285 200 300 Q185 318 170 330 Q155 340 140 325 Q125 308 115 290 Q100 270 90 245 Q78 220 75 195 Q68 168 72 142 Q70 115 78 90 Q85 68 95 50 Q105 35 120 30Z"
        fill="none"
        stroke="#8B6914"
        strokeWidth="3"
        opacity="0.6"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      />
      <path
        d="M120 30 Q145 20 165 30 Q190 25 210 40 Q235 38 250 55 Q265 70 268 90 Q275 110 270 135 Q278 155 270 175 Q262 200 255 220 Q245 245 230 265 Q215 285 200 300 Q185 318 170 330 Q155 340 140 325 Q125 308 115 290 Q100 270 90 245 Q78 220 75 195 Q68 168 72 142 Q70 115 78 90 Q85 68 95 50 Q105 35 120 30Z"
        fill="#FDF0D5"
        opacity="0.5"
      />

      {/* State markers */}
      {stateMarkers.map((m, i) => (
        <g key={i} style={{ opacity: i < visibleCount ? 1 : 0, transition: 'opacity 0.4s ease' }}>
          <circle cx={m.x} cy={m.y} r="14" fill="#F4831F" opacity="0.8"
            style={{ animation: i < visibleCount ? 'diyaLight 2s ease-in-out infinite' : 'none', animationDelay: `${i*0.2}s` }}/>
          <circle cx={m.x} cy={m.y} r="6" fill="#FFF176"/>
          <text x={m.x} y={m.y + 28} textAnchor="middle" fontFamily="Caveat,cursive" fontSize="9" fill="#795548">
            {m.name}
          </text>
        </g>
      ))}

      {/* Scale label */}
      <text x="170" y="355" textAnchor="middle" fontFamily="Caveat,cursive" fontSize="12" fill="#9E9E9E" fontStyle="italic">
        Humara Pehla Nakshe Mein Safar
      </text>
    </svg>
  )
}
