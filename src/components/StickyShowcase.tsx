import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'

gsap.registerPlugin(ScrollTrigger)

// ─── Dados dos produtos ───────────────────────────────────────────────────────

const products = [
  {
    id: 'carteira-classic',
    name: 'Carteira',
    subtitle: '"Classic"',
    price: 450.0,
    category: 'Acessórios · SKU 001',
    description:
      'Couro legítimo PBR curtido vegetalmente. Costura manual dupla com linha encerada italiana. Acabamento ultra refinado em borda polida à mão.',
    details: ['Couro Vegetal Brasileiro', 'Costura Manual Dupla', 'Forro em Suede', '5 Compartimentos'],
    image:
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1600&auto=format&fit=crop',
    accent: '#C8A96B',
  },
  {
    id: 'bolsa-elegance',
    name: 'Bolsa',
    subtitle: '"Elegance"',
    price: 1200.0,
    category: 'Bolsas · SKU 002',
    description:
      'Design de alta costura inspirado nas maisons parisienses. Hardware metálico dourado 18k. Alça ajustável em couro full-grain com textura natural.',
    details: ['Couro Full-Grain', 'Hardware 18k', 'Alça Dupla', 'Bolso Interno Organizador'],
    image:
      'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1600&auto=format&fit=crop',
    accent: '#B8956B',
  },
  {
    id: 'chapeu-horizon',
    name: 'Chapéu',
    subtitle: '"Horizon"',
    price: 600.0,
    category: 'Chapéus · SKU 003',
    description:
      'Camurça premium de origem controlada. Banda decorativa em couro fosco moldado artesanalmente. Formato fedora atemporal com aba larga.',
    details: ['Camurça Premium', 'Banda em Couro Fosco', 'Moldado à Mão', 'Aba 6cm'],
    image:
      'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=1600&auto=format&fit=crop',
    accent: '#9A7A52',
  },
]

// ─── Hook: detecta se é mobile (< 768px) ─────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    setIsMobile(mq.matches)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

// ─── Layout MOBILE: cards verticais ──────────────────────────────────────────

