import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // Las reglas específicas van primero
      "/api/reservas": {
        target: "http://localhost:8083",
        changeOrigin: true,
      },
      // La regla general va después
      "/api": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
    },
  },
})