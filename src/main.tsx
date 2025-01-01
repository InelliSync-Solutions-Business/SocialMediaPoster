import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CacheProvider, Global, css } from '@emotion/react'
import { cache } from './emotion'
import App from './App.tsx'
import './index.css'

// Set initial theme
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
const initialTheme = darkModeMediaQuery.matches
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
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: 'Inter', sans-serif;
              line-height: 1.6;
            }
          `}
        />
        <App />
      </BrowserRouter>
    </CacheProvider>
  </StrictMode>,
)
