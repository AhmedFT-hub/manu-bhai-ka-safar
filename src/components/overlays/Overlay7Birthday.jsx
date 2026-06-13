import React from 'react'
import VideoPlayer from '../VideoPlayer'

export default function Overlay7Birthday({ onReset }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <VideoPlayer src="/scene/thankyou.mp4" driveId="1KCsNyCqQf63tuMRnSqFdZf2FKE0w9vik" accent="#F4831F" />
      <button className="signpost-btn" onClick={onReset} style={{ fontSize: 18, padding: '12px 36px' }}>
        ↺ Go back to the village entrance
      </button>
    </div>
  )
}
