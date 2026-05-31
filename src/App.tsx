import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'

// Layouts
import { Navbar } from '@/layouts/Navbar'
import { Footer } from '@/layouts/Footer'
import { ScrollRestoration } from '@/layouts/ScrollRestoration'

// Components
import { LoadingScreen } from './components/LoadingScreen'
import { AtmosphericBackground } from './components/AtmosphericBackground'
import { HeroSection } from './components/HeroSection'
import { StickyShowcase } from './components/StickyShowcase'
import { CraftsmanshipSection } from './components/CraftsmanshipSection'
import { CartDrawer } from './components/CartDrawer'
import { MobileMenu } from './components/MobileMenu'

// Store
import { useStore } from '@/store/useStore'

// Admin — code-split
const ProtectedRoute = lazy(() =>
  import('./components/admin/ProtectedRoute').then(m => ({ default: m.ProtectedRoute }))
)

// Collection — code-split
const CollectionPage = lazy(() =>
  import('./pages/CollectionPage').then(m => ({ default: m.CollectionPage }))
)

// ─── CTA Section ──────────────────────────────────────────────────────────────

function CollectionCTA() {
  const navigate = useNavigate()
  const setTransitioning = useStore((s) => s.setTransitioning)

  const handleExplore = () => {
    setTransitioning(true)
    // Aguarda o fade-in da transição antes de navegar
    setTimeout(() => {
      navigate('/colecao')
      // Mantém a tela por mais um momento, depois remove
      setTimeout(() => setTransitioning(false), 500)
    }, 850)
  }

  return (
    <section
      className="relative z-10 min-h-[50vh] flex flex-col items-center justify-center px-6 bg-couro-black overflow-hidden"
      aria-label="Explorar coleção completa"
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-couro-gold/4 rounded-full blur-[100px]" />
      </div>

      {/* Linha decorativa */}
      <div className="w-px h-16 bg-gradient-to-b from-transparent to-couro-gold/30 mb-12" />

      {/* Conteúdo */}
      <div className="relative z-10 text-center max-w-lg">
        <span className="text-[10px] uppercase tracking-[0.5em] text-couro-gold/60 font-mono block mb-5">
          Catálogo Completo
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-couro-ivory font-bold leading-tight mb-6">
          Cada peça conta<br />
          <em className="font-light text-couro-gold/80">uma história.</em>
        </h2>
        <p className="text-sm text-couro-ivory/45 font-light leading-relaxed mb-10 max-w-sm mx-auto">
          Explore nossa coleção completa de artigos em couro — carteiras, bolsas, chapéus e acessórios de alto padrão.
        </p>

        <button
          id="cta-explore-collection"
          onClick={handleExplore}
          data-cursor="hover"
          className="group relative inline-flex items-center gap-3 border border-couro-gold/40 hover:border-couro-gold text-couro-gold hover:bg-couro-gold hover:text-couro-black text-xs uppercase tracking-[0.25em] px-10 py-4 rounded-sm transition-all duration-500 font-medium cursor-none overflow-hidden"
        >
          <span className="relative z-10">Explorar Coleção Completa</span>
          {/* Shimmer hover */}
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-couro-gold/10 to-transparent -translate-x-full"
            whileHover={{ translateX: '200%' }}
            transition={{ duration: 0.6 }}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Linha decorativa base */}
      <div className="w-px h-16 bg-gradient-to-b from-couro-gold/30 to-transparent mt-12" />
    </section>
  )
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  // Bloqueia o scroll enquanto a loading screen estiver visível
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isLoading])

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen
            key="loading"
            onComplete={() => setIsLoading(false)}
          />
        )}
      </AnimatePresence>

      {/* Shell principal da aplicação */}
      <div
        className="min-h-screen bg-couro-black text-couro-ivory relative font-sans selection:bg-couro-gold/30 selection:text-couro-gold"
        aria-hidden={isLoading}
      >
        {/* Grain overlay */}
        <div className="grain-overlay" aria-hidden="true" />

        {/* Luzes atmosféricas */}
        <AtmosphericBackground />

        {/* Navigation */}
        <Navbar />

        {/* Main content */}
        <main className="relative">

          {/* ── Hero ── */}
          <HeroSection isLoading={isLoading} />

          {/* ── Vitrine interativa ── */}
          <StickyShowcase />

          {/* ── CTA Coleção Completa ── */}
          <CollectionCTA />

          {/* ── Seção de artesanato ── */}
          <section className="relative z-10 bg-couro-black">
            <CraftsmanshipSection />
          </section>

          {/* ── Editorial quote ── */}
          <section
            className="relative z-10 py-32 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-couro-black via-couro-brown/20 to-couro-black"
          >
            <div className="max-w-4xl mx-auto text-center">
              <span className="font-serif italic text-2xl md:text-3xl text-couro-gold/80 block mb-6">
                "Qualidade, estilo e autenticidade em cada escolha."
              </span>
              <div className="w-16 h-px bg-couro-gold/30 mx-auto mb-8" />
              <h4 className="font-serif tracking-widest text-sm uppercase text-couro-ivory font-semibold mb-2">
                COURO RICO
              </h4>
              <p className="text-xs text-couro-ivory/40 uppercase tracking-widest font-mono">
                Ingá, Paraíba — Desde 2024
              </p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />

        {/* Cart Drawer */}
        <CartDrawer />

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    </>
  )
}

// ─── Admin Fallback ────────────────────────────────────────────────────────────

function PageFallback() {
  return (
    <div className="min-h-screen bg-couro-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-couro-gold/30 border-t-couro-gold animate-spin" />
        <p className="text-couro-ivory/40 text-xs uppercase tracking-widest font-mono">
          Carregando...
        </p>
      </div>
    </div>
  )
}

// ─── App Root ─────────────────────────────────────────────────────────────────

function App() {
  return (
    <BrowserRouter>
      <ScrollRestoration />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/colecao"
          element={
            <Suspense fallback={<PageFallback />}>
              <CollectionPage />
            </Suspense>
          }
        />
        <Route
          path="/admin-panel"
          element={
            <Suspense fallback={<PageFallback />}>
              <ProtectedRoute />
            </Suspense>
          }
        />
        {/* Fallback */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
