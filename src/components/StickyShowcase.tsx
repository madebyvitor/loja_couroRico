import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShoppingBag } from 'lucide-react'
import { useStore } from '../store/useStore'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/supabase'

gsap.registerPlugin(ScrollTrigger)

// ─── Cor de acento por categoria ─────────────────────────────────────────────────────────────

function accentByCategory(cat: string): string {
  const map: Record<string, string> = {
    carteira: '#C8A96B',
    bolsa: '#B8956B',
    chapeu: '#9A7A52',
    acessorio: '#D4B896',
  }
  return map[cat.toLowerCase()] ?? '#C8A96B'
}

// ─── Hook: busca produtos em destaque ─────────────────────────────────────────────────────────

function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .limit(3)
      .then(({ data }) => {
        setProducts(data ?? [])
        setLoading(false)
      })
  }, [])

  return { products, loading }
}

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

// ─── Layout MOBILE: cards verticais ─────────────────────────────────────────────────────────────

function MobileShowcase() {
  const { addToCart } = useStore()
  const { products, loading } = useFeaturedProducts()

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

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-couro-gold/10 bg-couro-brown/5 animate-pulse">
                <div className="h-64 bg-couro-ivory/5" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-couro-ivory/10 rounded w-1/2" />
                  <div className="h-3 bg-couro-ivory/5 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <p className="font-serif text-lg text-couro-ivory/30 italic">Nenhum produto em destaque.</p>
            <p className="text-xs text-couro-ivory/20 mt-1">Configure no painel admin.</p>
          </div>
        )}

        {/* Cards verticais */}
        {!loading && products.length > 0 && (
          <div className="flex flex-col gap-8">
            {products.map((product, index) => {
              const accent = accentByCategory(product.category ?? '')
              return (
                <div
                  key={product.id}
                  className="rounded-lg overflow-hidden border border-couro-gold/15 bg-couro-brown/10"
                >
                  {/* Imagem do produto — altura fixa e visível */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={product.image_url ?? ''}
                      alt={product.name}
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
                    <h2 className="font-serif text-2xl text-couro-ivory font-bold leading-tight mb-4">
                      {product.name}
                    </h2>
                    <p className="text-sm text-couro-ivory/55 font-light leading-relaxed mb-5">
                      {product.description}
                    </p>

                    {/* Atributos */}
                    {product.details && product.details.length > 0 && (
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-6">
                        {product.details.map((d) => (
                          <li key={d} className="flex items-center gap-2 text-xs text-couro-ivory/45">
                            <span
                              className="w-1 h-1 rounded-full flex-shrink-0"
                              style={{ backgroundColor: accent }}
                            />
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Preço + botão */}
                    <div className="flex items-center justify-between pt-4 border-t border-couro-gold/10">
                      <div>
                        <span className="text-[10px] text-couro-ivory/30 uppercase tracking-widest block">
                          Preço
                        </span>
                        <span className="font-serif text-2xl text-couro-gold font-bold">
                          R$ {(product.promotional_price ?? product.price).toFixed(2)}
                        </span>
                      </div>
                      <button
                        id={`add-to-cart-mobile-${product.id}`}
                        onClick={() =>
                          addToCart({ id: product.id, name: product.name, price: product.promotional_price ?? product.price })
                        }
                        className="flex items-center gap-2 bg-couro-gold text-couro-black font-semibold text-xs uppercase tracking-[0.12em] px-5 py-3.5 rounded-sm active:scale-95 transition-all"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Layout DESKTOP: horizontal scroll Apple-style ────────────────────────────

function DesktopCard({
  product,
  index,
}: {
  product: Product
  index: number
}) {
  const { addToCart } = useStore()
  const accent = accentByCategory(product.category ?? '')

  return (
    <div
      id={`product-card-${index}`}
      className="desktop-card-animate relative flex-shrink-0 w-[400px] h-[640px] rounded-lg overflow-hidden border border-couro-gold/15 bg-couro-brown/10 flex flex-col mx-6"
    >
      {/* Imagem */}
      <div className="relative h-[280px] flex-shrink-0 overflow-hidden bg-couro-black/40">
        <img
          src={product.image_url ?? ''}
          alt={product.name}
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
        <h2 className="font-serif text-3xl text-couro-ivory font-bold leading-tight mb-5">
          {product.name}
        </h2>
        
        <p className="text-sm text-couro-ivory/55 font-light leading-relaxed mb-6 line-clamp-3">
          {product.description}
        </p>

        {/* Atributos */}
        {product.details && product.details.length > 0 && (
          <ul className="grid grid-cols-2 gap-x-2 gap-y-2 mb-6 mt-auto">
            {product.details.map((d) => (
              <li key={d} className="flex items-center gap-1.5 text-xs text-couro-ivory/45">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: accent }}
                />
                <span className="truncate">{d}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Preço + CTA */}
        <div className="flex items-center justify-between pt-5 border-t border-couro-gold/10 mt-auto">
          <div>
            <span className="text-[10px] text-couro-ivory/30 uppercase tracking-widest block mb-0.5">
              Preço
            </span>
            <span className="font-serif text-2xl text-couro-gold font-bold">
              R$ {(product.promotional_price ?? product.price).toFixed(2)}
            </span>
          </div>

          <button
            id={`add-to-cart-${product.id}`}
            data-cursor="hover"
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.promotional_price ?? product.price,
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
  const { products, loading } = useFeaturedProducts()

  useGSAP(
    () => {
      const track = trackRef.current
      const section = sectionRef.current
      if (!track || !section || loading || products.length === 0) return

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
    { scope: sectionRef, dependencies: [loading, products.length] }
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
          
          {loading ? (
            // Skeleton loading
            [0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[400px] h-[640px] rounded-lg border border-couro-gold/10 bg-couro-ivory/5 mx-6 animate-pulse"
              />
            ))
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center w-[600px] text-center">
              <div>
                <p className="font-serif text-xl text-couro-ivory/30 italic">Nenhum produto em destaque.</p>
                <p className="text-xs text-couro-ivory/20 mt-2">Configure no painel admin.</p>
              </div>
            </div>
          ) : (
            products.map((product, index) => (
              <DesktopCard key={product.id} product={product} index={index} />
            ))
          )}
        </div>

        {/* Progress bars */}
        {!loading && products.length > 0 && (
          <ProgressBars total={products.length} sectionRef={sectionRef} />
        )}
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
