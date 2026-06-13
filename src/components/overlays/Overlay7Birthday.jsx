import React, { useState, useMemo } from 'react'

const CONFETTI_COLORS = ['#F4831F', '#FFC107', '#4CAF50', '#E53935', '#FFFFFF', '#9C27B0', '#2196F3']
const CHIT_MESSAGES = [
  { from: 'Team Member', message: 'Aapki mehnat aur dedication ne lakhon bacchon ki duniya badal di. Happy Birthday!' },
  { from: 'Team Member', message: 'Jis raste pe aap chale, woh rasta laakhon zindagiyan roshan karta hai. ✨' },
  { from: 'Team Member', message: 'Aapke sapne aur aapki himmat ne yeh safar possible banaya. Bahut bahut badhai!' },
  { from: 'Team Member', message: 'Har bacche ki hasi mein aapka yogdan hai. Thank you, Manu Bhai! 🌟' },
  { from: 'Team Member', message: 'Aap jaise log hain toh duniya behtar hai. Janamdin ki hardik shubhkamnayein!' },
  { from: 'Team Member', message: 'Aapki leadership ne humein sikhaya ki chote chote qadam bade sapne poore karte hain.' },
]

function Confetti() {
  const pieces = useMemo(() => Array.from({length: 80}, (_, i) => {
    const shape = i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'square' : 'star'
    const size = 8 + Math.random() * 8
    const left = Math.random() * 100
    const duration = 3 + Math.random() * 3
    const delay = Math.random() * 3
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
    const rotation = Math.random() * 360
    return { shape, size, left, duration, delay, color, rotation }
  }), [])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 820 }}>
      {pieces.map((p, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : 0,
            clipPath: p.shape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : undefined,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  )
}

function StringLights() {
  return (
    <div style={{ position: 'sticky', top: 0, display: 'flex', justifyContent: 'space-around', padding: '12px 0', zIndex: 2 }}>
      {Array.from({length: 24}, (_, i) => (
        <div
          key={i}
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#FFF176',
            boxShadow: '0 0 8px 3px rgba(255,241,118,0.7)',
            animation: `twinkle ${1 + (i%5) * 0.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  )
}

function Balloon({ x, color, delay }) {
  return (
    <g transform={`translate(${x}, 0)`}
      style={{ animation: `balloonFloat ${2 + delay}s ease-in-out infinite`, animationDelay: `${delay}s` }}>
      <ellipse cx="0" cy="0" rx="18" ry="22" fill={color} opacity="0.9"/>
      <ellipse cx="-5" cy="-8" rx="5" ry="7" fill="rgba(255,255,255,0.3)"/>
      <path d="M0 22 Q3 35 0 50" stroke="#888" strokeWidth="1.5" fill="none"/>
      <path d="M-4 22 L4 22 L0 28Z" fill={color} opacity="0.7"/>
    </g>
  )
}

export default function Overlay7Birthday() {
  const [flippedChits, setFlippedChits] = useState(new Set())

  const toggleChit = (i) => {
    setFlippedChits(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const chitPositions = [
    { top: '25%', left: '5%', rotate: -12 },
    { top: '20%', left: '55%', rotate: 8 },
    { top: '45%', left: '2%', rotate: 5 },
    { top: '40%', left: '68%', rotate: -10 },
    { top: '65%', left: '10%', rotate: 15 },
    { top: '62%', left: '60%', rotate: -7 },
  ]

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'linear-gradient(135deg, #FFF8DC 0%, #FFF54F 50%, #FFF176 100%)' }}>
      <Confetti />

      {/* String lights at top */}
      <StringLights />

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '20px 40px', position: 'relative', zIndex: 1 }}>
        {/* Birthday banner SVG */}
        <div style={{ width: '100%', maxWidth: 700 }}>
          <svg width="100%" viewBox="0 0 700 100">
            {/* Banner ribbon */}
            <path d="M30 70 Q350 45 670 70" stroke="#8B5E3C" strokeWidth="8" fill="none"
              style={{ animation: 'signpostFloat 4s ease-in-out infinite' }}/>
            <path d="M30 70 Q350 45 670 70" stroke="#6B4020" strokeWidth="4" fill="none"
              style={{ animation: 'signpostFloat 4s ease-in-out infinite' }}/>
            <rect x="20" y="18" width="660" height="55" rx="10" fill="#F4831F" stroke="#c0392b" strokeWidth="4"
              style={{ animation: 'signpostFloat 4s ease-in-out infinite' }}/>
            <rect x="24" y="22" width="652" height="47" rx="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
            <text x="350" y="53" textAnchor="middle" fontFamily="Baloo 2,cursive" fontWeight="800" fontSize="28" fill="white"
              style={{ animation: 'signpostFloat 4s ease-in-out infinite' }}>
              Happy Birthday, Manu Bhai! 🎂
            </text>
          </svg>
        </div>

        {/* Child's speech bubble */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, maxWidth: 700, width: '100%' }}>
          {/* Child silhouette */}
          <svg width="80" height="140" viewBox="0 0 80 140" style={{ flexShrink: 0 }}>
            <circle cx="40" cy="25" r="20" fill="#C68642"/>
            <rect x="28" y="45" width="24" height="35" rx="6" fill="#283593"/>
            <rect x="20" y="50" width="8" height="20" rx="3" fill="#C68642"/>
            <rect x="52" y="50" width="8" height="20" rx="3" fill="#C68642"/>
            <rect x="30" y="78" width="9" height="25" rx="3" fill="#283593"/>
            <rect x="41" y="78" width="9" height="25" rx="3" fill="#283593"/>
            {/* Waving hand */}
            <path d="M52 50 Q65 42 70 36" stroke="#C68642" strokeWidth="5" fill="none" strokeLinecap="round"/>
            <circle cx="70" cy="36" r="5" fill="#C68642"/>
          </svg>

          {/* Speech bubble */}
          <div style={{
            background: 'white',
            border: '3px solid #F4831F',
            borderRadius: 20,
            padding: '20px 24px',
            position: 'relative',
            boxShadow: '4px 4px 16px rgba(0,0,0,0.1)',
            flex: 1,
          }}>
            <div style={{
              position: 'absolute',
              left: -18,
              bottom: 24,
              width: 0, height: 0,
              borderTop: '10px solid transparent',
              borderBottom: '10px solid transparent',
              borderRight: '18px solid white',
            }}/>
            <p style={{ fontFamily: 'Caveat, cursive', fontSize: 22, color: '#5D3A1A', margin: 0, lineHeight: 1.4 }}>
              "Main abhi school ke liye tayyar hoon! Yeh sab aapki wajah se hai!"
            </p>
            <p style={{ fontFamily: 'Hind, sans-serif', fontSize: 15, color: '#9E9E9E', margin: '8px 0 0', fontStyle: 'italic' }}>
              I am confident that I am ready for school now! All thanks to you! 🌟
            </p>
          </div>
        </div>

        {/* Thank-you video */}
        <div style={{ width: '100%', maxWidth: 640, border: '6px solid #F4831F', borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.22)', background: '#1a0a00' }}>
          <div style={{ paddingTop: '56.25%', position: 'relative' }}>
            <iframe
              src="https://drive.google.com/file/d/1KCsNyCqQf63tuMRnSqFdZf2FKE0w9vik/preview"
              title="Thank you video"
              allow="autoplay; fullscreen"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </div>

        {/* Birthday chits scattered */}
        <div style={{ position: 'relative', width: '100%', height: 420, maxWidth: 800 }}>
          {CHIT_MESSAGES.map((chit, i) => (
            <div
              key={i}
              className="chit-container"
              style={{
                position: 'absolute',
                ...chitPositions[i],
                transform: `rotate(${chitPositions[i].rotate}deg)`,
                width: 180,
                height: 120,
                zIndex: flippedChits.has(i) ? 10 : i + 1,
              }}
              onClick={() => toggleChit(i)}
            >
              <div className={`chit-inner ${flippedChits.has(i) ? 'flipped' : ''}`}
                style={{ width: '100%', height: '100%' }}>
                {/* Front */}
                <div className="chit-front" style={{ background: '#FFFDE7', border: '2px solid #F4831F', borderRadius: 8, boxShadow: '3px 3px 10px rgba(0,0,0,0.15)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24 }}>💌</div>
                    <div style={{ fontFamily: 'Caveat, cursive', fontSize: 16, color: '#795548', marginTop: 4 }}>
                      Tap to read!
                    </div>
                    <div style={{ fontFamily: 'Caveat, cursive', fontSize: 11, color: '#9E9E9E' }}>
                      from {chit.from}
                    </div>
                  </div>
                </div>
                {/* Back */}
                <div className="chit-back" style={{ borderRadius: 8, boxShadow: '3px 3px 10px rgba(0,0,0,0.15)', padding: 14 }}>
                  <p style={{ fontFamily: 'Caveat, cursive', fontSize: 13, color: '#5D4037', lineHeight: 1.4, textAlign: 'center' }}>
                    {chit.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Balloon row */}
        <div style={{ width: '100%', maxWidth: 700 }}>
          <svg width="100%" height="100" viewBox="0 0 700 100">
            {/* String connecting to post */}
            <line x1="350" y1="80" x2="350" y2="100" stroke="#888" strokeWidth="2"/>
            {Array.from({length: 12}, (_, i) => {
              const bx = 30 + i * 58
              const col = ['#F4831F','#4CAF50','#FFF176','#E53935','#9C27B0','#2196F3'][i % 6]
              return <Balloon key={i} x={bx} color={col} delay={i * 0.08}/>
            })}
          </svg>
        </div>

        {/* Footer */}
        <div style={{
          fontFamily: 'Caveat, cursive',
          fontSize: 28,
          color: '#795548',
          textAlign: 'center',
          padding: '20px 0 40px',
        }}>
          Phir Milenge! 🙏
        </div>
      </div>
    </div>
  )
}
