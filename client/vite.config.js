import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
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
      historyApiFallback: true,
    },
    base: '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom']
          }
        }
      }
    },
    define: {
      'process.env': {}
    },
    // For development environment
    preview: {
      historyApiFallback: true,
    }
  }
})