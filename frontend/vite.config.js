import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 'https://parent-communication-autopilot.up.railway.app';
