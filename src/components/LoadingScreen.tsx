import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface LoadingScreenProps {
  onComplete: () => void
}

/**
 * LoadingScreen — Premium 3-act entrance:
 * Ato 1 (Pulse):   Logo faz fade-in com pulsação em escala suave
 * Ato 2 (Reveal):  Logo sobe e some (clip-path via translateY + overflow-hidden)
 * Ato 3 (Exit):    O fundo preto desfaz lentamente, revelando a interface
 */
export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<'pulse' | 'reveal' | 'exit'>('pulse')

  useEffect(() => {
    // Fase pulse dura 2.0s antes de disparar o reveal
    const revealTimer = setTimeout(() => {
      setPhase('reveal')
    }, 2000)

    // Fase exit dispara 0.6s após o reveal (tempo suficiente pro logo sumir)
    const exitTimer = setTimeout(() => {
      setPhase('exit')
    }, 2600)

    return () => {
      clearTimeout(revealTimer)
      clearTimeout(exitTimer)
    }
  }, [])

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {phase !== 'exit' && (
        <motion.div
          key="loading-bg"
          className="fixed inset-0 z-[9999] bg-couro-black flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 1.2, ease: 'easeInOut' },
          }}
        >
          {/* Logo container com overflow-hidden para o reveal slide-up */}
          <div className="overflow-hidden flex flex-col items-center w-full px-6">
            <motion.div
              key="loading-logo"
              animate={
                phase === 'pulse'
                  ? {
                      opacity: [0, 1, 1, 1, 1],
                      scale: [0.95, 1.0, 1.03, 1.0, 1.02],
                    }
                  : {
                      // Fase reveal: logo sobe para fora do container
                      y: '-120%',
                      opacity: 0,
                    }
              }
              transition={
                phase === 'pulse'
                  ? {
                      duration: 2.0,
                      ease: 'easeInOut',
                      times: [0, 0.3, 0.6, 0.8, 1],
                      repeat: 0,
                    }
                  : {
                      duration: 0.55,
                      ease: [0.76, 0, 0.24, 1], // custom cubic-bezier suave
                    }
              }
              style={{ y: 0, opacity: 0 }}
            >
              {/* Linha decorativa acima */}
              <motion.div
                className="w-12 h-px bg-couro-gold/50 mx-auto mb-5"
                animate={phase === 'pulse' ? { opacity: [0, 1] } : {}}
                transition={{ duration: 1.0, delay: 0.5 }}
              />

              {/* Marca tipográfica */}
              <h1
                className="font-serif uppercase text-couro-ivory text-3xl sm:text-4xl md:text-5xl font-normal select-none text-center"
                style={{ letterSpacing: '0.28em' }}
              >
                COURO RICO
              </h1>

              {/* Subtítulo editorial */}
              <motion.p
                className="text-center mt-4 text-[10px] tracking-[0.5em] uppercase text-couro-gold/60 font-mono"
                animate={phase === 'pulse' ? { opacity: [0, 1] } : {}}
                transition={{ duration: 1.0, delay: 0.8 }}
              >
                 Elegância que atravessa o tempo.
              </motion.p>

              {/* Linha decorativa abaixo */}
              <motion.div
                className="w-12 h-px bg-couro-gold/50 mx-auto mt-5"
                animate={phase === 'pulse' ? { opacity: [0, 1] } : {}}
                transition={{ duration: 1.0, delay: 0.5 }}
              />
            </motion.div>
          </div>

          {/* Progress bar sutil na base */}
          <motion.div
            className="absolute bottom-0 left-0 h-[1px] bg-couro-gold/30"
            initial={{ width: '0%' }}
            animate={{ width: phase === 'pulse' ? '100%' : '100%' }}
            transition={{ duration: 2.0, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
