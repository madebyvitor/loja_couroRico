import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'

/**
 * ScrollRestoration
 * Reseta o scroll para o topo sempre que a rota mudar.
 * Usa o Lenis quando disponível; cai no window.scrollTo como fallback.
 * Deve ser montado dentro do BrowserRouter.
 */
export function ScrollRestoration() {
  const { pathname } = useLocation()
  const lenis = useLenis()

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname, lenis])

  return null
}
