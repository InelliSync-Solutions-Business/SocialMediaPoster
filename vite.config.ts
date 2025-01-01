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
    minify: 'terser', // Use terser for more efficient minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
      },
      mangle: true, // Mangle variable names to reduce bundle size
    }
  },
  // Add code splitting for large dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'openai'],
  }
})
