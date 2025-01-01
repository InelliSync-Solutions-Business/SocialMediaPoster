import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: [
          '@emotion',
          [
            '@emotion/babel-plugin-jsx-pragmatic',
            {
              export: 'jsx',
              import: '__cssprop',
              module: '@emotion/react'
            }
          ]
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; img-src 'self' https://randomuser.me data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    },
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
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'emotion-vendor': ['@emotion/react', '@emotion/styled'],
          'openai-vendor': ['openai'],
          'ui-vendor': ['clsx', '@radix-ui/react-slot', '@radix-ui/react-switch', '@radix-ui/react-tabs']
        }
      }
    },
    // Netlify-specific configuration
    publicDir: 'dist',
  },
  // Add Netlify redirects
  define: {
    'process.env.NETLIFY': JSON.stringify(process.env.NETLIFY || false)
  }
})
