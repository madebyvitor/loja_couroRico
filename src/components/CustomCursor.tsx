import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface MagnetTarget {
  cx: number // center x do elemento hovered
  cy: number // center y do elemento hovered
  w: number  // largura (para calcular tamanho do cursor magnético)
  h: number  // altura
}

// ─── CustomCursor ─────────────────────────────────────────────────────────────

export function CustomCursor() {
  // Desativa em touch devices
  const [isTouchDevice] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches
  })

  // Desativa se o usuário prefere redução de movimento
  const [prefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  const [pos, setPos] = useState({ x: -200, y: -200 })
  const [isVisible, setIsVisible] = useState(false)
  const [magnet, setMagnet] = useState<MagnetTarget | null>(null)

  const rafRef = useRef<number>(0)
  const rawPos = useRef({ x: -200, y: -200 })

  useEffect(() => {
    // Não instala nenhum listener se não for necessário
    if (isTouchDevice || prefersReduced) return

    const onMove = (e: MouseEvent) => {
      rawPos.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)
    }

    const onLeave = () => setIsVisible(false)
    const onEnter = () => setIsVisible(true)

    // ── Efeito Magnético ──────────────────────────────────────────────────────
    const onMouseOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      const target = el.closest<HTMLElement>(
        'button, a, [data-cursor="hover"], input, label, select'
      )

      if (target) {
        const rect = target.getBoundingClientRect()
        setMagnet({
          cx: rect.left + rect.width / 2,
          cy: rect.top + rect.height / 2,
          w: rect.width,
          h: rect.height,
        })
      } else {
        setMagnet(null)
      }
    }

    // Smooth follow via RAF
    const loop = () => {
      setPos(prev => ({
        x: prev.x + (rawPos.current.x - prev.x) * 0.18,
        y: prev.y + (rawPos.current.y - prev.y) * 0.18,
      }))
      rafRef.current = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onMouseOver)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onMouseOver)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isTouchDevice, prefersReduced, isVisible])

  // Nada a renderizar para touch/reduced-motion
  if (isTouchDevice || prefersReduced) return null

  // ── Cálculos do anel magnético ────────────────────────────────────────────
  // Quando magnético: o anel se expande para cobrir o elemento inteiro
  const magnetSize = magnet
    ? Math.max(magnet.w, magnet.h) + 16 // padding de 8px em cada lado
    : 28

  const ringX = magnet ? magnet.cx - magnetSize / 2 : pos.x - 14
  const ringY = magnet ? magnet.cy - magnetSize / 2 : pos.y - 14

  return (
    <>
      {/* ── Anel externo — magnético ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full border border-couro-gold mix-blend-difference"
        animate={{
          x: ringX,
          y: ringY,
          width: magnetSize,
          height: magnetSize,
          opacity: isVisible ? (magnet ? 0.5 : 1) : 0,
          scale: magnet ? 1.05 : 1,
        }}
        transition={{
          x: { type: 'tween', duration: magnet ? 0.18 : 0, ease: 'linear' },
          y: { type: 'tween', duration: magnet ? 0.18 : 0, ease: 'linear' },
          width: { type: 'spring', stiffness: 220, damping: 22 },
          height: { type: 'spring', stiffness: 220, damping: 22 },
          opacity: { duration: 0.2 },
          scale: { type: 'spring', stiffness: 300, damping: 20 },
        }}
        style={{ translateX: 0, translateY: 0 }}
      />

      {/* ── Ponto interno — some ao magnetizar ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10001] rounded-full bg-couro-gold"
        animate={{
          x: rawPos.current.x - 3,
          y: rawPos.current.y - 3,
          width: 6,
          height: 6,
          opacity: isVisible && !magnet ? 0.9 : 0,
          scale: magnet ? 0 : 1,
        }}
        transition={{ type: 'tween', duration: 0, ease: 'linear' }}
        style={{ translateX: 0, translateY: 0 }}
      />
    </>
  )
}
