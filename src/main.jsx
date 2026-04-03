import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { applyThemeForMode, getInitialThemeMode } from './lib/theme.js'

applyThemeForMode(getInitialThemeMode())

import './index.css'
import { Root } from './app/Root.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
