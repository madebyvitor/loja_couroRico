import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useStore } from '@/store/useStore'

// ─── Navigation links ─────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Início',      href: '/' },
  { label: 'A Coleção',   href: '/colecao' },
  { label: 'Nossa História', href: '/historia' },
]

// ─── Animation variants ───────────────────────────────────────────────────────

/** Tela inteira desliza de cima para baixo */
const overlayVariants = {
  hidden: {
    y: '-100%',
    transition: { ease: [0.76, 0, 0.24, 1] as const, duration: 0.6 },
  },
  visible: {
    y: 0,
    transition: { ease: [0.76, 0, 0.24, 1] as const, duration: 0.6 },
  },
}

/** Container dos links — orquestra o stagger */
const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.35 },
  },
}

/** Cada link sobe com fade */
const linkVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: [0.76, 0, 0.24, 1] as const, duration: 0.5 },
  },
}

/** Linha decorativa animada */
const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { ease: [0.76, 0, 0.24, 1] as const, duration: 0.5, delay: 0.25 },
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MobileMenu() {
  const { isMenuOpen, closeMenu } = useStore()
  const location = useLocation()

  // Auto-close quando a rota muda
  useEffect(() => {
    closeMenu()
  }, [location.pathname, closeMenu])

  // Travar / destravar scroll do body quando o menu abre/fecha
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          key="mobile-menu"
          className="fixed inset-0 z-[100] bg-couro-black flex flex-col"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          aria-modal="true"
          role="dialog"
          aria-label="Menu de navegação"
        >
          {/* Grain overlay — textura cinematográfica */}
          <div className="grain-overlay" aria-hidden="true" />

          {/* Glow ambiental sutil */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-couro-gold/[0.03] rounded-full blur-[120px]" />
          </div>

          {/* ── Header: logo + botão fechar ── */}
          <div className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 flex-shrink-0">
            <span className="font-serif tracking-[0.3em] text-xl font-normal text-couro-ivory select-none">
              COURO RICO
            </span>

            <button
              id="mobile-menu-close-btn"
              onClick={closeMenu}
              aria-label="Fechar menu"
              data-cursor="hover"
              className="p-2 rounded-full border border-transparent hover:border-couro-gold/20 hover:bg-couro-gold/5 transition-all group cursor-pointer"
            >
              <X className="w-5 h-5 text-couro-ivory/70 group-hover:text-couro-gold transition-colors" />
            </button>
          </div>

          {/* Linha separadora animada */}
          <motion.div
            className="relative z-10 h-px bg-gradient-to-r from-transparent via-couro-gold/20 to-transparent mx-6 md:mx-12 origin-left"
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          />

          {/* ── Navegação ── */}
          <motion.nav
            className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-16"
            aria-label="Links principais"
          >
            <motion.ul
              className="space-y-2"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {NAV_LINKS.map((link) => (
                <motion.li key={link.href} variants={linkVariants}>
                  <Link
                    to={link.href}
                    onClick={closeMenu}
                    data-cursor="hover"
                    className="group flex items-baseline gap-4 py-3 overflow-hidden"
                  >
                    {/* Número decorativo */}
                    <span className="text-[10px] font-mono text-couro-gold/30 group-hover:text-couro-gold/60 transition-colors duration-300 select-none tabular-nums w-5">
                      {String(NAV_LINKS.indexOf(link) + 1).padStart(2, '0')}
                    </span>

                    {/* Label oversized */}
                    <span className="font-serif text-5xl md:text-7xl font-bold text-couro-ivory/80 group-hover:text-couro-ivory transition-colors duration-300 leading-none tracking-tight">
                      {link.label}
                    </span>

                    {/* Linha de hover que cresce */}
                    <span
                      className="block h-px bg-couro-gold/40 flex-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left self-center"
                      aria-hidden="true"
                    />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.nav>

          {/* ── Rodapé editorial ── */}
          <div className="relative z-10 px-8 md:px-16 pb-10 flex-shrink-0">
            <div className="h-px bg-gradient-to-r from-transparent via-couro-gold/15 to-transparent mb-6" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-couro-ivory/25 font-mono">
              Ingá, Paraíba — Desde 2024
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
