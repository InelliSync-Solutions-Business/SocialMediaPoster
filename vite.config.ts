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
    chunkSizeWarningLimit: 2000,
    sourcemap: false,
    minify: 'esbuild',
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      '@emotion/react', 
      '@emotion/styled',
      'clsx'
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
      }
    }
  }
})
