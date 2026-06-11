import React, { useEffect, useState, useRef } from 'react'

function useCountUp(target, duration = 2500, shouldStart = false) {
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

const ALL_STATES = [
  // Original 7
  { x: 175, y: 195, name: 'Maharashtra', isNew: false },
  { x: 210, y: 115, name: 'UP', isNew: false },
  { x: 178, y: 100, name: 'Haryana', isNew: false },
  { x: 180, y: 107, name: 'Delhi', isNew: false },
  { x: 182, y: 93, name: 'Uttarakhand', isNew: false },
  { x: 138, y: 128, name: 'Rajasthan', isNew: false },
  { x: 178, y: 98, name: 'Punjab', isNew: false },
  // New 7
  { x: 320, y: 230, name: 'Andaman & Nicobar', isNew: true },
  { x: 235, y: 215, name: 'Andhra Pradesh', isNew: true },
  { x: 265, y: 135, name: 'W. Bengal', isNew: true },
  { x: 230, y: 220, name: 'Telangana', isNew: true },
  { x: 168, y: 118, name: 'Chandigarh', isNew: true },
  { x: 290, y: 95, name: 'Meghalaya', isNew: true },
  { x: 195, y: 155, name: 'Madhya Pradesh', isNew: true },
]

export default function Overlay5Today() {
  const [started, setStarted] = useState(false)
  const [newStatesLit, setNewStatesLit] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setStarted(true), 400)
    const t2 = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        i++
        setNewStatesLit(i)
        if (i >= 7) clearInterval(interval)
      }, 300)
      return () => clearInterval(interval)
    }, 2800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const children = useCountUp(22000000, 2500, started)
  const awws = useCountUp(404000, 2500, started)
  const states = useCountUp(14, 2500, started)

  const fmt = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return (Math.round(n/1000)) + 'K'
    return n.toString()
  }

  const cards = [
    { label: 'Children', before: '2.3M', after: fmt(children) + (children >= 22000000 ? '' : ''), icon: '🧒', color: '#F4831F' },
    { label: 'AWW Workers', before: '65K', after: fmt(awws), icon: '🏫', color: '#4CAF50' },
    { label: 'States', before: '7', after: states.toString(), icon: '🗺️', color: '#2196F3' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header banner */}
      <div style={{ textAlign: 'center' }}>
        <svg width="500" height="70" viewBox="0 0 500 70" style={{ maxWidth: '100%' }}>
          <path d="M20 55 Q250 35 480 55" stroke="#8B5E3C" strokeWidth="5" fill="none"/>
          <rect x="25" y="18" width="450" height="42" rx="8" fill="#F4831F"/>
          <rect x="25" y="18" width="450" height="42" rx="8" fill="none" stroke="#c0392b" strokeWidth="3"/>
          <text x="250" y="44" textAnchor="middle" fontFamily="Baloo 2,cursive" fontWeight="800" fontSize="22" fill="white">
            Tab aur Aaj — Then &amp; Now
          </text>
          <path d="M20 55 Q250 55 480 55" stroke="#8B5E3C" strokeWidth="5" fill="none"/>
        </svg>
      </div>

      {/* Comparison cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {cards.map((card, i) => (
          <div key={i} className="comparison-card" style={{
            background: `linear-gradient(135deg, #F5E6C8 50%, rgba(244,131,31,0.15) 50%)`,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{card.icon}</div>
            <div style={{ fontFamily: 'Hind, sans-serif', fontWeight: 600, color: '#9E9E9E', fontSize: 13, marginBottom: 6 }}>
              {card.label}
            </div>
            {/* Before/After */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Hind, sans-serif', fontSize: 11, color: '#9E9E9E' }}>Pehle</div>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontWeight: 700, fontSize: 20, color: '#9E9E9E' }}>{card.before}</div>
              </div>
              <div style={{ fontSize: 20 }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Hind, sans-serif', fontSize: 11, color: card.color }}>Aaj</div>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontWeight: 800, fontSize: 28, color: card.color }}>
                  {card.after}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: 'Hind, sans-serif', fontSize: 16, color: '#6D4C41', textAlign: 'center' }}>
        Aaj Rocket Learning <strong>14 rajyon</strong> mein 22 million bacchon ki zindagi badal raha hai —
        har ek kadam aap jaise logon ke wajah se.
      </p>

      {/* India map — states lighting up */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ExpandedIndiaMap newStatesLit={newStatesLit} />
      </div>

      <p style={{ fontFamily: 'Caveat, cursive', fontSize: 20, color: '#F4831F', textAlign: 'center' }}>
        Har diya jalta hai — ek nayi umeed ke saath ✨
      </p>
    </div>
  )
}

