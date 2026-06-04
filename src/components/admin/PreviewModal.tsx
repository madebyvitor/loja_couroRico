import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Eye, Star, Sparkles, ShoppingBag, ChevronRight, Tag, Image } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { ProductInsert } from '@/lib/supabase'

gsap.registerPlugin(ScrollTrigger)

// ─── Tipos internos ─────────────────────────────────────────────────────────────

/** Dados do rascunho do formulário enviados para o Preview */
export interface PreviewDraft {
  name: string
  description?: string | null
  price: number
  promotional_price?: number | null
  is_promoted?: boolean
  is_hero: boolean
  is_featured: boolean
  category: ProductInsert['category']
  details?: string[]
  /** URL local (createObjectURL) ou URL do Supabase já salva */
  imageUrl: string | null
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  bolsa: 'Bolsa',
  carteira: 'Carteira',
  chapeu: 'Chapéu',
  acessorio: 'Acessório',
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2500&auto=format&fit=crop'

function accentByCategory(cat: string): string {
  const map: Record<string, string> = {
    carteira: '#C8A96B',
    bolsa: '#B8956B',
    chapeu: '#9A7A52',
    acessorio: '#D4B896',
  }
  return map[cat?.toLowerCase()] ?? '#C8A96B'
}

/**
 * Cenário A: reproduz fielmente o HeroSection do site.
 * O Hero exibe APENAS a foto de fundo — headline e demais
 * elementos são fixos e não dependem de dados do produto.
 */
function HeroPreview({ draft }: { draft: PreviewDraft }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageSrc = draft.imageUrl ?? FALLBACK_IMAGE

  // Mesmo ken-burns do HeroSection original
  useGSAP(
    () => {
      if (!sectionRef.current) return
      gsap.to(sectionRef.current.querySelector('.hero-preview-bg'), {
        yPercent: 8,
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

  return (
    <div
      ref={sectionRef}
      className="w-full h-full relative flex flex-col md:flex-row overflow-hidden bg-couro-black"
    >
      {/* Foto de fundo — ocupa 50% direito no desktop, tela toda no mobile */}
      <motion.div
        className="hero-preview-bg absolute inset-0 md:left-1/2 md:w-1/2 z-0 bg-cover bg-center bg-no-repeat will-change-transform origin-center"
        style={{ backgroundImage: `url("${imageSrc}")` }}
        animate={{ scale: [1.05, 1.1, 1.05], rotate: [-1, 1, -1] }}
        transition={{ duration: 30, ease: 'easeInOut', repeat: Infinity }}
      >
        {/* Gradientes — idênticos ao HeroSection real */}
        <div className="absolute inset-0 bg-gradient-to-t from-couro-black via-couro-black/60 to-couro-black/20 md:hidden" />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-couro-black via-couro-black/20 to-transparent" />
      </motion.div>

      {/* Radial studio light */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-couro-gold/5 rounded-full blur-[140px]" />
      </div>

      {/* Conteúdo textual fixo — idêntico ao site real */}
      <div className="flex-1 w-full md:w-1/2 flex flex-col justify-end md:justify-center px-8 md:px-16 pb-20 md:pb-0 relative z-10 h-full">
        {/* Overline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-[9px] uppercase tracking-[0.3em] text-couro-gold/50 font-mono mb-8"
        >
          Ingá · PB · Desde 2024
        </motion.p>

        {/* Headline fixa — não exibe nome do produto */}
        <motion.h1
          aria-label="A Arte do Couro de Luxo"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="font-serif font-bold leading-[1.05] tracking-tight mb-8 select-none"
          style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}
        >
          <span className="block italic font-light text-couro-ivory">A Arte</span>
          <span className="block text-couro-gold">do Couro</span>
          <span className="block text-couro-ivory/90">de Luxo.</span>
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="w-10 h-[1px] bg-couro-gold/40 mb-6 origin-left"
        />

        {/* Subtítulo fixo */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="text-sm text-couro-ivory/60 font-light max-w-sm leading-relaxed mb-10"
        >
          Peças que transcendem o tempo. Cada detalhe — uma declaração de elegança inabalável.
        </motion.p>

        {/* CTA fixo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          <span className="inline-flex border border-couro-gold/30 bg-transparent text-couro-gold text-[10px] uppercase tracking-[0.25em] px-10 py-4 rounded-sm font-medium">
            Explorar Coleção
          </span>
        </motion.div>
      </div>

      {/* Nota informativa flutuante */}
      <motion.div
        className="absolute bottom-6 right-6 z-20 hidden md:flex items-center gap-2 bg-couro-black/70 backdrop-blur-md border border-couro-gold/15 rounded px-3 py-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Image className="w-3.5 h-3.5 text-couro-gold/60 flex-shrink-0" />
        <p className="text-[9px] text-couro-ivory/40 font-mono">
          O Hero exibe apenas a foto — a headline acima é fixa no site
        </p>
      </motion.div>
    </div>
  )
}

// ─── Cenário B: Featured (StickyShowcase visual) ────────────────────────────────

function FeaturedPreview({ draft }: { draft: PreviewDraft }) {
  const accent = accentByCategory(draft.category)
  const imageSrc = draft.imageUrl ?? FALLBACK_IMAGE
  const displayPrice = draft.is_promoted && draft.promotional_price
    ? draft.promotional_price
    : draft.price

  return (
    <div className="w-full h-full overflow-y-auto" data-lenis-prevent>
      {/* Gradiente superior */}
      <div
        className="h-16 pointer-events-none sticky top-0 z-10"
        style={{ background: 'linear-gradient(to bottom, #0B0B0B, transparent)' }}
        aria-hidden="true"
      />

      <div className="px-6 pb-24 max-w-2xl mx-auto">
        {/* Header da seção */}
        <div className="text-center mb-12 mt-4">
          <span className="text-[10px] uppercase tracking-[0.4em] text-couro-gold/70 font-mono">
            Coleção · Preview
          </span>
          <h2 className="font-serif text-4xl text-couro-ivory font-bold mt-3 leading-tight">
            Peças em Destaque
          </h2>
          <p className="mt-3 text-sm text-couro-ivory/40 font-light">
            Veja como este produto aparecerá na vitrine da Home.
          </p>
        </div>

        {/* Card visual do produto em destaque */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="rounded-lg overflow-hidden border border-couro-gold/20 bg-couro-brown/10 shadow-2xl"
        >
          {/* Imagem */}
          <div className="relative h-72 md:h-96 overflow-hidden bg-couro-black/40">
            <img
              src={imageSrc}
              alt={draft.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = FALLBACK_IMAGE
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-couro-black/90 via-transparent to-transparent" />

            {/* SKU badge */}
            <span className="absolute top-5 left-5 text-[10px] uppercase tracking-widest text-couro-gold font-mono font-semibold bg-couro-black/60 px-3 py-1.5 rounded backdrop-blur-sm border border-couro-gold/20">
              {CATEGORY_LABELS[draft.category] ?? draft.category}
            </span>

            {/* Numeração */}
            <span className="absolute bottom-5 right-5 font-mono text-xs text-couro-ivory/40">
              01
            </span>

            {draft.is_promoted && (
              <span className="absolute top-5 right-5 text-[9px] uppercase tracking-widest text-couro-black font-mono bg-couro-gold px-2 py-1 rounded font-bold">
                Promoção
              </span>
            )}
          </div>

          {/* Conteúdo */}
          <div className="p-8">
            <h2 className="font-serif text-3xl text-couro-ivory font-bold leading-tight mb-4">
              {draft.name}
            </h2>

            {draft.description && (
              <p className="text-sm text-couro-ivory/55 font-light leading-relaxed mb-6">
                {draft.description}
              </p>
            )}

            {/* Detalhes */}
            {draft.details && draft.details.length > 0 && (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mb-8">
                {draft.details.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-xs text-couro-ivory/45">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: accent }}
                    />
                    {d}
                  </li>
                ))}
              </ul>
            )}

            {/* Preço + CTA */}
            <div className="flex items-center justify-between pt-5 border-t border-couro-gold/10">
              <div>
                <span className="text-[10px] text-couro-ivory/30 uppercase tracking-widest block mb-0.5">
                  Preço
                </span>
                <span className="font-serif text-2xl text-couro-gold font-bold">
                  R$ {displayPrice.toFixed(2)}
                </span>
                {draft.is_promoted && draft.promotional_price && (
                  <span className="block text-xs text-couro-ivory/30 line-through font-mono mt-0.5">
                    R$ {draft.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Botão visual (não funcional no preview) */}
              <span
                className="flex items-center gap-2 bg-couro-gold text-couro-black font-semibold text-xs uppercase tracking-[0.1em] px-5 py-3 rounded-sm"
                aria-hidden="true"
              >
                <ShoppingBag className="w-4 h-4" />
                Adicionar
              </span>
            </div>
          </div>
        </motion.div>

        {/* Indicador de cards fantasmas (simula que há mais produtos) */}
        <div className="mt-6 grid grid-cols-2 gap-4 opacity-20 pointer-events-none select-none">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-couro-gold/10 bg-couro-ivory/3 h-40 animate-pulse"
            />
          ))}
        </div>
        <p className="text-center text-[10px] text-couro-ivory/20 font-mono tracking-widest mt-4">
          + outros produtos em destaque
        </p>
      </div>
    </div>
  )
}

// ─── Cenário C: Product Card (Vitrine padrão) ───────────────────────────────────

function CollectionPreview({ draft }: { draft: PreviewDraft }) {
  const imageSrc = draft.imageUrl ?? FALLBACK_IMAGE
  const displayPrice = draft.is_promoted && draft.promotional_price
    ? draft.promotional_price
    : draft.price

  return (
    <div className="w-full h-full overflow-y-auto flex flex-col" data-lenis-prevent>
      {/* Gradiente superior */}
      <div
        className="h-16 pointer-events-none sticky top-0 z-10 flex-shrink-0"
        style={{ background: 'linear-gradient(to bottom, #0B0B0B, transparent)' }}
        aria-hidden="true"
      />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase tracking-[0.5em] text-couro-gold/60 font-mono block mb-4">
            Couro Rico · Catálogo · Preview
          </span>
          <h2 className="font-serif text-3xl text-couro-ivory font-bold">
            A{' '}
            <em
              className="font-light italic text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #C8A96B 0%, #E8C87A 50%, #C8A96B 100%)' }}
            >
              Coleção
            </em>
          </h2>
          <p className="text-xs text-couro-ivory/35 mt-3">
            Veja como este produto aparecerá na vitrine da coleção.
          </p>
        </div>

        {/* Grid simulado */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-2xl">
          {/* Card principal — o produto sendo editado */}
          <motion.article
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="group relative rounded-sm overflow-hidden border border-couro-gold/30 bg-couro-brown/10 col-span-1 ring-1 ring-couro-gold/20 shadow-lg shadow-couro-gold/10"
          >
            {/* Imagem */}
            <div className="relative aspect-[3/4] overflow-hidden bg-couro-black/30">
              <img
                src={imageSrc}
                alt={draft.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = FALLBACK_IMAGE
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-couro-black/70 via-transparent to-transparent" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <span className="text-[9px] uppercase tracking-widest text-couro-gold/80 font-mono bg-couro-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                  {CATEGORY_LABELS[draft.category] ?? draft.category}
                </span>
                {draft.is_promoted && (
                  <span className="text-[9px] uppercase tracking-widest text-couro-black font-mono bg-couro-gold px-2 py-0.5 rounded font-bold">
                    Promoção
                  </span>
                )}
              </div>

              {/* "Este produto" badge */}
              <div className="absolute bottom-3 left-3">
                <span className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-couro-gold font-mono bg-couro-black/80 px-2 py-1 rounded backdrop-blur-sm border border-couro-gold/30">
                  <Eye className="w-2.5 h-2.5" />
                  Este produto
                </span>
              </div>

              {/* "Ver detalhes" hover hint */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-couro-ivory/70 font-mono bg-couro-black/70 px-2 py-1 rounded backdrop-blur-sm">
                  Ver <ChevronRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-3 md:p-4">
              <h3 className="font-serif text-sm md:text-base text-couro-ivory font-semibold leading-tight mb-1 truncate">
                {draft.name}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-base md:text-lg text-couro-gold font-bold">
                  R$ {displayPrice.toFixed(2)}
                </span>
                {draft.is_promoted && draft.promotional_price && (
                  <span className="text-xs text-couro-ivory/30 line-through font-mono">
                    R$ {draft.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </motion.article>

          {/* Cards fantasmas (simulam os outros produtos da vitrine) */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.08 * (i + 1), duration: 0.4 }}
              className="rounded-sm border border-couro-gold/8 bg-couro-brown/5"
            >
              <div className="aspect-[3/4] bg-couro-ivory/5 animate-pulse rounded-sm" />
              <div className="p-3 md:p-4 space-y-2">
                <div className="h-3 bg-couro-ivory/8 rounded w-3/4" />
                <div className="h-2.5 bg-couro-ivory/5 rounded w-1/2" />
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-[10px] text-couro-ivory/20 font-mono tracking-widest mt-8">
          · · ·
        </p>
      </div>
    </div>
  )
}

// ─── Rótulo do cenário ────────────────────────────────────────────────────────

function ScenarioBadge({ draft }: { draft: PreviewDraft }) {
  // Hero + Featured: mostra badge duplo com nota de que o preview exibe o Hero
  if (draft.is_hero && draft.is_featured) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-amber-400 font-mono bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded">
          <Star className="w-3 h-3" />
          Hero
        </span>
        <span className="text-couro-ivory/20 text-[9px]">+</span>
        <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-violet-400 font-mono bg-violet-500/10 border border-violet-500/25 px-2.5 py-1 rounded">
          <Sparkles className="w-3 h-3" />
          Destaque
        </span>
        <span className="text-[9px] text-couro-ivory/25 font-mono hidden sm:block">· Hero exibe só a foto</span>
      </div>
    )
  }
  if (draft.is_hero) {
    return (
      <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-amber-400 font-mono bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded">
        <Star className="w-3 h-3" />
        Cenário Hero · só a foto
      </span>
    )
  }
  if (draft.is_featured) {
    return (
      <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-violet-400 font-mono bg-violet-500/10 border border-violet-500/25 px-2.5 py-1 rounded">
        <Sparkles className="w-3 h-3" />
        Cenário Destaque
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-couro-gold/60 font-mono bg-couro-gold/8 border border-couro-gold/20 px-2.5 py-1 rounded">
      <Tag className="w-3 h-3" />
      Cenário Vitrine
    </span>
  )
}

// ─── Modal Principal ─────────────────────────────────────────────────────────────

interface PreviewModalProps {
  draft: PreviewDraft
  onClose: () => void
}

export function PreviewModal({ draft, onClose }: PreviewModalProps) {
  // Fecha com ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Determina qual cenário renderizar
  const renderScenario = () => {
    // Hero tem precedência (mesmo se is_featured também estiver ativo)
    if (draft.is_hero) return <HeroPreview draft={draft} />
    if (draft.is_featured) return <FeaturedPreview draft={draft} />
    return <CollectionPreview draft={draft} />
  }

  return (
    <motion.div
      className="fixed inset-0 z-[999] bg-couro-black flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Grain overlay */}
      <div className="grain-overlay pointer-events-none" aria-hidden="true" />

      {/* ── Barra superior fixa ── */}
      <motion.div
        className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-couro-gold/10 bg-couro-black/80 backdrop-blur-md z-10"
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Lado esquerdo: label de contexto + cenário */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-couro-gold/50" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-couro-ivory/40 font-mono hidden sm:block">
              Pré-visualização
            </span>
          </div>
          <span className="text-couro-gold/20 hidden sm:block">|</span>
          <ScenarioBadge draft={draft} />
        </div>

        {/* Nome do produto */}
        <span className="font-serif text-sm text-couro-ivory/60 italic truncate max-w-[200px] hidden md:block">
          {draft.name}
        </span>

        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 border border-couro-gold/20 hover:border-couro-gold/50 text-couro-ivory/50 hover:text-couro-ivory text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded transition-all cursor-pointer group"
          aria-label="Fechar preview"
        >
          <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="hidden sm:inline">Fechar Preview</span>
        </button>
      </motion.div>

      {/* ── Conteúdo do cenário ── */}
      <motion.div
        className="flex-1 overflow-hidden relative"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={draft.is_hero ? 'hero' : draft.is_featured ? 'featured' : 'collection'}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {renderScenario()}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* ── Rodapé informativo ── */}
      <motion.div
        className="flex-shrink-0 flex items-center justify-center px-6 py-2 border-t border-couro-gold/8 bg-couro-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-[9px] text-couro-ivory/20 font-mono tracking-wider text-center">
          Preview visual · Os botões são apenas ilustrativos e não executam ações reais
        </p>
      </motion.div>
    </motion.div>
  )
}
