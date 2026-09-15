import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion', 'lucide-react']
        }
      }
    }
  },
  esbuild: {
    legalComments: 'none',
    drop: ['debugger']
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true
  }
})

