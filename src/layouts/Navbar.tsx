import { useStore } from '@/store/useStore'
import { ShoppingBag } from 'lucide-react'

export function Navbar() {
  const { cart, toggleCart } = useStore()
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="fixed top-0 left-0 right-0 h-20 glass-panel z-40 transition-all duration-300 flex items-center px-6 md:px-12 justify-between border-t-0 border-x-0">
      <div className="flex items-center gap-8">
        <a
          href="#"
          className="font-serif text-2xl tracking-[0.2em] text-couro-gold font-bold transition-all hover:text-couro-ivory"
          onClick={(e) => e.preventDefault()}
        >
          COURO RICO
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm tracking-[0.1em] uppercase text-couro-ivory/60">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hover:text-couro-gold transition-colors text-couro-gold font-semibold"
          >
            Editorial
          </a>
          <a
            href="#colecao"
            className="hover:text-couro-gold transition-colors"
          >
            Coleção
          </a>
          <a
            href="#tradicao"
            className="hover:text-couro-gold transition-colors"
          >
            Tradição
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button
          id="navbar-cart-btn"
          onClick={() => toggleCart(true)}
          className="relative p-2.5 rounded-full border border-couro-gold/20 hover:border-couro-gold/60 hover:bg-couro-gold/10 transition-all group cursor-pointer"
          aria-label="Ver sacola de compras"
          data-cursor="hover"
        >
          <ShoppingBag className="w-5 h-5 text-couro-ivory group-hover:text-couro-gold transition-colors" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-couro-gold text-couro-black font-semibold font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
