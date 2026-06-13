import React from 'react'
import VideoPlayer from '../VideoPlayer'

export default function Overlay1Welcome({ onClose }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, paddingTop: 8, maxWidth: 900, margin: '0 auto' }}>
      {/* marigold garland strip */}
      <div style={{ display: 'flex', gap: 6, fontSize: 22, opacity: 0.9 }}>
        🪔 🌼 🌸 🌼 🌸 🌼 🪔
      </div>

      <div style={{ textAlign: 'center' }}>
        <div className="caveat" style={{ fontSize: 18, color: '#C77F2E', letterSpacing: '0.04em' }}>Stop 1 · The Village Entrance</div>
        <h1 style={{ fontFamily: 'Baloo 2, cursive', fontWeight: 800, fontSize: 'clamp(28px,4vw,42px)', color: '#6B4226', margin: '4px 0 0', lineHeight: 1.1 }}>
          Happy Birthday, Manu Bhai! 🎂
        </h1>
      </div>

      <VideoPlayer src="/scene/welcome.mp4" driveId="17d-TTX2MEseJnWaTvicj8dmkcv7sltkB" accent="#F4831F" />

      <button className="signpost-btn" onClick={onClose} style={{ marginTop: 6, fontSize: 22, padding: '13px 44px' }}>
        Let's Go →
      </button>
      <p style={{ fontFamily: 'Hind, sans-serif', color: '#A98B6B', fontSize: 13, margin: 0 }}>
        Close this and keep scrolling — the journey continues
      </p>
    </div>
  )
}
