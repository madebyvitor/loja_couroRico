import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'
import type { Variants } from 'motion/react'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.18,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
}

export function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-[100vh] flex flex-col justify-end px-6 md:px-12 lg:px-24 pt-20 pb-20 relative overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2000&auto=format&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-couro-black via-couro-black/55 to-couro-black/20" />
      </div>

      {/* Radial studio light effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[30%] w-[500px] h-[500px] bg-couro-gold/6 rounded-full blur-[100px]" />
      </div>

      <motion.div
        className="max-w-4xl z-10 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Overline */}
        <motion.p
          variants={itemVariants}
          className="text-xs uppercase tracking-[0.4em] text-couro-gold/80 font-light mb-6 font-mono"
        >
          São Paulo · Artesanal · Desde 2026
        </motion.p>

        {/* Main headline — oversized typography */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl lg:text-[110px] font-serif text-couro-ivory leading-[0.9] font-bold tracking-tight mb-8"
        >
          A Essência
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-couro-gold via-couro-caramel to-couro-gold">
            do Couro
          </span>
          <br />
          <span className="text-couro-ivory/90">de Luxo.</span>
        </motion.h1>

        {/* Body text */}
        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg text-couro-ivory/60 font-light max-w-lg leading-relaxed mb-10"
        >
          Peças artesanais que transcendem o tempo. Cada ponto, cada corte — uma declaração de elegância inabalável.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
          <a
            href="#colecao"
            id="hero-cta-primary"
            data-cursor="hover"
            className="bg-couro-gold hover:bg-couro-ivory text-couro-black font-semibold uppercase tracking-[0.15em] px-9 py-4 rounded-sm transition-all duration-300 flex items-center justify-center gap-3 text-sm cursor-none"
          >
            Explorar Coleção
          </a>
          <a
            href="#tradicao"
            id="hero-cta-secondary"
            data-cursor="hover"
            className="border border-couro-ivory/20 hover:border-couro-gold/50 hover:bg-couro-gold/5 text-couro-ivory/70 hover:text-couro-ivory font-semibold uppercase tracking-[0.15em] px-9 py-4 rounded-sm transition-all flex items-center justify-center gap-2 text-sm cursor-none"
          >
            Nossa Tradição
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2 text-couro-ivory/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] font-mono rotate-90 origin-center mb-4">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}
