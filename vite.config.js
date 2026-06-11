import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // The static-assets folder is `PUBLIC` (uppercase). Vite defaults to `public`,
  // which only matches on case-insensitive filesystems (macOS). Set it explicitly
  // so production builds on Linux (Vercel) copy /scene/* into dist correctly.
  publicDir: 'PUBLIC',
})
