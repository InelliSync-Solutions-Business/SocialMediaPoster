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
          // Split node_modules into separate chunks
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          // You can add more specific chunk splitting here
          if (id.includes('src/components')) {
            return 'components';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
    sourcemap: false, // Disable sourcemaps for production
    minify: 'esbuild', // Use esbuild instead of terser
  },
  // Add code splitting for large dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'openai'],
  }
})
