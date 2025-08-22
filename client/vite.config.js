import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync } from 'fs'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [
      react(),
      // Plugin to copy _redirects file to dist
      {
        name: 'copy-redirects',
        closeBundle() {
          try {
            copyFileSync(
              resolve(__dirname, 'public/_redirects'),
              resolve(__dirname, 'dist/_redirects')
            )
          } catch (e) {
            console.error('Error copying _redirects file:', e)
          }
        }
      }
    ],
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
      },
      // Ensure _redirects is included in the build
      copyPublicDir: true,
      // This ensures the static server serves index.html for all routes in production
      target: 'esnext',
      minify: 'esbuild'
    },
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