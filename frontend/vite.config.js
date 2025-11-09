import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // THIS IS THE SAFE WAY — NO CRASH
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(import.meta.env.VITE_API_URL || '')
  }
})
