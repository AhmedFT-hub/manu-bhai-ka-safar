# Manu Bhai Ka Safar

An interactive, scroll-driven story experience: a young guide, Chotu, walks you
through seven milestones of a village — the entrance, the old peepal tree, the
notice board, the aanganwadi, the new school, the memory wall, and the
celebration chowk. Click any landmark to dive into it and explore its story.

Built with **React + Vite** and **Three.js (React-Three-Fiber)**.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

## Structure

- `src/App.jsx` — scroll → eased progress, the DOM story layer (hero, speech
  bubble, click-to-enter hint), and the content overlays.
- `src/scene/Scene.jsx` — the Three.js world: the seven full scenes you travel
  through (cross-fading), the animated walking/celebrating guide, particles,
  and the click-to-dive-in interaction.
- `src/scene/{assets,store,chapters}.js` — asset URLs, shared scroll state, and
  per-milestone content.
- `src/components/overlays/*` — the content panel for each milestone.
- `PUBLIC/scene/*` — web-ready, alpha-keyed artwork (backgrounds, character
  walk/celebration sprite sheets).

Artwork is prepared from source files with `prep_assets.py` (keys out painted
backgrounds, slices sprite sheets, downscales for web).
