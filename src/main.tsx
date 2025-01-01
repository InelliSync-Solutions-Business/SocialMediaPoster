import { StrictMode } from 'react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Global, css } from '@emotion/react'
import App from './App.tsx'
import './index.css'

// Set initial theme
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
const initialTheme = darkModeMediaQuery.matches
document.documentElement.classList.toggle('dark', initialTheme)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
  </StrictMode>,
)
