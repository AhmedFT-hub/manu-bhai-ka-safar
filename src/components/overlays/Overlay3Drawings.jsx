import React, { useState } from 'react'

const DRAWINGS = [
  { label: 'Priya • Maharashtra', color: '#FFC107', bg: '#FFF8E1' },
  { label: 'Ravi • UP', color: '#4CAF50', bg: '#F1F8E9' },
  { label: 'Anita • Delhi', color: '#E91E63', bg: '#FCE4EC' },
  { label: 'Suresh • Rajasthan', color: '#9C27B0', bg: '#F3E5F5' },
  { label: 'Meena • Haryana', color: '#2196F3', bg: '#E3F2FD' },
  { label: 'Gopal • Uttarakhand', color: '#FF5722', bg: '#FBE9E7' },
  { label: 'Lakshmi • Telangana', color: '#009688', bg: '#E0F2F1' },
  { label: 'Arun • Bihar', color: '#FF9800', bg: '#FFF3E0' },
  { label: 'Divya • Karnataka', color: '#3F51B5', bg: '#E8EAF6' },
]

const DRAWING_SVGS = [
  // Sun
  <svg viewBox="0 0 80 80" width="100%" height="100%">
    <circle cx="40" cy="40" r="15" fill="#FFC107"/>
    {[0,40,80,120,160,200,240,280,320].map((a,i) => (
      <line key={i} x1={40+Math.cos(a*Math.PI/180)*17} y1={40+Math.sin(a*Math.PI/180)*17}
        x2={40+Math.cos(a*Math.PI/180)*25} y2={40+Math.sin(a*Math.PI/180)*25}
        stroke="#FF8C00" strokeWidth="3" strokeLinecap="round"/>
    ))}
    <circle cx="40" cy="40" r="8" fill="#FFD54F"/>
  </svg>,
  // House
  <svg viewBox="0 0 80 80" width="100%" height="100%">
    <rect x="20" y="42" width="40" height="30" fill="#FF7043"/>
    <polygon points="15,42 40,18 65,42" fill="#8D6E63"/>
    <rect x="32" y="57" width="16" height="15" fill="#5D4037"/>
    <rect x="25" y="46" width="10" height="10" fill="#87CEEB"/>
    <circle cx="32" cy="18" r="3" fill="#FFF" opacity="0.6"/>
    <circle cx="25" cy="12" r="4" fill="#FFF" opacity="0.5"/>
    <circle cx="22" cy="7" r="5" fill="#AAA" opacity="0.5"/>
  </svg>,
  // Rainbow
  <svg viewBox="0 0 80 80" width="100%" height="100%">
    {['#E53935','#FF8C00','#FFC107','#4CAF50','#2196F3','#9C27B0'].map((c,i) => (
      <path key={i} d={`M8,70 A${55-i*7},${45-i*7} 0 0,1 ${72},70`} stroke={c} strokeWidth="5" fill="none"/>
    ))}
    <ellipse cx="14" cy="68" rx="8" ry="6" fill="white" opacity="0.8"/>
    <ellipse cx="66" cy="68" rx="8" ry="6" fill="white" opacity="0.8"/>
  </svg>,
  // Flowers
  <svg viewBox="0 0 80 80" width="100%" height="100%">
    {[0,60,120,180,240,300].map((a,i) => (
      <ellipse key={i} cx={40+Math.cos(a*Math.PI/180)*15} cy={35+Math.sin(a*Math.PI/180)*15}
        rx="8" ry="12" fill={['#E91E63','#FFC107','#9C27B0','#FF5722','#2196F3','#4CAF50'][i]}
        transform={`rotate(${a},${40+Math.cos(a*Math.PI/180)*15},${35+Math.sin(a*Math.PI/180)*15})`}/>
    ))}
    <circle cx="40" cy="35" r="8" fill="#FFF176"/>
    <line x1="40" y1="50" x2="40" y2="70" stroke="#4CAF50" strokeWidth="3"/>
    <ellipse cx="32" cy="62" rx="8" ry="4" fill="#4CAF50" transform="rotate(-30,32,62)"/>
  </svg>,
  // Cat
  <svg viewBox="0 0 80 80" width="100%" height="100%">
    <ellipse cx="40" cy="50" rx="22" ry="16" fill="#FF8A65"/>
    <circle cx="40" cy="34" r="17" fill="#FF8A65"/>
    <polygon points="26,22 20,8 32,20" fill="#FF7043"/>
    <polygon points="54,22 60,8 48,20" fill="#FF7043"/>
    <circle cx="34" cy="32" r="5" fill="white"/><circle cx="34" cy="32" r="3" fill="#222"/>
    <circle cx="46" cy="32" r="5" fill="white"/><circle cx="46" cy="32" r="3" fill="#222"/>
    <path d="M34 40 Q40 45 46 40" stroke="#333" strokeWidth="2" fill="none"/>
    <path d="M62 55 Q72 48 70 38" stroke="#FF7043" strokeWidth="3" fill="none"/>
  </svg>,
  // Bird
  <svg viewBox="0 0 80 80" width="100%" height="100%">
    <ellipse cx="40" cy="45" rx="18" ry="12" fill="#42A5F5"/>
    <circle cx="52" cy="38" r="10" fill="#42A5F5"/>
    <circle cx="58" cy="35" r="4" fill="white"/><circle cx="59" cy="35" r="2" fill="#222"/>
    <path d="M56 41 L64 42 L56 44Z" fill="#FF8C00"/>
    <path d="M22 35 Q30 28 38 35" stroke="#1565C0" strokeWidth="2" fill="none"/>
    <path d="M22 42 Q30 35 38 42" stroke="#1565C0" strokeWidth="2" fill="none"/>
    <line x1="36" y1="57" x2="34" y2="68" stroke="#FF8C00" strokeWidth="2"/>
    <line x1="42" y1="57" x2="44" y2="68" stroke="#FF8C00" strokeWidth="2"/>
  </svg>,
  // Tree
  <svg viewBox="0 0 80 80" width="100%" height="100%">
    <rect x="36" y="52" width="8" height="24" fill="#795548"/>
    <circle cx="40" cy="45" rx="20" ry="22" fill="#4CAF50"/>
    <circle cx="28" cy="50" rx="15" ry="17" fill="#388E3C"/>
    <circle cx="52" cy="48" rx="16" ry="18" fill="#2E7D32"/>
    <circle cx="40" cy="32" rx="14" ry="16" fill="#66BB6A"/>
  </svg>,
  // Butterfly
  <svg viewBox="0 0 80 80" width="100%" height="100%">
    <ellipse cx="28" cy="34" rx="18" ry="14" fill="#E91E63" opacity="0.85" transform="rotate(-20,28,34)"/>
    <ellipse cx="52" cy="34" rx="18" ry="14" fill="#FF5722" opacity="0.85" transform="rotate(20,52,34)"/>
    <ellipse cx="30" cy="50" rx="12" ry="10" fill="#9C27B0" opacity="0.8" transform="rotate(20,30,50)"/>
    <ellipse cx="50" cy="50" rx="12" ry="10" fill="#FF8C00" opacity="0.8" transform="rotate(-20,50,50)"/>
    <ellipse cx="40" cy="40" rx="4" ry="14" fill="#333"/>
    <path d="M38 28 Q35 22 32 18" stroke="#333" strokeWidth="1.5" fill="none"/>
    <path d="M42 28 Q45 22 48 18" stroke="#333" strokeWidth="1.5" fill="none"/>
  </svg>,
  // Star
  <svg viewBox="0 0 80 80" width="100%" height="100%">
    <polygon points="40,10 47,30 68,30 52,45 58,65 40,52 22,65 28,45 12,30 33,30" fill="#FFC107" stroke="#FF8C00" strokeWidth="2"/>
    <circle cx="40" cy="40" r="8" fill="#FFF176" opacity="0.7"/>
  </svg>,
]

