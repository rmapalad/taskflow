import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/transactions': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/bills': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/wants': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
