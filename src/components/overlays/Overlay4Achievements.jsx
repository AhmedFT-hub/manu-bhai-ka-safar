import React from 'react'
import { SLIDES } from '../../scene/assets'

export default function Overlay4Achievements({ onClose }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
      <img src={SLIDES[4]} alt="" style={{ width: '100%', display: 'block', borderRadius: 14, boxShadow: '0 10px 30px rgba(0,0,0,0.14)' }} />

      {/* Content Bank in action — YouTube playlist */}
      <p style={{ fontFamily: 'Caveat, cursive', fontSize: 22, color: '#5D3A1A', margin: 0 }}>
        See the learning content in action 📺
      </p>
      <div style={{ width: '100%', maxWidth: 720, borderRadius: 14, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.18)', background: '#000' }}>
        <div style={{ paddingTop: '56.25%', position: 'relative' }}>
          <iframe
            src="https://www.youtube.com/embed/videoseries?list=PL9lon_QqVM-GnGwQgyFTRCR9jOXxRu84D"
            title="Content Bank playlist"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>

      <button className="signpost-btn" onClick={onClose} style={{ fontSize: 20, padding: '12px 42px' }}>
        Aage Chalo →
      </button>
    </div>
  )
}
