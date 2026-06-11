import React, { useMemo, useRef, Suspense } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { SCENES, BOY } from './assets'
import { scene as S, travelPos, arrivalInfo, clamp, lerp, smooth } from './store'

const IMG_ASPECT = 1920 / 1072

// where the "dive in" pushes toward, per scene (normalised offset from centre):
// gate / notice board / door etc. so entering frames the right thing.
const FOCALS = [
  [0.16, 0.02],  // 1 entrance → the gate (centre-right)
  [0.24, 0.0],   // 2 peepal lane → the tree (right)
  [-0.30, 0.05], // 3 outside aanganwadi → the notice board (left)
  [0.06, 0.0],   // 4 inside aanganwadi → the doorway
  [0.04, 0.0],   // 5 school → the building
  [0.0, 0.02],   // 6 memory wall → the frames
  [0.0, -0.02],  // 7 celebration → the chowk
]

function cfg(tex) {
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.generateMipmaps = true
  tex.needsUpdate = true
  return tex
}
const viewAt = (state, z) => state.viewport.getCurrentViewport(state.camera, [0, 0, z])

function radialTexture(inner = 'rgba(0,0,0,0.85)', outer = 'rgba(0,0,0,0)') {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grd.addColorStop(0, inner); grd.addColorStop(1, outer)
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128)
  const t = new THREE.Texture(c); t.needsUpdate = true; return t
}

const Z_SCENE = -8

// horizontal edge fade so adjacent scenes blend softly at the seam while sliding
let _edgeFadeX
function edgeFadeX() {
  if (_edgeFadeX) return _edgeFadeX
  const c = document.createElement('canvas'); c.width = 256; c.height = 1
  const g = c.getContext('2d')
  for (let x = 0; x < 256; x++) {
    const f = x / 255
    let a = 1
    const e = 0.07
    if (f < e) a = f / e
    else if (f > 1 - e) a = (1 - f) / e
    const v = Math.round(Math.max(0, Math.min(1, a)) * 255)
    g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(x, 0, 1, 1)
  }
  _edgeFadeX = new THREE.Texture(c); _edgeFadeX.needsUpdate = true
  return _edgeFadeX
}

// ── one full-bleed scene we travel through ───────────────────────────────────
function SceneImage({ url, index, focal }) {
  const tex = useTexture(url)
  useMemo(() => cfg(tex), [tex])
  const alpha = useMemo(() => edgeFadeX(), [])
  const mesh = useRef()
  const lastDelta = useRef(99)

  useFrame((state) => {
    const v = viewAt(state, Z_SCENE)
    const W = v.width, H = v.height
    const screenAspect = W / H
    // cover-fit the 16:9 scene to the screen (overscan a touch so the gentle
    // pan never exposes an edge)
    let cw, ch
    if (screenAspect > IMG_ASPECT) { cw = W; ch = W / IMG_ASPECT } else { ch = H; cw = H * IMG_ASPECT }
    cw *= 1.12; ch *= 1.12

    const pf = travelPos(S.progress)
    const delta = index - pf // 0 → centred; ±1 → the neighbour
    lastDelta.current = delta
    const ad = Math.abs(delta)
    const here = clamp(1 - ad, 0, 1)

    // Continuous travel: scenes cross-fade through one another with a gentle
    // forward pan + push, so it reads as one moving world, not a slideshow.
    let op = smooth(here)
    let x = delta * W * 0.55           // partial slide → scenes overlap & blend
    let y = 0
    let scale = 1 + here * 0.05 + (delta < 0 ? -delta * 0.18 : 0) // push past as you leave

    const zooming = S.zoom.active && S.zoom.index === index
    if (zooming) {
      const t = smooth(S.zoom.t)
      op = 1
      scale = (1 + here * 0.05) + t * 1.5 // dive into the scene
      x = lerp(x, -focal[0] * cw * scale, t)
      y = lerp(0, -focal[1] * ch * scale, t)
    }

    mesh.current.visible = (zooming || op > 0.004)
    if (!mesh.current.visible) return
    mesh.current.scale.set(cw * scale, ch * scale, 1)
    mesh.current.position.set(x, y, Z_SCENE)
    mesh.current.material.opacity = op
    mesh.current.renderOrder = zooming ? 50 : Math.round(here * 10) // centred scene draws on top
  })

  const onClick = (e) => {
    if (Math.abs(lastDelta.current) > 0.35 || S.zoom.active) return
    e.stopPropagation()
    S.onEnter && S.onEnter(index)
  }
  const onOver = (e) => { if (Math.abs(lastDelta.current) < 0.35) { e.stopPropagation(); S.hoverIndex = index; document.body.style.cursor = 'pointer' } }
  const onOut = () => { if (S.hoverIndex === index) { S.hoverIndex = -1; document.body.style.cursor = 'default' } }

  return (
    <mesh ref={mesh} renderOrder={index} onClick={onClick} onPointerOver={onOver} onPointerOut={onOut}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={tex} alphaMap={alpha} transparent toneMapped={false} />
    </mesh>
  )
}

