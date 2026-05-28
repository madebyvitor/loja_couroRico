import { useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'

// Layouts
import { Navbar } from '@/layouts/Navbar'
import { Footer } from '@/layouts/Footer'

// Components
import { LoadingScreen } from './components/LoadingScreen'
import { AtmosphericBackground } from './components/AtmosphericBackground'
import { HeroSection } from './components/HeroSection'
import { FeaturedCollection } from './components/FeaturedCollection'
import { CraftsmanshipSection } from './components/CraftsmanshipSection'
import { CartDrawer } from './components/CartDrawer'

function App() {
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
      {/* Loading Screen — montada sobre tudo via AnimatePresence */}
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
        {/* Grain overlay — textura analógica cinematográfica */}
        <div className="grain-overlay" aria-hidden="true" />

        {/* Luzes falsas atmosféricas (substitui gradients estáticos) */}
        <AtmosphericBackground />

        {/* Navigation */}
        <Navbar />

        {/* Main content */}
        <main className="relative z-10">
          <HeroSection />
          <FeaturedCollection />
          <CraftsmanshipSection />

          {/* Editorial quote */}
          <section className="py-32 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-couro-black via-couro-brown/20 to-couro-black relative">
            <div className="max-w-4xl mx-auto text-center">
              <span className="font-serif italic text-2xl md:text-3xl text-couro-gold/80 block mb-6">
                "O luxo não está na pressa de criar, mas na paciência de refinar cada pequeno milímetro."
              </span>
              <div className="w-16 h-px bg-couro-gold/30 mx-auto mb-8" />
              <h4 className="font-serif tracking-widest text-sm uppercase text-couro-ivory font-semibold mb-2">
                COURO RICO Editorial
              </h4>
              <p className="text-xs text-couro-ivory/40 uppercase tracking-widest font-mono">
                São Paulo, Brasil — Desde 2026
              </p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />

        {/* Cart Drawer */}
        <CartDrawer />
      </div>
    </>
  )
}

export default App
