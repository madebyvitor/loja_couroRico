import { ReactLenis, useLenis } from 'lenis/react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useStore } from '@/store/useStore'

interface SmoothScrollProps {
  children: ReactNode
}

// Pausa o scroll quando o carrinho estiver aberto ou na rota /admin-panel
const ScrollController = () => {
  const isCartOpen = useStore((state) => state.isCartOpen)
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    // Desativa o smooth scroll no admin e quando o carrinho está aberto
    const isAdminRoute = window.location.pathname === '/admin-panel'
    if (isCartOpen || isAdminRoute) {
      lenis.stop()
    } else {
      lenis.start()
    }
  }, [isCartOpen, lenis])

  return null
}

export const SmoothScroll = ({ children }: SmoothScrollProps) => {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
      }}
    >
      <ScrollController />
      {children}
    </ReactLenis>
  )
}
