import React, { useState, useEffect } from 'react'
import { PHOTOS } from '../../scene/assets'

const FRAME_STYLES = [
  { border: '10px solid #fff', boxShadow: '0 0 0 2px #D4A017, 6px 8px 22px rgba(0,0,0,0.25)' },
  { border: '10px solid #fff', boxShadow: '0 0 0 2px #1565C0, 6px 8px 22px rgba(0,0,0,0.25)' },
  { border: '10px solid #fff', boxShadow: '0 0 0 2px #E91E63, 6px 8px 22px rgba(0,0,0,0.25)' },
  { border: '10px solid #fff', boxShadow: '0 0 0 2px #4E342E, 6px 8px 22px rgba(0,0,0,0.25)' },
]
const TILT = [-2.5, 2, -1.5, 2.5]
const CAPTION = 'Raigad Aanganwadi Visit · Jan 2026'

export default function Overlay6Photos() {
  const [lightbox, setLightbox] = useState(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t) }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Caveat, cursive', fontWeight: 700, fontSize: 56, color: '#5D3A1A', margin: 0, lineHeight: 1 }}>
          The Memory Wall
        </h1>
        <p style={{ fontFamily: 'Hind, sans-serif', fontSize: 16, color: '#9E9E9E', margin: '4px 0 0' }}>
          Faces, places, and moments from the field
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28, width: '100%', maxWidth: 880 }}>
        {PHOTOS.map((src, i) => (
          <div
            key={i}
            onClick={() => setLightbox(i)}
            className="photo-frame-wrapper"
            style={{
              cursor: 'pointer', background: '#fff', borderRadius: 4, ...FRAME_STYLES[i % FRAME_STYLES.length],
              transform: visible ? `translateY(0) rotate(${TILT[i % TILT.length]}deg)` : 'translateY(30px)',
              opacity: visible ? 1 : 0,
              transition: `transform 0.5s ease ${i * 110}ms, opacity 0.5s ease ${i * 110}ms, box-shadow 0.2s ease`,
            }}
          >
            <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#000' }}>
              <img src={src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ padding: '8px 4px', fontFamily: 'Caveat, cursive', fontSize: 14, color: '#5D4037', textAlign: 'center' }}>
              {CAPTION}
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: 'Caveat, cursive', fontSize: 18, color: '#795548', textAlign: 'center' }}>
        Every photo is a story — one you helped write 📖
      </p>

      {lightbox !== null && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + PHOTOS.length) % PHOTOS.length) }}>‹</button>
          <button className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % PHOTOS.length) }}>›</button>
          <img src={PHOTOS[lightbox]} alt="" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '80vh', maxWidth: '88vw', border: '10px solid #fff', borderRadius: 4, boxShadow: '0 12px 50px rgba(0,0,0,0.5)' }} />
          <div style={{ fontFamily: 'Caveat, cursive', fontSize: 18, color: 'white', marginTop: 12 }}>
            {CAPTION} — {lightbox + 1} / {PHOTOS.length}
          </div>
        </div>
      )}
    </div>
  )
}
