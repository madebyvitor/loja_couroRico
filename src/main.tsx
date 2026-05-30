import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import App from '@/App.tsx'
import { SmoothScroll } from '@/layouts/SmoothScroll'
import { CustomCursor } from '@/components/CustomCursor'
import { PageTransition } from '@/components/PageTransition'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SmoothScroll>
      <CustomCursor />
      <PageTransition />
      <App />
    </SmoothScroll>
  </StrictMode>,
)