function MobileShowcase() {
  const { addToCart } = useStore()

  return (
    <section id="vitrine" className="relative z-10 bg-couro-black" aria-label="Vitrine de produtos">
      {/* Gradiente de transição no topo */}
      <div
        className="h-24 -mt-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0B0B0B)' }}
        aria-hidden="true"
      />

      <div className="px-5 pb-16">
        {/* Header da seção */}
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase tracking-[0.4em] text-couro-gold/70 font-mono">
            Coleção
          </span>
          <h2 className="font-serif text-3xl text-couro-ivory font-bold mt-2">
            Peças em Destaque
          </h2>
        </div>

        {/* Cards verticais */}
        <div className="flex flex-col gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="rounded-lg overflow-hidden border border-couro-gold/15 bg-couro-brown/10"
            >
              {/* Imagem do produto — altura fixa e visível */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={`${product.name} ${product.subtitle}`}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-couro-black/80 via-transparent to-transparent" />
                {/* SKU badge */}
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-couro-gold font-mono font-semibold">
                  {product.category}
                </span>
                {/* Numeração */}
                <span className="absolute bottom-4 right-4 font-mono text-xs text-couro-ivory/30">
                  0{index + 1}
                </span>
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                <h2 className="font-serif text-2xl text-couro-ivory font-bold leading-tight mb-1">
                  {product.name}
                </h2>
                <h3 className="font-serif text-lg text-couro-gold/80 italic leading-tight mb-4">
                  {product.subtitle}
                </h3>
                <p className="text-sm text-couro-ivory/55 font-light leading-relaxed mb-5">
                  {product.description}
                </p>

                {/* Atributos */}
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-6">
                  {product.details.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-xs text-couro-ivory/45">
                      <span
                        className="w-1 h-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: product.accent }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>

                {/* Preço + botão */}
                <div className="flex items-center justify-between pt-4 border-t border-couro-gold/10">
                  <div>
                    <span className="text-[10px] text-couro-ivory/30 uppercase tracking-widest block">
                      Preço
                    </span>
                    <span className="font-serif text-2xl text-couro-gold font-bold">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                  <button
                    id={`add-to-cart-mobile-${product.id}`}
                    onClick={() =>
                      addToCart({ id: product.id, name: `${product.name} ${product.subtitle}`, price: product.price })
                    }
                    className="flex items-center gap-2 bg-couro-gold text-couro-black font-semibold text-xs uppercase tracking-[0.12em] px-5 py-3.5 rounded-sm active:scale-95 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Layout DESKTOP: horizontal scroll Apple-style ────────────────────────────

/**
 * Cada painel usa layout split:
 *  - Esquerda (45%): conteúdo editorial (texto, preço, CTA)
 *  - Direita (55%): imagem do produto com object-cover moderado
 * Isso evita que a imagem ocupe 100vw e pareça enorme.
 */
function DesktopPanel({
  product,
  index,
}: {
  product: (typeof products)[0]
  index: number
}) {
  const { addToCart } = useStore()
  const panelRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const details = detailsRef.current
      if (!details) return

      gsap.fromTo(
        details.querySelectorAll('.panel-animate'),
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: panelRef.current,
            start: 'left 65%',
            containerAnimation: window.__horizontalScroll,
            toggleActions: 'play none none reverse',
          },
        }
      )
    },
    { scope: panelRef, dependencies: [] }
  )

  return (
    <div
      ref={panelRef}
      id={`product-panel-${index}`}
      className="relative flex-shrink-0 flex items-stretch overflow-hidden"
      style={{ width: '100vw', height: '100vh' }}
    >
      {/* ── Fundo escuro base ── */}
      <div className="absolute inset-0 bg-couro-black" />

      {/* ── Layout split: conteúdo esquerda | imagem direita ── */}
      <div className="relative z-10 flex w-full h-full">

        {/* Lado esquerdo — conteúdo editorial (45%) */}
        <div
          ref={detailsRef}
          className="flex flex-col justify-center px-16 xl:px-24 py-16 flex-shrink-0"
          style={{ width: '45%' }}
        >
          {/* SKU */}
          <p className="panel-animate text-[10px] uppercase tracking-[0.5em] text-couro-gold/65 font-mono mb-6">
            {product.category}
          </p>

          {/* Nome */}
          <h2
            className="panel-animate font-serif text-couro-ivory leading-[0.88] font-bold mb-1"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 5.5rem)' }}
          >
            {product.name}
          </h2>
          <h3
            className="panel-animate font-serif text-couro-gold/80 italic leading-[0.95] mb-8"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3.8rem)' }}
          >
            {product.subtitle}
          </h3>

          {/* Divisor */}
          <div
            className="panel-animate w-10 h-px mb-8"
            style={{ backgroundColor: product.accent + '60' }}
          />

          {/* Descrição */}
          <p className="panel-animate text-sm text-couro-ivory/55 font-light leading-relaxed max-w-xs mb-8">
            {product.description}
          </p>

          {/* Atributos */}
          <ul className="panel-animate grid grid-cols-2 gap-x-6 gap-y-2.5 mb-10">
            {product.details.map((d) => (
              <li key={d} className="flex items-center gap-2 text-xs text-couro-ivory/45">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: product.accent }}
                />
                {d}
              </li>
            ))}
          </ul>

          {/* Preço + CTA */}
          <div className="panel-animate flex items-center gap-6">
            <div>
              <span className="text-[10px] text-couro-ivory/25 uppercase tracking-widest block mb-0.5">
                Preço
              </span>
              <span className="font-serif text-3xl xl:text-4xl text-couro-gold font-bold">
                R$ {product.price.toFixed(2)}
              </span>
            </div>

            <button
              id={`add-to-cart-${product.id}`}
              data-cursor="hover"
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: `${product.name} ${product.subtitle}`,
                  price: product.price,
                })
              }
              className="group flex items-center gap-3 bg-couro-gold hover:bg-couro-ivory text-couro-black font-semibold text-xs uppercase tracking-[0.15em] px-7 py-4 rounded-sm transition-all duration-300 cursor-none"
            >
              <ShoppingBag className="w-4 h-4" />
              Adicionar
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Numeração editorial */}
          <div className="mt-auto pt-12 flex items-center gap-3 opacity-25">
            <span className="font-mono text-xs tracking-widest text-couro-ivory">
              0{index + 1}
            </span>
            <div className="w-8 h-px bg-couro-gold" />
            <span className="font-mono text-[10px] tracking-widest text-couro-ivory">
              0{products.length}
            </span>
          </div>
        </div>

        {/* Lado direito — imagem (55%) */}
        <div
          className="relative flex-shrink-0 overflow-hidden"
          style={{ width: '55%' }}
        >
          {/* Imagem com object-cover contida */}
          <img
            src={product.image}
            alt={`${product.name} ${product.subtitle}`}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          {/* Gradiente esquerda para fundir com a área de texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-couro-black via-couro-black/20 to-transparent" />
          {/* Vignette suave nas bordas */}
          <div className="absolute inset-0 bg-gradient-to-t from-couro-black/40 via-transparent to-couro-black/20" />
        </div>
      </div>
    </div>
  )
}

