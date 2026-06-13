import React from 'react'

// Shows a designed infographic slide as the milestone's popup view.
export default function MilestoneSlide({ src, onClose }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
      <img src={src} alt="" style={{ width: '100%', display: 'block', borderRadius: 14, boxShadow: '0 10px 30px rgba(0,0,0,0.14)' }} />
      <button className="signpost-btn" onClick={onClose} style={{ fontSize: 20, padding: '12px 42px' }}>
        Aage Chalo →
      </button>
    </div>
  )
}
