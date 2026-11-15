import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// base './' permite publicar en cualquier subcarpeta (GitHub Pages, Netlify...)
export default defineConfig({ base: './', plugins: [vue()], test: { environment: 'node' } })
