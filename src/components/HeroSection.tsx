import { useRef, useState, useEffect } from 'react'
import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/supabase'

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

// ─── Fallback image ───────────────────────────────────────────────────────────
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2500&auto=format&fit=crop'

// ─── Component ───────────────────────────────────────────────────────────────

export function HeroSection({ isLoading }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [heroProduct, setHeroProduct] = useState<Product | null>(null)

  // Busca o produto Hero no Supabase
  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('is_hero', true)
      .maybeSingle()
      .then(({ data }) => {
        setHeroProduct(data)
      })
  }, [])

  // Parallax: Hero image afunda suavemente
  useGSAP(
    () => {
      gsap.to(sectionRef.current, {
        yPercent: 15,
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
      className="min-h-[100svh] w-full relative flex flex-col md:flex-row overflow-hidden z-0 bg-couro-black"
    >
      {/* ── Background image (Full mobile, Right 50% desktop) ── */}
      <motion.div
        className="absolute inset-0 md:left-1/2 md:w-1/2 z-0 bg-cover bg-center bg-no-repeat will-change-transform origin-center"
        style={{
          backgroundImage: `url("${heroProduct?.image_url ?? FALLBACK_IMAGE}")`,
        }}
        animate={{ scale: [1.05, 1.1, 1.05], rotate: [-1, 1, -1] }}
        transition={{ duration: 30, ease: "easeInOut", repeat: Infinity }}
      >
        {/* Gradients para blending com o fundo preto */}
        <div className="absolute inset-0 bg-gradient-to-t from-couro-black via-couro-black/60 to-couro-black/20 md:hidden" />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-couro-black via-couro-black/20 to-transparent" />
      </motion.div>

      {/* ── Radial studio light (Focado na esquerda) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-couro-gold/5 rounded-full blur-[140px]" />
      </div>

      {/* ── Luxury rotating gold seal/badge (Cortado na borda direita no desktop) ── */}
      <motion.div
        className="absolute top-1/2 right-0 translate-x-[40%] -translate-y-1/2 z-10 hidden md:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <motion.div
          className="pointer-events-auto cursor-pointer"
          animate={{ rotate: 360 }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
        >
          <svg
            viewBox="0 0 120 120"
            className="w-40 h-40 text-couro-gold/60 hover:text-couro-gold transition-colors duration-300"
          >
            {/* Outer rings */}
            <circle cx="60" cy="60" r="54" className="stroke-couro-gold/30 stroke-[0.75] fill-none" />
            <circle cx="60" cy="60" r="50" className="stroke-couro-gold/15 stroke-[0.5] fill-none" />
            
            {/* Circular Text Path */}
            <path
              id="badgeTextPath"
              d="M 60,60 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
              fill="none"
            />
            <text className="text-[7px] uppercase tracking-[0.2em] fill-couro-gold font-mono font-medium">
              <textPath href="#badgeTextPath" startOffset="0%">
                COURO RICO · INGÁ-PB · COURO RICO · INGÁ-PB · 
              </textPath>
            </text>
            
            {/* Inner Ring */}
            <circle cx="60" cy="60" r="26" className="stroke-couro-gold/25 stroke-[0.75] fill-couro-black/60 backdrop-blur-sm" />
            
            {/* Star */}
            <path
              d="M 60,47 Q 60,60 47,60 Q 60,60 60,73 Q 60,60 73,60 Q 60,60 60,47 Z"
              className="fill-couro-gold"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* ── Conteúdo da Esquerda (Texto) ── */}
      <div className="flex-1 w-full md:w-1/2 flex flex-col justify-end md:justify-center px-6 md:px-12 lg:px-24 pb-20 md:pb-0 relative z-10 min-h-[100svh]">
        
        {/* Overline — top left no desktop, cima do titulo no mobile */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          transition={{ delay: 0.15 }}
          className="md:absolute md:top-24 md:left-12 lg:left-24 text-[9px] uppercase tracking-[0.3em] text-couro-gold/50 font-medium mb-8 md:mb-0 font-mono"
        >
          Ingá · PB · Desde 2024
        </motion.p>

        {/* ── Headline massiva ── */}
        <motion.h1
          aria-label="A Arte do Couro de Luxo"
          className="font-serif leading-[1.05] font-bold tracking-tight mb-8 select-none"
          style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}
        >
          {/* Linha 1 */}
          <motion.span
            className="block overflow-hidden italic font-light"
            variants={lineContainer}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
          >
            <span className="text-couro-ivory">
              {splitChars('A Arte')}
            </span>
          </motion.span>

          {/* Linha 2 — dourado */}
          <motion.span
            className="block overflow-hidden"
            variants={lineContainer}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            transition={{ delayChildren: 0.08 }}
          >
            <span className="text-couro-gold">
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
            <span className="text-couro-ivory/90">
              {splitChars('de Luxo.')}
            </span>
          </motion.span>
        </motion.h1>

        {/* Separator line */}
        <motion.div
           variants={fadeUp}
           initial="hidden"
           animate={isVisible ? 'visible' : 'hidden'}
           transition={{ delay: 0.8 }}
           className="w-10 h-[1px] bg-couro-gold/40 mb-6"
        />

        {/* Subtítulo */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          transition={{ delay: 0.9 }}
          className="text-sm text-couro-ivory/60 font-light max-w-sm leading-relaxed mb-10"
        >
          Peças que transcendem o tempo. Cada detalhe — uma declaração de elegância inabalável.
        </motion.p>

        {/* Botão Explorar */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          transition={{ delay: 1.0 }}
        >
          <a
            href="#vitrine"
            className="inline-flex border border-couro-gold/30 hover:border-couro-gold bg-transparent hover:bg-couro-gold/5 text-couro-gold transition-all text-[10px] uppercase tracking-[0.25em] px-10 py-4 rounded-sm font-medium"
          >
            Explorar Coleção
          </a>
        </motion.div>
      </div>

      {/* ── Scroll indicator vertical (Bottom Left no Desktop) ── */}
      <motion.div
        className="absolute bottom-12 left-6 md:left-12 lg:left-24 z-10 hidden md:flex flex-col items-center gap-4 origin-bottom-left"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.4, duration: 0.9 }}
      >
        <span
          className="text-[9px] uppercase tracking-[0.4em] font-mono text-couro-gold/60"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Scroll
        </span>
        <motion.div
          className="w-[1px] bg-gradient-to-b from-couro-gold/50 to-transparent"
          animate={{ height: [0, 48, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
      
      {/* Mobile scroll down (Chevron) */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 md:hidden flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.4, duration: 0.9 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-couro-gold/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}
