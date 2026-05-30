import { useRef } from 'react'
import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// ─── Variantes ──────────────────────────────────────────────────────────────

/** Container de linha: orquestra o stagger entre os spans filhos */
const lineContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.028,
      delayChildren: 0.1,
    },
  },
}

/** Cada caractere sobe de y:100 com easing editorial de agência de alto padrão */
const charVariant: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      ease: [0.76, 0, 0.24, 1],
      duration: 1.15,
    },
  },
}

/** Fade-in suave para overline, preço e elementos secundários */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: [0.76, 0, 0.24, 1], duration: 0.9 },
  },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Divide uma string em array de chars (preservando espaços como entidade) */
function splitChars(text: string) {
  return text.split('').map((char, i) => (
    <span
      key={i}
      style={{ display: 'inline-block', overflow: 'hidden', lineHeight: 1 }}
    >
      <motion.span
        variants={charVariant}
        style={{ display: 'inline-block' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  ))
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface HeroSectionProps {
  /** Quando false, a animação de reveal dispara */
  isLoading: boolean
}

// ─── Component ───────────────────────────────────────────────────────────────

export function HeroSection({ isLoading }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  // Parallax: Hero afunda a 30% da velocidade do scroll → Vitrine sobe por cima
  useGSAP(
    () => {
      gsap.to(sectionRef.current, {
        yPercent: 28,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { scope: sectionRef }
  )

  const isVisible = !isLoading

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="min-h-[100vh] flex flex-col justify-end px-6 md:px-12 lg:px-24 pt-20 pb-24 relative overflow-hidden z-0"
    >
      {/* ── Background image with subtle organic float animation ── */}
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat will-change-transform origin-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2500&auto=format&fit=crop")',
        }}
        animate={{
          scale: [1.05, 1.1, 1.05],
          rotate: [-1, 1, -1]
        }}
        transition={{
          duration: 30,
          ease: "easeInOut",
          repeat: Infinity
        }}
      >
        {/* Gradient: escurece o fundo e prepara o overlap suave com a vitrine */}
        <div className="absolute inset-0 bg-gradient-to-t from-couro-black via-couro-black/50 to-couro-black/15" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-couro-black to-transparent" />
      </motion.div>

      {/* ── Luxury rotating gold seal/badge overlaying the hero ── */}
      <motion.div
        className="absolute top-1/4 right-8 md:right-24 z-10 hidden sm:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <motion.div
          className="pointer-events-auto cursor-pointer"
          animate={{ rotate: 360 }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          whileHover={{ scale: 1.08 }}
        >
          <svg
            viewBox="0 0 120 120"
            className="w-28 h-28 md:w-36 md:h-36 text-couro-gold/80 hover:text-couro-gold transition-colors duration-300"
          >
            {/* Outer elegant rings */}
            <circle cx="60" cy="60" r="54" className="stroke-couro-gold/30 stroke-[0.75] fill-none" />
            <circle cx="60" cy="60" r="50" className="stroke-couro-gold/15 stroke-[0.5] fill-none" />
            
            {/* Circular Text Path */}
            <path
              id="badgeTextPath"
              d="M 60,60 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
              fill="none"
            />
            <text className="text-[7.2px] uppercase tracking-[0.18em] fill-couro-gold font-mono font-medium">
              <textPath href="#badgeTextPath" startOffset="0%">
                COURO RICO * INGÁ-PB * COURO RICO * INGÁ-PB * 
              </textPath>
            </text>
            
            {/* Inner Ring with dark backdrop blur */}
            <circle cx="60" cy="60" r="26" className="stroke-couro-gold/25 stroke-[0.75] fill-couro-black/60" />
            
            {/* Central Minimalist Luxury Sparkle Star */}
            <path
              d="M 60,47 Q 60,60 47,60 Q 60,60 60,73 Q 60,60 73,60 Q 60,60 60,47 Z"
              className="fill-couro-gold"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* ── Radial studio light ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[25%] w-[600px] h-[600px] bg-couro-gold/5 rounded-full blur-[120px]" />
      </div>

      {/* ── Conteúdo editorial ── */}
      <div className="max-w-5xl z-10 relative">

        {/* Overline — fade simples */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          transition={{ delay: 0.15 }}
          className="text-xs uppercase tracking-[0.45em] text-couro-gold/75 font-light mb-7 font-mono"
        >
          Ingá-PB · Desde 2024
        </motion.p>

        {/* ── Headline massiva — stagger por caractere ── */}
        <motion.h1
          aria-label="A Arte do Couro"
          className="font-serif leading-[0.88] font-bold tracking-tight mb-10 select-none"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 8.5rem)' }}
        >
          {/* Linha 1 */}
          <motion.span
            className="block overflow-hidden"
            variants={lineContainer}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
          >
            <span className="text-couro-ivory">
              {splitChars('A Arte')}
            </span>
          </motion.span>

          {/* Linha 2 — gradiente dourado */}
          <motion.span
            className="block overflow-hidden"
            variants={lineContainer}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            transition={{ delayChildren: 0.08 }}
          >
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #C8A96B 0%, #E8C87A 50%, #C8A96B 100%)',
              }}
            >
              {splitChars('do Couro')}
            </span>
          </motion.span>

          {/* Linha 3 */}
          <motion.span
            className="block overflow-hidden"
            variants={lineContainer}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            transition={{ delayChildren: 0.16 }}
          >
            <span className="text-couro-ivory/85">
              {splitChars('de Luxo.')}
            </span>
          </motion.span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          transition={{ delay: 0.9 }}
          className="text-base md:text-lg text-couro-ivory/55 font-light max-w-md leading-relaxed"
        >
          Peças que transcendem o tempo. Cada ponto,
          cada detalhe — uma declaração de elegância inabalável.
        </motion.p>
      </div>

      {/* ── Scroll indicator — único CTA da Hero ── */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.6, duration: 0.9 }}
      >
        <span className="text-[9px] uppercase tracking-[0.35em] font-mono text-couro-ivory/30">
          Rolar
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-couro-gold/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}
