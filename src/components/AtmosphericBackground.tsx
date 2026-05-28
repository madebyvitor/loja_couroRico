import { motion } from 'motion/react'

/**
 * AtmosphericBackground
 * Blobs com blur extremo que flutuam lentamente em loop infinito,
 * simulando as luzes rebatidas de um estúdio fotográfico de luxo.
 * Posicionado em z-[-1], abaixo de todo conteúdo.
 */
export function AtmosphericBackground() {
  return (
    <div
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Blob 1 — couro-brown, canto superior esquerdo → flutua para o centro */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '45vw',
          height: '45vw',
          background: 'radial-gradient(circle, #2B1D16 0%, transparent 70%)',
          filter: 'blur(120px)',
          opacity: 0.18,
          top: '-10%',
          left: '-5%',
        }}
        animate={{
          x: ['0%', '12%', '4%', '0%'],
          y: ['0%', '10%', '18%', '0%'],
        }}
        transition={{
          duration: 20,
          ease: 'linear',
          repeat: Infinity,
        }}
      />

      {/* Blob 2 — couro-gold, canto inferior direito → flutua para o centro-esquerda */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '40vw',
          height: '40vw',
          background: 'radial-gradient(circle, #C8A96B 0%, transparent 70%)',
          filter: 'blur(140px)',
          opacity: 0.12,
          bottom: '-5%',
          right: '-10%',
        }}
        animate={{
          x: ['0%', '-15%', '-6%', '0%'],
          y: ['0%', '-12%', '-20%', '0%'],
        }}
        transition={{
          duration: 17,
          ease: 'linear',
          repeat: Infinity,
          delay: 3,
        }}
      />

      {/* Blob 3 — couro-caramel, centro — leve flutuação circular */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '30vw',
          height: '30vw',
          background: 'radial-gradient(circle, #9A6A42 0%, transparent 70%)',
          filter: 'blur(160px)',
          opacity: 0.08,
          top: '35%',
          left: '35%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          x: ['0%', '8%', '-6%', '0%'],
          y: ['0%', '-8%', '6%', '0%'],
        }}
        transition={{
          duration: 15,
          ease: 'linear',
          repeat: Infinity,
          delay: 7,
        }}
      />
    </div>
  )
}
