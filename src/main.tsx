import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CacheProvider, Global, css } from '@emotion/react'
import { cache } from './emotion'
import App from './App.tsx'
import './index.css'

// Set initial theme
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
const initialTheme = true  // Force dark mode
document.documentElement.classList.toggle('dark', initialTheme)

// Initialize Emotion cache
if (typeof window !== 'undefined') {
  cache.sheet.container = document.head
  const tags = document.querySelectorAll(`style[data-emotion]`)
  tags.forEach(tag => tag.setAttribute('data-s', ''))
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CacheProvider value={cache}>
      <BrowserRouter>
        <Global 
          styles={css`
            :root {
              color-scheme: dark;
            }
            
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            
            body {
              font-family: 'Inter', sans-serif;
              line-height: 1.6;
              background-color: hsl(var(--background));
              color: hsl(var(--foreground));
            }
            
            html.dark {
              color-scheme: dark;
            }
            
            .dark body {
              background-color: hsl(var(--background));
              color: hsl(var(--foreground));
            }
          `}
        />
        <App />
      </BrowserRouter>
    </CacheProvider>
  </StrictMode>,
)