// ── the boy guide: real 10-frame walk cycle while moving, poses at stops ─────
function Boy() {
  const [walk, idle, wave, talk, celebrate] = useTexture([BOY.walkStrip, BOY.idle, BOY.wave, BOY.talk, BOY.celebrateStrip])
  useMemo(() => {
    ;[idle, wave, talk].forEach(cfg)
    cfg(walk); walk.wrapS = THREE.RepeatWrapping; walk.repeat.x = 1 / BOY.walkFrames
    cfg(celebrate); celebrate.wrapS = THREE.RepeatWrapping; celebrate.repeat.x = 1 / BOY.celebrateFrames
  }, [walk, idle, wave, talk, celebrate])
  const ar = (t) => t.image.width / t.image.height
  const group = useRef(), mesh = useRef(), mat = useRef(), shadow = useRef()
  const Z = -4
  const frame = useRef(0)
  const celebFrame = useRef(0)
  const prevTp = useRef(0), worldVel = useRef(0)
  const shadowTex = useMemo(() => radialTexture(), [])

  useFrame((state, dt) => {
    const v = viewAt(state, Z)
    const info = arrivalInfo(S.progress)
    const hidden = S.zoom.active
    // Couple the legs directly to how far the world moved this frame, so the
    // walk is always perfectly in step with the ground — smooth, never skating,
    // and it naturally slows/speeds with the scene (no cadence jitter from dt).
    const dtp = info.tp - prevTp.current
    prevTp.current = info.tp
    worldVel.current = lerp(worldVel.current, Math.abs(dtp) / Math.max(dt, 1 / 120), 0.2)
    const moving = worldVel.current > 0.06

    let aspect, flip
    if (moving) {
      const FRAMES_PER_SCENE = 26 // walk-cycle frames per one scene of travel
      frame.current = (frame.current + Math.abs(dtp) * FRAMES_PER_SCENE) % BOY.walkFrames
      walk.offset.x = Math.floor(frame.current) / BOY.walkFrames
      if (mat.current.map !== walk) mat.current.map = walk
      aspect = BOY.walkAspect
      flip = 1 // sheet already faces right (direction of travel) — no mirror
    } else if (info.index === 6 && info.arrived > 0.5) {
      // final scene → looping celebration animation (gif-like), always playing
      celebFrame.current = (celebFrame.current + dt * 7) % BOY.celebrateFrames
      celebrate.offset.x = Math.floor(celebFrame.current) / BOY.celebrateFrames
      if (mat.current.map !== celebrate) mat.current.map = celebrate
      aspect = BOY.celebrateAspect
      flip = 1
    } else {
      const t = info.arrived > 0.5 ? ((info.index === 0 && info.arrived > 0.7) ? wave : talk) : idle
      if (mat.current.map !== t) mat.current.map = t
      aspect = ar(t)
      flip = 1
    }

    const hH = v.height * 0.42
    const wW = hH * aspect
    const idleBreath = moving ? 0 : Math.sin(state.clock.elapsedTime * 1.6) * hH * 0.005
    const footY = -v.height / 2 + v.height * 0.085
    group.current.position.set(-v.width * 0.26, footY + hH / 2 + idleBreath, Z)
    mesh.current.scale.set(wW * flip, hH, 1)
    mat.current.opacity = hidden ? 0 : 1

    shadow.current.scale.set(Math.abs(wW) * 0.6, hH * 0.08, 1)
    shadow.current.position.set(0, -hH / 2 + hH * 0.02, -0.01)
    shadow.current.material.opacity = hidden ? 0 : 0.3
  })

  return (
    <group ref={group}>
      <mesh ref={shadow} renderOrder={58}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#1a0e06" map={shadowTex} transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <mesh ref={mesh} renderOrder={60}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial ref={mat} map={walk} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  )
}

// ── ambient motes / evening glow / finale confetti ───────────────────────────
function Particles({ count = 80 }) {
  const pts = useRef()
  const { positions, seed, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    const colors = new Float32Array(count * 3)
    const palette = [[1, 0.85, 0.5], [1, 0.55, 0.2], [1, 0.4, 0.55], [0.5, 0.85, 0.45], [1, 0.78, 0.3]]
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26
      positions[i * 3 + 1] = (Math.random() - 0.5) * 13
      positions[i * 3 + 2] = -2 - Math.random() * 4
      seed[i] = Math.random() * 100
      const c = palette[i % palette.length]
      colors[i * 3] = c[0]; colors[i * 3 + 1] = c[1]; colors[i * 3 + 2] = c[2]
    }
    return { positions, seed, colors }
  }, [count])
  const sprite = useMemo(() => radialTexture('rgba(255,240,200,0.95)', 'rgba(255,210,140,0)'), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const arr = pts.current.geometry.attributes.position.array
    const finale = clamp((S.progress - 0.86) / 0.1, 0, 1)
    for (let i = 0; i < count; i++) {
      const s = seed[i]
      arr[i * 3] += Math.sin(t * 0.3 + s) * 0.004 + 0.003
      arr[i * 3 + 1] += Math.cos(t * 0.4 + s) * 0.004 + (finale > 0.1 ? -0.02 - (s % 5) * 0.004 : 0.001)
      if (arr[i * 3] > 14) arr[i * 3] = -14
      if (arr[i * 3 + 1] < -7) arr[i * 3 + 1] = 7
      if (arr[i * 3 + 1] > 7) arr[i * 3 + 1] = -7
    }
    pts.current.geometry.attributes.position.needsUpdate = true
    const evening = clamp((S.progress - 0.5) / 0.3, 0, 1)
    pts.current.material.opacity = (0.12 + evening * 0.2 + finale * 0.4) * (S.zoom.active ? 0 : 1)
    pts.current.material.size = 0.16 + evening * 0.1 + finale * 0.25
  })

  return (
    <points ref={pts} renderOrder={55}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial map={sprite} transparent depthWrite={false} size={0.18} sizeAttenuation
        vertexColors opacity={0.2} blending={THREE.AdditiveBlending} toneMapped={false} />
    </points>
  )
}

// ── camera: gentle translation-only parallax (no tilt) ───────────────────────
function Rig() {
  useFrame((state) => {
    const cam = state.camera
    cam.position.x = lerp(cam.position.x, S.pointerX * 0.35, 0.06)
    cam.position.y = lerp(cam.position.y, S.pointerY * 0.2, 0.06)
    cam.lookAt(cam.position.x, cam.position.y, -10)
  })
  return null
}

function World() {
  return (
    <>
      {SCENES.map((u, i) => <SceneImage key={i} url={u} index={i} focal={FOCALS[i]} />)}
      <Particles />
      <Boy />
    </>
  )
}

export default function SceneCanvas() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 12], fov: 42, near: 0.1, far: 120 }}
      >
        <color attach="background" args={['#0a0e16']} />
        <Suspense fallback={null}>
          <World />
          <Rig />
          <EffectComposer disableNormalPass>
            <Bloom intensity={0.3} luminanceThreshold={0.82} luminanceSmoothing={0.3} mipmapBlur radius={0.6} />
            <Vignette eskil={false} offset={0.25} darkness={0.5} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
