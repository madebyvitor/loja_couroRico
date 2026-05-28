import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import App from '@/App.tsx'
import { SmoothScroll } from '@/layouts/SmoothScroll'
import { CustomCursor } from '@/components/CustomCursor'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SmoothScroll>
      <CustomCursor />
      <App />
    </SmoothScroll>
  </StrictMode>,
)
