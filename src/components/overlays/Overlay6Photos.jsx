import React, { useState, useEffect } from 'react'

const FRAMES = [
  { type: 'ornate', style: { border: '8px solid #D4A017', boxShadow: '0 0 0 2px #B8860B, 4px 4px 16px rgba(0,0,0,0.2)', borderRadius: 4 }, caption: 'Field Visit — Maharashtra, 2022' },
  { type: 'blue', style: { border: '6px solid #1565C0', boxShadow: '4px 4px 16px rgba(0,0,0,0.2)', borderRadius: 6 }, caption: 'Classroom Session — Delhi, 2021' },
  { type: 'metal', style: { border: '4px solid #616161', boxShadow: '0 0 0 1px #9E9E9E, 4px 4px 12px rgba(0,0,0,0.25)', borderRadius: 2 }, caption: 'AWW Training — UP, 2023' },
  { type: 'rope', style: { outline: '8px solid transparent', boxShadow: 'inset 0 0 0 8px #8D6E63, 4px 4px 16px rgba(0,0,0,0.2)', borderRadius: 4 }, caption: 'Community Event — Rajasthan, 2022' },
  { type: 'flower', style: { border: '6px solid white', boxShadow: '0 0 0 3px #E91E63, 4px 4px 16px rgba(0,0,0,0.2)', borderRadius: 6 }, caption: 'Parent Engagement — Haryana, 2023' },
  { type: 'dark', style: { border: '8px solid #4E342E', boxShadow: '4px 4px 16px rgba(0,0,0,0.3)', borderRadius: 3 }, caption: 'Story Time — Uttarakhand, 2022' },
  { type: 'pastel', style: { border: '6px solid #F48FB1', boxShadow: '4px 4px 16px rgba(0,0,0,0.15)', borderRadius: 8 }, caption: 'Art Day — Karnataka, 2023' },
  { type: 'vintage', style: { border: '6px solid #795548', boxShadow: '0 0 0 2px #8D6E63, 4px 4px 16px rgba(0,0,0,0.2)', borderRadius: 3 }, caption: 'Graduation Day — Mumbai, 2023' },
]

export default function Overlay6Photos() {
  const [lightbox, setLightbox] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Caveat, cursive', fontWeight: 700, fontSize: 56, color: '#5D3A1A', margin: 0, lineHeight: 1 }}>
          Yaadein
        </h1>
        <p style={{ fontFamily: 'Hind, sans-serif', fontSize: 16, color: '#9E9E9E', margin: '4px 0 0' }}>
          Memories from the field — faces, places, and moments that matter
        </p>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
        width: '100%',
      }}>
        {FRAMES.map((frame, i) => (
          <div
            key={i}
            onClick={() => setLightbox(i)}
            style={{
              cursor: 'pointer',
              ...frame.style,
              transform: visible ? `translateY(0) rotate(${[-2,1,-1,2,-1.5,2,-2,1][i]}deg)` : 'translateY(30px)',
              opacity: visible ? 1 : 0,
              transition: `transform 0.5s ease ${i * 100}ms, opacity 0.5s ease ${i * 100}ms, box-shadow 0.2s ease`,
              position: 'relative',
            }}
            className="photo-frame-wrapper"
          >
            {/* Photo placeholder */}
            <div style={{
              aspectRatio: '4/3',
              background: `linear-gradient(135deg, #FFB74D ${i * 5}%, #F57C00)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}>
              <span style={{ fontSize: 28, opacity: 0.7 }}>📸</span>
              <span style={{ fontFamily: 'Caveat, cursive', fontSize: 12, color: 'white', opacity: 0.8 }}>
                Photo Placeholder
              </span>
            </div>
            {/* Caption */}
            <div style={{
              padding: '8px 4px 4px',
              fontFamily: 'Caveat, cursive',
              fontSize: 12,
              color: '#5D4037',
              textAlign: 'center',
              background: 'rgba(253,240,213,0.9)',
            }}>
              {frame.caption}
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: 'Caveat, cursive', fontSize: 18, color: '#795548', textAlign: 'center' }}>
        Har tasveer ek kahaani hai — jo aapne likhi hai 📖
      </p>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="lightbox"
          onClick={() => setLightbox(null)}
        >
          <button
            className="lightbox-nav prev"
            onClick={(e) => { e.stopPropagation(); setLightbox(prev => (prev - 1 + FRAMES.length) % FRAMES.length) }}
          >
            ←
          </button>
          <button
            className="lightbox-nav next"
            onClick={(e) => { e.stopPropagation(); setLightbox(prev => (prev + 1) % FRAMES.length) }}
          >
            →
          </button>

          <div
            style={{
              ...FRAMES[lightbox].style,
              maxWidth: 600,
              width: '80%',
              background: 'transparent',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              aspectRatio: '4/3',
              background: `linear-gradient(135deg, #FFB74D, #F57C00)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 12,
              position: 'relative',
            }}>
              <span style={{ fontSize: 48, opacity: 0.7 }}>📸</span>
              <span style={{ fontFamily: 'Caveat, cursive', fontSize: 20, color: 'white' }}>
                [ Replace with real photo ]
              </span>
              {/* Vignette */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
                pointerEvents: 'none',
              }}/>
            </div>
          </div>

          <div style={{ fontFamily: 'Caveat, cursive', fontSize: 20, color: 'white', textAlign: 'center', marginTop: 12 }}>
            {FRAMES[lightbox].caption}
          </div>

          <div style={{ fontFamily: 'Caveat, cursive', fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>
            {lightbox + 1} / {FRAMES.length} — Click anywhere to close
          </div>
        </div>
      )}
    </div>
  )
}
