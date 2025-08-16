import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: '_redirects',
            dest: './'
          }
        ]
      })
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
      // Copy _redirects to the root of the dist directory
      copyPublicDir: true,
      // Ensure _redirects is included in the build
      assetsInclude: ['**/*.txt', '**/*.html', '**/_redirects']
    },
    define: {
      'process.env': {}
    }
  }
})