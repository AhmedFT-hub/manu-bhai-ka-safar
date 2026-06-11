import React, { useEffect, useState } from 'react'

const LANGUAGES = ['हिंदी','తెలుగు','ਪੰਜਾਬੀ','বাংলা','தமிழ்','ओडिया','मराठी','ﺍﺳﺍﻣﻴﺎ','ગુજરાતી','ಕನ್ನಡ']
const BOOK_COLORS = ['#E53935','#1565C0','#2E7D32','#F57C00','#6A1B9A','#00838F','#AD1457','#4E342E','#1A237E','#33691E']

export default function Overlay4Achievements() {
  const [booksVisible, setBooksVisible] = useState(0)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i++
      setBooksVisible(i)
      if (i >= LANGUAGES.length) clearInterval(interval)
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Blackboard header */}
      <div className="blackboard" style={{ textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Caveat, cursive', fontSize: 36, color: 'rgba(255,255,255,0.92)', margin: 0, textShadow: '1px 1px 0 rgba(0,0,0,0.3)' }}>
          Humari Uplabdhiyan
        </h2>
        <p style={{ fontFamily: 'Caveat, cursive', fontSize: 18, color: 'rgba(255,255,255,0.7)', margin: '4px 0 0' }}>
          Our Achievements
        </p>
      </div>

      {/* Two posters side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Poster 1 — Poshan Tracker */}
        <div style={{
          background: '#FFFDE7',
          border: '3px solid #c0392b',
          borderRadius: 8,
          padding: 24,
          position: 'relative',
          boxShadow: '4px 4px 16px rgba(0,0,0,0.1)',
        }}>
          {/* Hand-drawn border inner */}
          <div style={{ position: 'absolute', inset: 8, border: '2px dashed rgba(192,57,43,0.3)', borderRadius: 4, pointerEvents: 'none' }}/>

          <h3 style={{ fontFamily: 'Baloo 2, cursive', fontWeight: 800, fontSize: 18, color: '#c0392b', textAlign: 'center', marginBottom: 16 }}>
            Poshan Tracker
          </h3>

          {/* Phone illustration */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <PoshanTrackerPhone />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontWeight: 800, fontSize: 28, color: '#F4831F' }}>
              1.4 Million
            </div>
            <div style={{ fontFamily: 'Hind, sans-serif', fontWeight: 600, fontSize: 14, color: '#795548' }}>
              AWW Workers
            </div>
            <div style={{ fontFamily: 'Hind, sans-serif', fontSize: 13, color: '#9E9E9E', marginTop: 4 }}>
              Now have access to Rocket Learning content
            </div>
          </div>

          {/* AWW figure icons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            {Array.from({length: 8}, (_, i) => (
              <AWWFigure key={i} color={['#F4831F','#4CAF50','#2196F3','#E91E63','#9C27B0','#00BCD4','#FF5722','#795548'][i]}/>
            ))}
          </div>
        </div>

        {/* Poster 2 — Content Bank */}
        <div style={{
          background: '#F3E5F5',
          border: '3px solid #7B1FA2',
          borderRadius: 8,
          padding: 24,
          position: 'relative',
          boxShadow: '4px 4px 16px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}>
          {/* Ribbon banner */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: '#FFC107',
            color: '#5D3A1A',
            fontFamily: 'Caveat, cursive',
            fontWeight: 700,
            fontSize: 12,
            padding: '4px 20px',
            transformOrigin: 'top right',
            transform: 'rotate(0deg)',
            borderRadius: '0 8px 0 8px',
            zIndex: 2,
          }}>
            2026: 10 new languages!
          </div>

          <h3 style={{ fontFamily: 'Baloo 2, cursive', fontWeight: 800, fontSize: 18, color: '#7B1FA2', textAlign: 'center', marginBottom: 16 }}>
            Content Bank 📚
          </h3>

          {/* Bookshelf */}
          <Bookshelf booksVisible={booksVisible} />

          <div style={{ fontFamily: 'Hind, sans-serif', fontSize: 13, color: '#6A1B9A', textAlign: 'center', marginTop: 12 }}>
            Content available in:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 8 }}>
            {LANGUAGES.map((lang, i) => (
              <span key={i} style={{
                background: `${BOOK_COLORS[i]}22`,
                border: `1px solid ${BOOK_COLORS[i]}66`,
                color: BOOK_COLORS[i],
                padding: '2px 10px',
                borderRadius: 12,
                fontFamily: 'Hind, sans-serif',
                fontSize: 13,
                fontWeight: 500,
                opacity: i < booksVisible ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}>
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CRT TV */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <CRTTV />
      </div>
    </div>
  )
}

function PoshanTrackerPhone() {
  return (
    <svg width="120" height="200" viewBox="0 0 120 200">
      {/* Phone body */}
      <rect x="15" y="5" width="90" height="190" rx="16" fill="#263238" stroke="#37474F" strokeWidth="2"/>
      <rect x="18" y="8" width="84" height="184" rx="14" fill="#1C2833"/>
      {/* Screen */}
      <rect x="20" y="25" width="80" height="145" rx="6" fill="#4FC3F7" opacity="0.15"/>
      <rect x="20" y="25" width="80" height="145" rx="6" fill="none" stroke="#4FC3F7" strokeWidth="1" opacity="0.3"/>
      {/* Notch */}
      <rect x="45" y="10" width="30" height="8" rx="4" fill="#1C2833"/>
      {/* Home button */}
      <circle cx="60" cy="182" r="7" fill="#37474F" stroke="#546E7A" strokeWidth="1"/>
      {/* App UI on screen */}
      <rect x="28" y="32" width="64" height="20" rx="4" fill="#FF7043" opacity="0.9"/>
      <text x="60" y="46" textAnchor="middle" fontFamily="Hind,sans-serif" fontSize="8" fill="white" fontWeight="600">Poshan Tracker</text>
      <rect x="28" y="58" width="30" height="10" rx="3" fill="#4CAF50" opacity="0.7"/>
      <rect x="28" y="74" width="45" height="10" rx="3" fill="#2196F3" opacity="0.7"/>
      <rect x="28" y="90" width="38" height="10" rx="3" fill="#9C27B0" opacity="0.7"/>
      <rect x="28" y="106" width="50" height="10" rx="3" fill="#FF5722" opacity="0.7"/>
      <rect x="28" y="120" width="35" height="10" rx="3" fill="#FFC107" opacity="0.7"/>
      {/* India map silhouette tiny */}
      <path d="M70 60 Q76 55 80 62 Q84 68 82 75 Q80 80 75 84 Q70 88 68 83 Q64 78 65 71 Q66 64 70 60Z"
        fill="#F4831F" opacity="0.3"/>
    </svg>
  )
}

function AWWFigure({ color }) {
  return (
    <svg width="28" height="42" viewBox="0 0 28 42">
      <circle cx="14" cy="8" r="6" fill={color} opacity="0.8"/>
      <rect x="9" y="14" width="10" height="16" rx="3" fill={color} opacity="0.8"/>
      <line x1="9" y1="16" x2="4" y2="25" stroke={color} strokeWidth="3" opacity="0.7" strokeLinecap="round"/>
      <line x1="19" y1="16" x2="24" y2="25" stroke={color} strokeWidth="3" opacity="0.7" strokeLinecap="round"/>
      <line x1="11" y1="30" x2="10" y2="40" stroke={color} strokeWidth="3" opacity="0.7" strokeLinecap="round"/>
      <line x1="17" y1="30" x2="18" y2="40" stroke={color} strokeWidth="3" opacity="0.7" strokeLinecap="round"/>
    </svg>
  )
}

function Bookshelf({ booksVisible }) {
  return (
    <svg width="100%" height="130" viewBox="0 0 280 130">
      {/* Shelf boards */}
      <rect x="0" y="40" width="280" height="8" rx="2" fill="#6D4C41"/>
      <rect x="0" y="90" width="280" height="8" rx="2" fill="#6D4C41"/>
      <rect x="0" y="125" width="280" height="8" rx="2" fill="#5D4037"/>
      {/* Side panels */}
      <rect x="0" y="0" width="8" height="128" rx="2" fill="#5D4037"/>
      <rect x="272" y="0" width="8" height="128" rx="2" fill="#5D4037"/>

      {/* Books on shelf 1 */}
      {LANGUAGES.slice(0, 5).map((lang, i) => {
        const bx = 12 + i * 52
        return (
          <g key={i} style={{
            opacity: i < booksVisible ? 1 : 0,
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            transform: i < booksVisible ? 'translateX(0)' : 'translateX(-20px)',
          }}>
            <rect x={bx} y="2" width="45" height="38" rx="3" fill={BOOK_COLORS[i]} opacity="0.9"/>
            <rect x={bx} y="2" width="6" height="38" rx="2" fill="rgba(0,0,0,0.2)"/>
            <text x={bx + 25} y="24" textAnchor="middle" fontFamily="Hind,sans-serif" fontSize="11"
              fill="white" fontWeight="600" style={{ writingMode: 'vertical-lr' }}>
              {lang.slice(0,4)}
            </text>
          </g>
        )
      })}

      {/* Books on shelf 2 */}
      {LANGUAGES.slice(5).map((lang, i) => {
        const bx = 12 + i * 52
        return (
          <g key={i} style={{
            opacity: (i + 5) < booksVisible ? 1 : 0,
            transition: `opacity 0.3s ease ${(i+5)*200}ms`,
          }}>
            <rect x={bx} y="52" width="45" height="36" rx="3" fill={BOOK_COLORS[i + 5]} opacity="0.9"/>
            <rect x={bx} y="52" width="6" height="36" rx="2" fill="rgba(0,0,0,0.2)"/>
            <text x={bx + 25} y="72" textAnchor="middle" fontFamily="Hind,sans-serif" fontSize="11"
              fill="white" fontWeight="600">
              {lang.slice(0,3)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function CRTTV() {
  const [flickered, setFlickered] = useState(false)
  useEffect(() => { setTimeout(() => setFlickered(true), 300) }, [])

  return (
    <div style={{ position: 'relative', width: 480, maxWidth: '100%' }}>
      <svg width="100%" viewBox="0 0 480 320" style={{ display: 'block' }}>
        {/* TV body */}
        <rect x="20" y="20" width="440" height="280" rx="24" fill="#2d2d2d"/>
        <rect x="24" y="24" width="432" height="272" rx="22" fill="#3d3d3d"/>
        {/* Screen bezel */}
        <rect x="40" y="35" width="330" height="220" rx="8" fill="#1a1a1a"/>
        {/* Screen */}
        <rect x="44" y="39" width="322" height="212" rx="6" fill="#0a0a0a"/>
        {/* Amber glow around screen */}
        <rect x="38" y="33" width="334" height="224" rx="10" fill="none" stroke="#FF8C00" strokeWidth="4" opacity="0.4"
          style={{ filter: 'blur(6px)' }}/>
        {/* Knobs */}
        <circle cx="405" cy="80" r="14" fill="#555" stroke="#444" strokeWidth="2"/>
        <circle cx="405" cy="80" r="6" fill="#333"/>
        <line x1="405" y1="73" x2="405" y2="80" stroke="#888" strokeWidth="2"/>
        <circle cx="405" cy="130" r="14" fill="#555" stroke="#444" strokeWidth="2"/>
        <circle cx="405" cy="130" r="6" fill="#333"/>
        <line x1="405" y1="123" x2="405" y2="130" stroke="#888" strokeWidth="2"/>
        {/* Antenna */}
        <rect x="170" y="4" width="4" height="22" rx="2" fill="#555" transform="rotate(-10,172,15)"/>
        <rect x="296" y="4" width="4" height="22" rx="2" fill="#555" transform="rotate(10,298,15)"/>
        {/* Speaker grille */}
        {Array.from({length: 6}, (_, i) => (
          <rect key={i} x={390} y={160 + i*10} width={55} height={5} rx={2} fill="#222"/>
        ))}
        {/* Legs */}
        <rect x="100" y="294" width="20" height="20" rx="4" fill="#333"/>
        <rect x="340" y="294" width="20" height="20" rx="4" fill="#333"/>
        {/* Scanlines */}
        {Array.from({length: 35}, (_, i) => (
          <rect key={i} x="44" y={39 + i*6} width="322" height="2" fill="black" opacity="0.08"/>
        ))}
      </svg>

      {/* Video embed inside screen */}
      <div style={{
        position: 'absolute',
        top: '12.5%',
        left: '9%',
        width: '68%',
        height: '67%',
        opacity: flickered ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}>
        <div className="placeholder-block" style={{ height: '100%', borderRadius: 4, border: 'none', background: '#111', color: '#FF8C00', flexDirection: 'column', gap: 8, fontSize: 14 }}>
          <span>📺</span>
          <span>YouTube Playlist</span>
          <span style={{ fontSize: 11, opacity: 0.7 }}>[ Place embed URL here ]</span>
        </div>
      </div>
    </div>
  )
}
