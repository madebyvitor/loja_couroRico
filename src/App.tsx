// Layouts
import { Navbar } from '@/layouts/Navbar'
import { Footer } from '@/layouts/Footer'

// Components
import { HeroSection } from './components/HeroSection'
import { FeaturedCollection } from './components/FeaturedCollection'
import { CraftsmanshipSection } from './components/CraftsmanshipSection'
import { CartDrawer } from './components/CartDrawer'

function App() {
  return (
    <div className="min-h-screen bg-couro-black text-couro-ivory relative font-sans selection:bg-couro-gold/30 selection:text-couro-gold">

      {/* Grain overlay — textura analógica cinematográfica */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Ambient background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-0 left-0 right-0 h-[70vh] bg-gradient-to-b from-couro-brown/20 to-transparent" />
        <div className="absolute top-[15%] left-[-15%] w-[600px] h-[600px] bg-couro-caramel/4 rounded-full blur-[140px]" />
        <div className="absolute bottom-[25%] right-[-15%] w-[700px] h-[700px] bg-couro-gold/4 rounded-full blur-[160px]" />
      </div>

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
  )
}

export default App
