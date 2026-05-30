import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShoppingBag } from 'lucide-react'
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
      'Couro legítimo. Acabamento ultra refinado.',
    details: ['Couro Brasileiro', '5 Compartimentos'],
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

function DesktopCard({
  product,
  index,
}: {
  product: (typeof products)[0]
  index: number
}) {
  const { addToCart } = useStore()

  return (
    <div
      id={`product-card-${index}`}
      className="desktop-card-animate relative flex-shrink-0 w-[400px] h-[640px] rounded-lg overflow-hidden border border-couro-gold/15 bg-couro-brown/10 flex flex-col mx-6"
    >
      {/* Imagem */}
      <div className="relative h-[280px] flex-shrink-0 overflow-hidden bg-couro-black/40">
        <img
          src={product.image}
          alt={`${product.name} ${product.subtitle}`}
          className="w-full h-full object-cover object-center block"
          loading={index === 0 ? 'eager' : 'lazy'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-couro-black/90 via-transparent to-transparent pointer-events-none" />
        
        {/* SKU */}
        <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-couro-gold font-mono font-semibold bg-couro-black/50 px-2 py-1 rounded backdrop-blur-sm border border-couro-gold/10">
          {product.category}
        </span>
        
        {/* Numeração */}
        <span className="absolute bottom-4 right-4 font-mono text-xs text-couro-ivory/50">
          0{index + 1}
        </span>
      </div>

      {/* Conteúdo */}
      <div className="p-6 flex flex-col flex-1">
        <h2 className="font-serif text-3xl text-couro-ivory font-bold leading-tight mb-1">
          {product.name}
        </h2>
        <h3 className="font-serif text-xl text-couro-gold/80 italic leading-tight mb-5">
          {product.subtitle}
        </h3>
        
        <p className="text-sm text-couro-ivory/55 font-light leading-relaxed mb-6 line-clamp-3">
          {product.description}
        </p>

        {/* Atributos */}
        <ul className="grid grid-cols-2 gap-x-2 gap-y-2 mb-6 mt-auto">
          {product.details.map((d) => (
            <li key={d} className="flex items-center gap-1.5 text-xs text-couro-ivory/45">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: product.accent }}
              />
              <span className="truncate">{d}</span>
            </li>
          ))}
        </ul>

        {/* Preço + CTA */}
        <div className="flex items-center justify-between pt-5 border-t border-couro-gold/10">
          <div>
            <span className="text-[10px] text-couro-ivory/30 uppercase tracking-widest block mb-0.5">
              Preço
            </span>
            <span className="font-serif text-2xl text-couro-gold font-bold">
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
            className="group flex items-center gap-2 bg-couro-gold hover:bg-couro-ivory text-couro-black font-semibold text-xs uppercase tracking-[0.1em] px-5 py-3 rounded-sm transition-all duration-300 cursor-none"
          >
            <ShoppingBag className="w-4 h-4" />
            Adicionar
          </button>
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

      // Animação de rolagem horizontal principal
      const updateScroll = () => {
        const scrollWidth = track.scrollWidth - window.innerWidth + (window.innerWidth * 0.1) // Extra padding at the end
        
        const horizontalScroll = gsap.to(track, {
          x: -scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1.2,
            start: 'top top',
            end: () => `+=${scrollWidth}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
        return horizontalScroll
      }
      
      const anim = updateScroll()

      // Animação de entrada dos cards independentes da rolagem horizontal
      gsap.fromTo(
        '.desktop-card-animate',
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      return () => {
        if (anim) anim.kill()
      }
    },
    { scope: sectionRef, dependencies: [] }
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
        className="relative z-10 bg-couro-black overflow-hidden flex flex-col justify-center"
        style={{ height: '100vh' }}
        aria-label="Vitrine de produtos"
      >
        {/* Máscara de gradiente para suavizar a entrada/saída dos cards sob o texto */}
        <div className="absolute inset-y-0 left-0 w-[350px] xl:w-[500px] z-10 bg-gradient-to-r from-couro-black via-couro-black/95 to-transparent pointer-events-none" />

        {/* Cabeçalho Fixo (Alinhado à esquerda e centralizado verticalmente) */}
        <div className="absolute top-1/2 -translate-y-1/2 left-16 xl:left-24 z-20 pointer-events-none w-[250px] xl:w-[320px]">
          <span className="text-[10px] uppercase tracking-[0.4em] text-couro-gold/70 font-mono">
            Coleção
          </span>
          <h2 className="font-serif text-4xl xl:text-5xl text-couro-ivory font-bold mt-3 leading-tight drop-shadow-md">
            Peças em Destaque
          </h2>
          <p className="mt-5 text-sm text-couro-ivory/50 font-light leading-relaxed">
            Uma seleção exclusiva das nossas criações mais refinadas.
          </p>
        </div>

        {/* Label flutuante de scroll */}
        <div className="absolute bottom-12 right-16 xl:right-24 z-20 flex items-center gap-3 pointer-events-none hidden md:flex">
          <div className="w-12 h-px bg-couro-gold/20" />
          <span className="text-[9px] uppercase tracking-[0.4em] text-couro-gold/40 font-mono">
            Scroll →
          </span>
        </div>

        {/* Track horizontal */}
        <div
          ref={trackRef}
          className="flex h-full will-change-transform items-center pr-16 xl:pr-24 relative z-0"
          style={{ width: 'max-content' }}
        >
          {/* Espaçador para o primeiro card começar depois do título */}
          <div className="flex-shrink-0 w-[350px] xl:w-[500px]" aria-hidden="true" />
          
          {products.map((product, index) => (
            <DesktopCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Progress bars (centralizadas mas levemente deslocadas para direita para equilibrar com o título) */}
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
