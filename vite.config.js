import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the app from /<repository-name>/, while local dev uses /.
  base: process.env.VITE_BASE_PATH || '/',
})
