import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, X, ArrowLeft, ChevronRight, Tag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Product, ProductCategory } from '@/lib/supabase'
import { useStore, type CollectionFilter } from '@/store/useStore'
import { Navbar } from '@/layouts/Navbar'
import { Footer } from '@/layouts/Footer'
import { CartDrawer } from '@/components/CartDrawer'
import { AtmosphericBackground } from '@/components/AtmosphericBackground'

// ─── Label helpers ────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  bolsa: 'Bolsa',
  carteira: 'Carteira',
  chapeu: 'Chapéu',
  acessorio: 'Acessório',
}

const FILTERS: { key: CollectionFilter; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'bolsa', label: 'Bolsas' },
  { key: 'carteira', label: 'Carteiras' },
  { key: 'chapeu', label: 'Chapéus' },
  { key: 'acessorio', label: 'Acessórios' },
]

// ─── Product Detail Drawer ────────────────────────────────────────────────────

function ProductDrawer({ product, onClose }: { product: Product; onClose: () => void }) {
  const addToCart = useStore((s) => s.addToCart)
  const toggleCart = useStore((s) => s.toggleCart)

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.is_promoted && product.promotional_price
        ? product.promotional_price
        : product.price,
      image: product.image_url ?? undefined,
    })
    onClose()
    setTimeout(() => toggleCart(true), 300)
  }

  // Fecha com ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <motion.div
        className="relative w-full max-w-[480px] h-full bg-couro-black border-l border-couro-gold/10 flex flex-col shadow-2xl overflow-y-auto"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ ease: [0.76, 0, 0.24, 1] as const, duration: 0.45 }}
        data-lenis-prevent
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-couro-gold/10 flex-shrink-0">
          <span className="text-[10px] uppercase tracking-[0.4em] text-couro-gold/60 font-mono">
            {CATEGORY_LABELS[product.category]}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-transparent hover:border-couro-gold/20 hover:bg-couro-gold/10 text-couro-ivory/50 hover:text-couro-gold transition-all cursor-pointer"
            aria-label="Fechar detalhes"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Imagem */}
        {product.image_url && (
          <div className="relative w-full aspect-[4/3] flex-shrink-0 overflow-hidden bg-couro-black/50">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-couro-black/60 via-transparent to-transparent" />
          </div>
        )}

        {/* Conteúdo */}
        <div className="flex flex-col flex-1 px-6 py-6 gap-4">
          {/* Nome e badge */}
          <div>
            {product.is_promoted && (
              <span className="inline-flex items-center gap-1 bg-couro-gold/15 border border-couro-gold/30 text-couro-gold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-mono font-medium mb-3">
                <Tag className="w-2.5 h-2.5" />
                Promoção
              </span>
            )}
            <h2 className="font-serif text-2xl md:text-3xl text-couro-ivory font-bold leading-tight">
              {product.name}
            </h2>
          </div>

          {/* Preço */}
          <div>
            {product.is_promoted && product.promotional_price ? (
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl text-couro-gold font-bold">
                  R$ {product.promotional_price.toFixed(2)}
                </span>
                <span className="text-sm text-couro-ivory/35 line-through font-mono">
                  R$ {product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="font-serif text-3xl text-couro-gold font-bold">
                R$ {product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-couro-gold/10" />

          {/* Descrição */}
          {product.description && (
            <p className="text-sm text-couro-ivory/60 font-light leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* CTA */}
          <button
            id={`drawer-add-to-cart-${product.id}`}
            onClick={handleAddToCart}
            data-cursor="hover"
            className="w-full flex items-center justify-center gap-2.5 bg-couro-gold hover:bg-couro-ivory text-couro-black font-semibold text-xs uppercase tracking-[0.15em] py-4 rounded-sm transition-all duration-300 cursor-none shadow-lg shadow-couro-gold/10"
          >
            <ShoppingBag className="w-4 h-4" />
            Adicionar à Sacola
          </button>

          <p className="text-[10px] text-center text-couro-ivory/25 leading-relaxed">
            Você será direcionado ao WhatsApp para finalizar o pedido.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const displayPrice = product.is_promoted && product.promotional_price
    ? product.promotional_price
    : product.price

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] as const }}
      className="group relative rounded-sm overflow-hidden border border-couro-gold/10 hover:border-couro-gold/30 bg-couro-brown/5 cursor-pointer transition-colors duration-300"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick() }}
      aria-label={`Ver detalhes de ${product.name}`}
    >
      {/* Imagem */}
      <div className="relative aspect-[3/4] overflow-hidden bg-couro-black/30">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-couro-brown/10">
            <ShoppingBag className="w-8 h-8 text-couro-ivory/15" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-couro-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="text-[9px] uppercase tracking-widest text-couro-gold/80 font-mono bg-couro-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
            {CATEGORY_LABELS[product.category]}
          </span>
          {product.is_promoted && (
            <span className="text-[9px] uppercase tracking-widest text-couro-black font-mono bg-couro-gold px-2 py-0.5 rounded font-bold">
              Promoção
            </span>
          )}
        </div>

        {/* "Ver detalhes" hint */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-couro-ivory/70 font-mono bg-couro-black/70 px-2 py-1 rounded backdrop-blur-sm">
            Ver detalhes <ChevronRight className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-serif text-base text-couro-ivory font-semibold leading-tight mb-1 truncate">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-lg text-couro-gold font-bold">
            R$ {displayPrice.toFixed(2)}
          </span>
          {product.is_promoted && product.promotional_price && (
            <span className="text-xs text-couro-ivory/30 line-through font-mono">
              R$ {product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

function FilterBar() {
  const activeFilter = useStore((s) => s.activeFilter)
  const setActiveFilter = useStore((s) => s.setActiveFilter)

  return (
    <div
      className="sticky top-[72px] z-40 bg-couro-black/90 backdrop-blur-md border-b border-couro-gold/8 px-4 md:px-12 lg:px-24"
      role="navigation"
      aria-label="Filtros da coleção"
    >
      <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none">
        {FILTERS.map(({ key, label }) => {
          const isActive = activeFilter === key
          return (
            <button
              key={key}
              id={`filter-${key}`}
              onClick={() => setActiveFilter(key)}
              className={`relative flex-shrink-0 px-5 py-2 rounded-full text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 cursor-pointer border ${
                isActive
                  ? 'border-couro-gold text-couro-black bg-couro-gold'
                  : 'border-couro-gold/25 text-couro-ivory/50 hover:border-couro-gold/60 hover:text-couro-ivory bg-transparent'
              }`}
              aria-pressed={isActive}
            >
              {label}
              {/* Underline animado com layoutId */}
              {isActive && (
                <motion.span
                  layoutId="filter-pill-bg"
                  className="absolute inset-0 rounded-full bg-couro-gold -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Collection Grid ──────────────────────────────────────────────────────────

function ProductGrid({ filtered, onProductClick }: { filtered: Product[], onProductClick: (p: Product) => void }) {
  const isLoading = filtered.length === 0 && useStore((s) => s.products.length === 0)

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm border border-couro-gold/8 bg-couro-brown/5 animate-pulse"
          >
            <div className="aspect-[3/4] bg-couro-ivory/5" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-couro-ivory/5 rounded w-3/4" />
              <div className="h-3 bg-couro-ivory/5 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-16 h-16 rounded-full border border-dashed border-couro-gold/25 flex items-center justify-center">
          <ShoppingBag className="w-6 h-6 text-couro-gold/25" />
        </div>
        <p className="font-serif text-lg text-couro-ivory/30 italic">
          Nenhum produto nesta categoria.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
    >
      <AnimatePresence mode="popLayout">
        {filtered.map((product, i) => (
          <motion.div
            key={product.id}
            layout
            custom={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4, ease: [0.76, 0, 0.24, 1] as const } }}
          >
            <ProductCard product={product} onClick={() => onProductClick(product)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Collection Page ──────────────────────────────────────────────────────────

export function CollectionPage() {
  const navigate = useNavigate()
  const setProducts = useStore((s) => s.setProducts)
  const setTransitioning = useStore((s) => s.setTransitioning)
  const activeFilter = useStore((s) => s.activeFilter)
  const setActiveFilter = useStore((s) => s.setActiveFilter)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [fetchError, setFetchError] = useState(false)
  const hasFetched = useRef(false)

  // Reset filtro ao entrar na página
  useEffect(() => {
    setActiveFilter('todos')
  }, [setActiveFilter])

  // Fetch único — usa cache do Zustand se já tiver produtos
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[CollectionPage] Erro ao buscar produtos:', error)
        setFetchError(true)
      } else {
        setProducts((data as Product[]) ?? [])
      }
    }

    fetchProducts()
  }, [setProducts])

  // Fecha a transição de entrada quando a página montar
  useEffect(() => {
    setTransitioning(false)
  }, [setTransitioning])

  const handleBack = () => {
    setTransitioning(true)
    setTimeout(() => {
      navigate('/')
      setTimeout(() => setTransitioning(false), 500)
    }, 850)
  }

  const products = useStore((s) => s.products)
  const filteredProducts = activeFilter === 'todos' 
    ? products 
    : products.filter((p) => p.category === activeFilter)
  const productsCount = filteredProducts.length

  return (
    <div className="min-h-screen bg-couro-black text-couro-ivory font-sans selection:bg-couro-gold/30 selection:text-couro-gold">
      {/* Grain */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Luzes atmosféricas */}
      <AtmosphericBackground />

      {/* Navbar */}
      <Navbar />

      <main className="relative">
        {/* ── Hero Minimalista ── */}
        <section
          className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-16 min-h-[40vh] overflow-hidden"
          aria-label="Coleção"
        >
          {/* Glow sutil */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-couro-gold/5 rounded-full blur-[120px]" />
          </div>

          {/* Botão voltar */}
          <motion.button
            onClick={handleBack}
            data-cursor="hover"
            className="absolute top-28 left-6 md:left-12 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-couro-ivory/40 hover:text-couro-gold transition-colors cursor-none group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Voltar
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] as const }}
            className="relative z-10"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-couro-gold/60 font-mono block mb-5">
              Couro Rico · Catálogo
            </span>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-couro-ivory leading-[0.9] mb-6">
              A{' '}
              <em className="font-light italic text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #C8A96B 0%, #E8C87A 50%, #C8A96B 100%)' }}
              >
                Coleção
              </em>
            </h1>
            <p className="text-sm text-couro-ivory/45 font-light max-w-md mx-auto leading-relaxed">
              Cada peça é criada à mão com couro genuíno de alta procedência. Uma curadoria de elegância atemporal para quem reconhece a diferença.
            </p>
          </motion.div>
        </section>

        {/* ── Filtros ── */}
        <FilterBar />

        {/* ── Grid ── */}
        <section className="px-4 md:px-12 lg:px-24 py-12 pb-24">
          {/* Contador */}
          <motion.p
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.35em] text-couro-ivory/30 font-mono mb-8"
          >
            {productsCount} {productsCount === 1 ? 'peça' : 'peças'} encontradas
          </motion.p>

          {fetchError ? (
            <div className="text-center py-24">
              <p className="font-serif text-lg text-couro-ivory/30 italic">
                Não foi possível carregar o catálogo.
              </p>
              <p className="text-xs text-couro-ivory/20 mt-2">
                Verifique sua conexão e tente novamente.
              </p>
            </div>
          ) : (
            <ProductGrid filtered={filteredProducts} onProductClick={setSelectedProduct} />
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Product Detail Drawer */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDrawer
            key={selectedProduct.id}
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
