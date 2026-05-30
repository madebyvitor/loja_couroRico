import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useStore } from '@/store/useStore'

/**
 * PageTransition
 * Overlay cinematográfico que cobre a tela durante a navegação entre rotas.
 * Controlado por `isTransitioning` no Zustand.
 *
 * Fluxo:
 *  1. Componente da Home seta isTransitioning = true
 *  2. Esta tela faz fade-in sobre tudo (z-[9998])
 *  3. Após 800ms, dispara a navegação (feito externamente com setTimeout)
 *  4. A nova página monta; após carregar, isTransitioning = false
 *  5. Esta tela faz fade-out
 */
export function PageTransition() {
  const isTransitioning = useStore((s) => s.isTransitioning)

  // Garante que o body não role durante a transição
  useEffect(() => {
    if (isTransitioning) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isTransitioning])

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="page-transition"
          className="fixed inset-0 z-[9998] bg-couro-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {/* Logo pulsante — idêntico à LoadingScreen */}
          <div className="overflow-hidden flex flex-col items-center px-6">
            <motion.div
              animate={{
                opacity: [0, 1, 1, 1],
                scale: [0.95, 1.0, 1.03, 1.0],
              }}
              transition={{
                duration: 0.9,
                ease: 'easeInOut',
                times: [0, 0.3, 0.7, 1],
              }}
              className="flex flex-col items-center"
            >
              <div className="w-10 h-px bg-couro-gold/50 mx-auto mb-5" />
              <span
                className="font-serif uppercase text-couro-ivory text-3xl sm:text-4xl font-normal select-none text-center"
                style={{ letterSpacing: '0.28em' }}
              >
                COURO RICO
              </span>
              <p className="text-center mt-4 text-[10px] tracking-[0.5em] uppercase text-couro-gold/60 font-mono">
                Artesanato de Luxo
              </p>
              <div className="w-10 h-px bg-couro-gold/50 mx-auto mt-5" />
            </motion.div>
          </div>

          {/* Barra de progresso sutil */}
          <motion.div
            className="absolute bottom-0 left-0 h-[1px] bg-couro-gold/30"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
