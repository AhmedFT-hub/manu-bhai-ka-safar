import React from 'react'

export default function Overlay1Welcome({ onClose }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, paddingTop: 20 }}>
      {/* Gate arch as decorative frame */}
      <svg width="700" height="80" viewBox="0 0 700 80" style={{ marginBottom: -20 }}>
        <defs>
          <linearGradient id="archGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5E3C"/>
            <stop offset="100%" stopColor="#6B4020"/>
          </linearGradient>
        </defs>
        {/* Left pillar top */}
        <rect x="20" y="40" width="40" height="40" fill="url(#archGrad)"/>
        <rect x="15" y="36" width="50" height="12" rx="3" fill="#7B4A1A"/>
        {/* Right pillar top */}
        <rect x="640" y="40" width="40" height="40" fill="url(#archGrad)"/>
        <rect x="635" y="36" width="50" height="12" rx="3" fill="#7B4A1A"/>
        {/* Arch beam */}
        <path d="M20 42 Q350 0 680 42" stroke="#7B4A1A" strokeWidth="20" fill="none"/>
        <path d="M20 42 Q350 5 680 42" stroke="#8B5E3C" strokeWidth="15" fill="none"/>
        {/* Marigolds on arch */}
        {Array.from({length: 22}, (_, i) => {
          const t = i / 21
          const x = 20 + t * 660
          const y = 42 - Math.sin(t * Math.PI) * 35
          return <g key={i}>
            <circle cx={x} cy={y} r="7" fill={i%2===0 ? '#F4831F' : '#FFC107'}/>
            <circle cx={x} cy={y} r="3.5" fill="#FFF176" opacity="0.8"/>
          </g>
        })}
        {/* Bells */}
        <path d="M25 55 Q18 68 22 76 Q25 78 28 76 Q32 68 25 55" fill="#D4A017"/>
        <path d="M675 55 Q668 68 672 76 Q675 78 678 76 Q682 68 675 55" fill="#D4A017"/>
      </svg>

      <h1 style={{ fontFamily: 'Baloo 2, cursive', fontWeight: 800, fontSize: 36, color: '#795548', textAlign: 'center', margin: 0 }}>
        Happy Birthday, Manu Bhai!
      </h1>
      <p style={{ fontFamily: 'Caveat, cursive', fontSize: 22, color: '#8B5E3C', textAlign: 'center', maxWidth: 620 }}>
        Let me take you on a tour of our beloved Aanganwadi — let's go! ✨
      </p>

      {/* Video container styled inside gate arch */}
      <div style={{
        width: '100%',
        maxWidth: 640,
        position: 'relative',
        border: '6px solid #8B5E3C',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        background: '#1a0a00',
      }}>
        <div style={{ paddingTop: '56.25%', position: 'relative' }}>
          <iframe
            src="https://drive.google.com/file/d/17d-TTX2MEseJnWaTvicj8dmkcv7sltkB/preview"
            title="Welcome video"
            allow="autoplay; fullscreen"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>

      {/* Decorative arch bottom */}
      <svg width="700" height="50" viewBox="0 0 700 50" style={{ marginTop: -20 }}>
        <rect x="20" y="0" width="40" height="50" fill="#8B5E3C"/>
        <rect x="640" y="0" width="40" height="50" fill="#8B5E3C"/>
        {/* Diya lamps */}
        <g transform="translate(10, 30)"><DiyaSmall/></g>
        <g transform="translate(630, 30)"><DiyaSmall/></g>
      </svg>

      {/* Continue button */}
      <button className="signpost-btn" onClick={onClose} style={{ marginTop: 12, fontSize: 24, padding: '14px 48px' }}>
        Let's Go →
      </button>

      <p style={{ fontFamily: 'Hind, sans-serif', color: '#9E9E9E', fontSize: 13, marginTop: 8 }}>
        Close this and keep scrolling — your journey has just begun!
      </p>
    </div>
  )
}

function DiyaSmall() {
  return (
    <g>
      <ellipse cx="15" cy="18" rx="13" ry="5" fill="#C4843A"/>
      <path d="M2 18 Q5 8 15 6 Q25 8 28 18" fill="#D4956A"/>
      <line x1="15" y1="4" x2="15" y2="0" stroke="#333" strokeWidth="1.5"/>
      <g style={{ animation: 'flicker 0.8s ease-in-out infinite', transformOrigin: '15px 4px' }}>
        <path d="M15 4 Q11 -3 15 -12 Q19 -3 15 4" fill="#FF6B00"/>
        <path d="M15 2 Q13 -2 15 -8 Q17 -2 15 2" fill="#FFC107"/>
      </g>
    </g>
  )
}
