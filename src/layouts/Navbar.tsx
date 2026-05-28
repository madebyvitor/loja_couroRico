import { useRef, useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import { Menu, ShoppingBag } from 'lucide-react'
import { useStore } from '@/store/useStore'

/**
 * Navbar — Fase 2
 * - Centralizada: Menu | COURO RICO | Sacola
 * - Hide-on-scroll: esconde ao rolar pra baixo, revela ao rolar pra cima
 * - Glassmorphism dinâmico: transparente no topo, glass após 50px
 */
export function Navbar() {
  const { cart, toggleCart } = useStore()
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  const [hidden, setHidden] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const lastY = useRef(0)

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = lastY.current
    const diff = current - previous

    // Ativa glassmorphism após 50px
    setHasScrolled(current > 50)

    // Esconde ao rolar pra baixo (diff > 5 evita micro-movimentos)
    if (diff > 5 && current > 100) {
      setHidden(true)
    } else if (diff < -5) {
      setHidden(false)
    }

    lastY.current = current
  })

  return (
    <motion.header
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-500"
      style={{
        backgroundColor: hasScrolled
          ? 'rgba(11, 11, 11, 0.4)'
          : 'transparent',
        backdropFilter: hasScrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: hasScrolled ? 'blur(12px)' : 'none',
        borderBottom: hasScrolled
          ? '1px solid rgba(200, 169, 107, 0.10)'
          : '1px solid transparent',
      }}
    >
      <div className="flex items-center justify-between px-6 md:px-12 py-5">

        {/* Esquerda — Menu hambúrguer */}
        <button
          id="navbar-menu-btn"
          aria-label="Abrir menu"
          className="p-2 rounded-full border border-transparent hover:border-couro-gold/20 hover:bg-couro-gold/5 transition-all group cursor-pointer"
          data-cursor="hover"
        >
          <Menu className="w-5 h-5 text-couro-ivory/70 group-hover:text-couro-gold transition-colors" />
        </button>

        {/* Centro — Logo tipográfico */}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="font-serif tracking-[0.3em] text-xl font-normal text-couro-ivory hover:text-couro-gold transition-colors duration-300 select-none"
          data-cursor="hover"
          aria-label="Couro Rico — Página inicial"
        >
          COURO RICO
        </a>

        {/* Direita — Sacola com badge dinâmico */}
        <button
          id="navbar-cart-btn"
          onClick={() => toggleCart(true)}
          className="relative p-2 rounded-full border border-transparent hover:border-couro-gold/20 hover:bg-couro-gold/5 transition-all group cursor-pointer"
          aria-label={`Ver sacola de compras${cartItemCount > 0 ? ` (${cartItemCount} itens)` : ''}`}
          data-cursor="hover"
        >
          <ShoppingBag className="w-5 h-5 text-couro-ivory/70 group-hover:text-couro-gold transition-colors" />

          {/* Badge de quantidade */}
          {cartItemCount > 0 && (
            <motion.span
              key={cartItemCount}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="absolute -top-1 -right-1 bg-couro-gold text-couro-black font-semibold font-mono text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
            >
              {cartItemCount}
            </motion.span>
          )}
        </button>

      </div>
    </motion.header>
  )
}
