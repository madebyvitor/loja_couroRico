import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const rafRef = useRef<number>(0)
  const rawPos = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawPos.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)
    }

    const onLeave = () => setIsVisible(false)
    const onEnter = () => setIsVisible(true)

    // Detect interactive elements for hover state
    const onMouseOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      const interactive = el.closest('button, a, [data-cursor="hover"], input, label, select')
      setIsHovering(!!interactive)
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
  }, [isVisible])

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full border border-couro-gold/60 mix-blend-difference"
        animate={{
          x: pos.x - (isHovering ? 20 : 14),
          y: pos.y - (isHovering ? 20 : 14),
          width: isHovering ? 40 : 28,
          height: isHovering ? 40 : 28,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: 'tween', duration: 0, ease: 'linear' }}
        style={{ translateX: 0, translateY: 0 }}
      />

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10001] rounded-full bg-couro-gold"
        animate={{
          x: rawPos.current.x - 3,
          y: rawPos.current.y - 3,
          width: isHovering ? 6 : 6,
          height: isHovering ? 6 : 6,
          opacity: isVisible ? 0.9 : 0,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: 'tween', duration: 0, ease: 'linear' }}
        style={{ translateX: 0, translateY: 0 }}
      />
    </>
  )
}