function ExpandedIndiaMap({ newStatesLit }) {
  const [tooltip, setTooltip] = useState(null)

  return (
    <svg width="400" height="440" viewBox="0 0 400 440" style={{ maxWidth: '100%' }}>
      {/* India outline */}
      <path
        d="M140 35 Q168 22 195 35 Q224 28 248 48 Q275 44 295 65 Q315 82 318 105 Q328 130 320 158 Q332 182 320 208 Q308 238 298 262 Q285 292 268 314 Q250 338 232 354 Q215 372 198 384 Q180 396 163 380 Q146 364 133 344 Q116 320 105 292 Q90 260 87 230 Q78 198 83 168 Q80 136 90 105 Q100 78 114 58 Q126 40 140 35Z"
        fill="#FDF0D5"
        stroke="#8B6914"
        strokeWidth="3"
        opacity="0.7"
      />

      {/* All states as diya markers */}
      {ALL_STATES.map((state, i) => {
        const isOld = !state.isNew
        const newIndex = ALL_STATES.filter(s => s.isNew).findIndex(s => s.name === state.name)
        const isLit = isOld || newIndex < newStatesLit

        return (
          <g
            key={i}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setTooltip(state.name)}
            onMouseLeave={() => setTooltip(null)}
          >
            {/* Diya base */}
            <ellipse cx={state.x} cy={state.y + 10} rx="10" ry="4"
              fill={isLit ? (state.isNew ? '#FFC107' : '#F4831F') : '#C9A96E'}
              opacity={isLit ? 0.9 : 0.4}
              style={{ transition: 'all 0.4s ease' }}
            />
            {/* Diya bowl */}
            <path d={`M${state.x - 8} ${state.y + 8} Q${state.x - 5} ${state.y + 2} ${state.x} ${state.y} Q${state.x + 5} ${state.y + 2} ${state.x + 8} ${state.y + 8}`}
              fill={isLit ? (state.isNew ? '#FFD54F' : '#FFA726') : '#A08060'}
              style={{ transition: 'all 0.4s ease' }}
            />
            {/* Flame */}
            {isLit && (
              <g style={{
                animation: state.isNew ? `diyaLight 2s ease-in-out infinite` : `flicker 0.8s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
                transformOrigin: `${state.x}px ${state.y - 4}px`,
              }}>
                <path d={`M${state.x} ${state.y} Q${state.x - 4} ${state.y - 8} ${state.x} ${state.y - 14} Q${state.x + 4} ${state.y - 8} ${state.x} ${state.y}`}
                  fill="#FF6B00" opacity="0.9"/>
                <path d={`M${state.x} ${state.y - 2} Q${state.x - 2} ${state.y - 7} ${state.x} ${state.y - 10} Q${state.x + 2} ${state.y - 7} ${state.x} ${state.y - 2}`}
                  fill="#FFC107"/>
              </g>
            )}
          </g>
        )
      })}

      {/* Tooltip */}
      {tooltip && (
        <text
          x="200"
          y="420"
          textAnchor="middle"
          fontFamily="Caveat,cursive"
          fontSize="16"
          fill="#795548"
          style={{ fontWeight: 700 }}
        >
          {tooltip}
        </text>
      )}

      {/* Legend */}
      <circle cx="30" cy="410" r="6" fill="#F4831F"/>
      <text x="40" y="414" fontFamily="Caveat,cursive" fontSize="12" fill="#795548">Pehle ke 7 rajya</text>
      <circle cx="170" cy="410" r="6" fill="#FFC107"/>
      <text x="180" y="414" fontFamily="Caveat,cursive" fontSize="12" fill="#795548">Naye 7 rajya</text>
    </svg>
  )
}