export default function Overlay3Drawings() {
  const [hovered, setHovered] = useState(null)

  return (
    <div style={{ minHeight: '80vh' }}>
      <h2 style={{ fontFamily: 'Baloo 2, cursive', fontWeight: 800, fontSize: 32, color: '#5D3A1A', textAlign: 'center', marginBottom: 8 }}>
        Bacchon Ki Duniya 🎨
      </h2>
      <p style={{ fontFamily: 'Hind, sans-serif', fontSize: 16, color: '#795548', textAlign: 'center', marginBottom: 32 }}>
        Unke rang, unki umang — yeh rang hi toh hai hamari pehchaan
      </p>

      {/* Corkboard */}
      <div
        className="corkboard"
        style={{
          borderRadius: 12,
          padding: 32,
          boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.15)',
          border: '4px solid #A0722A',
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
        }}>
          {DRAWINGS.map((d, i) => {
            const angle = -8 + (i * 3.7) % 17
            return (
              <div
                key={i}
                className="photo-frame-wrapper"
                style={{
                  transform: `rotate(${angle}deg)`,
                  background: d.bg,
                  borderRadius: 4,
                  padding: 12,
                  position: 'relative',
                  boxShadow: hovered === i
                    ? '0 16px 40px rgba(0,0,0,0.25)'
                    : '2px 6px 16px rgba(0,0,0,0.15)',
                  zIndex: hovered === i ? 10 : 1,
                  cursor: 'default',
                  clipPath: i % 3 === 0
                    ? 'polygon(2% 0%, 98% 1%, 100% 97%, 99% 100%, 1% 99%, 0% 3%)'
                    : i % 3 === 1
                    ? 'polygon(1% 1%, 99% 0%, 100% 99%, 98% 100%, 0% 100%, 2% 2%)'
                    : 'polygon(0% 2%, 98% 0%, 100% 98%, 100% 100%, 2% 100%, 0% 98%)',
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Thumbtack */}
                <div style={{
                  position: 'absolute',
                  top: -6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: ['#c0392b','#f39c12','#27ae60','#2980b9','#8e44ad','#e74c3c','#16a085','#d35400','#7f8c8d'][i],
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  zIndex: 2,
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.3)',
                  }}/>
                </div>

                {/* Drawing */}
                <div style={{ width: '100%', aspectRatio: '1', marginBottom: 8 }}>
                  {DRAWING_SVGS[i]}
                </div>

                {/* Label */}
                <p style={{
                  fontFamily: 'Caveat, cursive',
                  fontSize: 13,
                  color: '#5D4037',
                  textAlign: 'center',
                  margin: 0,
                }}>
                  {d.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <p style={{ fontFamily: 'Caveat, cursive', fontSize: 18, color: '#795548', textAlign: 'center', marginTop: 24 }}>
        Har drawing ek sapne ka rang hai 🌈
      </p>
    </div>
  )
}
