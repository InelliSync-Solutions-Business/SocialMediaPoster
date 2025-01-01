import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // More aggressive code splitting
          if (id.includes('node_modules')) {
            // Split large libraries into separate chunks
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('openai')) {
              return 'openai-vendor';
            }
            if (id.includes('@emotion') || id.includes('clsx')) {
              return 'styling-vendor';
            }
            return 'vendor';
          }
          // Group components
          if (id.includes('src/components')) {
            return 'components';
          }
          // Group pages/routes
          if (id.includes('src/pages') || id.includes('src/routes')) {
            return 'routes';
          }
        }
      }
    },
    chunkSizeWarningLimit: 2000, // Increase limit to 2MB
    sourcemap: false, // Disable sourcemaps for production
    minify: 'esbuild', // Use esbuild for faster minification
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'openai', 
      '@emotion/react', 
      'clsx'
    ]
  }
})