// ─── Desktop showcase wrapper com GSAP ───────────────────────────────────────

function DesktopShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const track = trackRef.current
      const section = sectionRef.current
      if (!track || !section) return

      const horizontalScroll = gsap.to(track, {
        xPercent: -(100 * (products.length - 1)),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1.2,
          start: 'top top',
          end: () => `+=${window.innerWidth * (products.length - 1)}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (self.animation) {
              window.__horizontalScroll = self.animation as gsap.core.Tween
            }
          },
        },
      })

      window.__horizontalScroll = horizontalScroll

      return () => {
        horizontalScroll.kill()
      }
    },
    { scope: sectionRef }
  )

  return (
    <>
      {/* Gradiente de transição no topo (parallax overlap do Hero) */}
      <div
        className="relative z-10 h-32 -mt-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0B0B0B)' }}
        aria-hidden="true"
      />

      <section
        ref={sectionRef}
        id="vitrine"
        className="relative z-10 bg-couro-black overflow-hidden"
        style={{ height: '100vh' }}
        aria-label="Vitrine de produtos"
      >
        {/* Label flutuante */}
        <div className="absolute top-8 right-12 z-20 flex items-center gap-3 pointer-events-none">
          <span className="text-[9px] uppercase tracking-[0.4em] text-couro-ivory/20 font-mono">
            Coleção
          </span>
          <div className="w-6 h-px bg-couro-gold/20" />
          <span className="text-[9px] uppercase tracking-[0.4em] text-couro-gold/40 font-mono">
            Scroll →
          </span>
        </div>

        {/* Track horizontal */}
        <div
          ref={trackRef}
          className="flex h-full will-change-transform"
          style={{ width: `${products.length * 100}vw` }}
        >
          {products.map((product, index) => (
            <DesktopPanel key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Progress bars */}
        <ProgressBars total={products.length} sectionRef={sectionRef} />
      </section>
    </>
  )
}

// ─── Progress bars ────────────────────────────────────────────────────────────

function ProgressBars({
  total,
  sectionRef,
}: {
  total: number
  sectionRef: React.RefObject<HTMLElement | null>
}) {
  const barsRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section || !barsRef.current) return

      const fills = barsRef.current.querySelectorAll('.progress-dot-fill')

      gsap.fromTo(
        fills,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          stagger: 1 / (total - 1),
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${window.innerWidth * (total - 1)}`,
            scrub: true,
          },
        }
      )
    },
    { scope: barsRef, dependencies: [total] }
  )

  return (
    <div
      ref={barsRef}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3"
      aria-label="Progresso da vitrine"
    >
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="relative w-12 h-px bg-couro-ivory/15 overflow-hidden rounded-full">
          <div
            className="progress-dot-fill absolute inset-0 bg-couro-gold origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      ))}
    </div>
  )
}

// ─── Componente exportado: escolhe layout por breakpoint ─────────────────────

export function StickyShowcase() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileShowcase /> : <DesktopShowcase />
}

// Augment Window
declare global {
  interface Window {
    __horizontalScroll: gsap.core.Tween | gsap.core.Timeline | undefined
  }
}
