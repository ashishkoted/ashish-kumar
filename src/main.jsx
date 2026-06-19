import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'

import './index.css'
import { SoundProvider } from "./context/SoundContext"
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SoundProvider>
      <App />
      <Analytics />
    </SoundProvider>
  </StrictMode>
)