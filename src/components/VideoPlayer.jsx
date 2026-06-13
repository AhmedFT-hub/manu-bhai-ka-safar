import React, { useState } from 'react'

// Clean native video (just the frame + standard controls, no third-party chrome)
// when a local MP4 is present; falls back to the Google-Drive embed until the
// file is dropped in. 16:9 theatre frame.
export default function VideoPlayer({ src, driveId, poster, accent = '#F4831F' }) {
  const [failed, setFailed] = useState(false)
  const useNative = src && !failed

  return (
    <div style={{
      width: '100%', maxWidth: 860, margin: '0 auto', borderRadius: 16, overflow: 'hidden',
      background: '#000', boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${accent}55`,
    }}>
      <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
        {useNative ? (
          <video
            src={src}
            poster={poster}
            controls
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#000' }}
          />
        ) : (
          <iframe
            src={`https://drive.google.com/file/d/${driveId}/preview`}
            title="video"
            allow="autoplay; fullscreen"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        )}
      </div>
    </div>
  )
}
