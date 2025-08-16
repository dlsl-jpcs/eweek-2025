import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: isProduction 
            ? 'https://jpcs-booth-game-backend.onrender.com' 
            : 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
    base: '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom']
          }
        }
      }
    },
    // This ensures the static server serves index.html for all routes in production
    preview: {
      port: 3000,
      strictPort: true,
      historyApiFallback: true
    },
    define: {
      'process.env': {}
    }
  }
})