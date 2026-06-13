import React, { useState } from 'react'
import { DRAWINGS } from '../../scene/assets'

const TACK = ['#c0392b', '#f39c12', '#27ae60', '#2980b9', '#8e44ad']
const ANGLE = [-6, 4, -3, 5, -5]

export default function Overlay3Drawings() {
  const [open, setOpen] = useState(null)

  return (
    <div style={{ minHeight: '80vh' }}>
      <h2 style={{ fontFamily: 'Baloo 2, cursive', fontWeight: 800, fontSize: 32, color: '#5D3A1A', textAlign: 'center', marginBottom: 8 }}>
        Our Kids' Notice Board 🎨
      </h2>
      <p style={{ fontFamily: 'Hind, sans-serif', fontSize: 16, color: '#795548', textAlign: 'center', marginBottom: 32 }}>
        Handmade birthday drawings — made for you, Manu Bhai, by the children
      </p>

      <div className="corkboard" style={{ borderRadius: 12, padding: 'clamp(20px,4vw,40px)', boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.15)', border: '4px solid #A0722A' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 28, justifyItems: 'center' }}>
          {DRAWINGS.map((src, i) => (
            <div
              key={i}
              className="photo-frame-wrapper"
              onClick={() => setOpen(i)}
              style={{ transform: `rotate(${ANGLE[i % ANGLE.length]}deg)`, background: '#fff', borderRadius: 4, padding: 10, position: 'relative', boxShadow: '2px 6px 16px rgba(0,0,0,0.22)', cursor: 'pointer', maxWidth: 240 }}
            >
              <div style={{ position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)', width: 16, height: 16, borderRadius: '50%', background: TACK[i % TACK.length], boxShadow: '0 2px 4px rgba(0,0,0,0.35)', zIndex: 2 }} />
              <img src={src} alt={`Drawing ${i + 1}`} loading="lazy" style={{ width: '100%', display: 'block', borderRadius: 2 }} />
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontFamily: 'Caveat, cursive', fontSize: 18, color: '#795548', textAlign: 'center', marginTop: 24 }}>
        Every drawing is the colour of a dream 🌈
      </p>

      {open !== null && (
        <div className="lightbox" onClick={() => setOpen(null)}>
          <img src={DRAWINGS[open]} alt="" style={{ maxHeight: '82vh', maxWidth: '92vw', borderRadius: 8, border: '8px solid #fff', boxShadow: '0 12px 50px rgba(0,0,0,0.5)' }} />
          {DRAWINGS.length > 1 && (
            <>
              <button className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + DRAWINGS.length) % DRAWINGS.length) }}>‹</button>
              <button className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % DRAWINGS.length) }}>›</button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
