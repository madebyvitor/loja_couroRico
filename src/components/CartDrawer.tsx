import { useMemo } from 'react'
import { AnimatePresence } from 'motion/react'
import { motion } from 'motion/react'
import { useStore } from '@/store/useStore'
import { ShoppingBag, Plus, Minus, Trash2, X, ArrowRight, ShoppingCart } from 'lucide-react'
import { generateWhatsAppLink } from '@/lib/checkout'

// ─── Animation Variants ───────────────────────────────────────────────────────

const drawerVariants = {
  hidden: {
    x: '100%',
    transition: { ease: [0.76, 0, 0.24, 1] as const, duration: 0.5 },
  },
  visible: {
    x: 0,
    transition: { ease: [0.76, 0, 0.24, 1] as const, duration: 0.5 },
  },
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const listContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ease: [0.76, 0, 0.24, 1] as const, duration: 0.45 },
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CartDrawer() {
  // Seletores atômicos: re-render apenas quando o slice específico muda
  const cart = useStore((s) => s.cart)
  const isCartOpen = useStore((s) => s.isCartOpen)
  const toggleCart = useStore((s) => s.toggleCart)
  const updateQuantity = useStore((s) => s.updateQuantity)
  const removeFromCart = useStore((s) => s.removeFromCart)
  const clearCart = useStore((s) => s.clearCart)

  // Cálculos derivados memoizados — só recalculam quando o cart muda
  const cartItemCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  )
  const cartTotalPrice = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  )

  const handleCheckout = () => {
    if (cart.length === 0) return
    const url = generateWhatsAppLink(cart, cartTotalPrice)
    window.open(url, '_blank')
    clearCart()
    toggleCart(false)
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* ── Overlay duplo: blur + escurecimento extra focado ── */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.4 }}
            onClick={() => toggleCart(false)}
            aria-hidden="true"
          />

          {/* ── Drawer ── */}
          <motion.div
            className="relative w-full max-w-[400px] h-full bg-couro-black border-l border-couro-gold/10 flex flex-col shadow-2xl"
            style={{ backdropFilter: 'blur(24px)' }}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            data-lenis-prevent
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-couro-gold/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-couro-gold" />
                <h2 className="font-serif text-lg font-bold text-couro-ivory tracking-wide">
                  Sua Sacola
                </h2>
                {cartItemCount > 0 && (
                  <span className="bg-couro-gold/10 text-couro-gold border border-couro-gold/30 text-[10px] px-2 py-0.5 rounded font-mono font-semibold">
                    {cartItemCount} {cartItemCount === 1 ? 'item' : 'itens'}
                  </span>
                )}
              </div>
              <button
                onClick={() => toggleCart(false)}
                className="p-1.5 rounded-full border border-transparent hover:border-couro-gold/20 hover:bg-couro-gold/10 text-couro-ivory/50 hover:text-couro-gold transition-all cursor-pointer"
                aria-label="Fechar sacola"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Cart Items ── */}
            <div className="flex-1 overflow-y-auto px-6 py-4" data-lenis-prevent>
              {cart.length === 0 ? (
                /* Estado vazio — editorial */
                <div className="h-full flex flex-col items-center justify-center text-center py-20 gap-4">
                  <div className="w-16 h-16 rounded-full border border-dashed border-couro-gold/25 flex items-center justify-center text-couro-gold/25">
                    <ShoppingCart className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-serif text-base text-couro-ivory/50 italic mb-1">
                      Sua seleção aguarda.
                    </p>
                    <p className="text-xs text-couro-ivory/30 leading-relaxed">
                      Explore a coleção e adicione peças à sua sacola.
                    </p>
                  </div>
                  <button
                    onClick={() => toggleCart(false)}
                    className="mt-2 text-xs font-semibold uppercase tracking-widest text-couro-gold hover:text-couro-ivory border-b border-couro-gold/40 hover:border-couro-ivory/40 transition-colors pb-0.5 cursor-pointer"
                  >
                    Explorar a coleção
                  </button>
                </div>
              ) : (
                /* Lista com stagger */
                <motion.ul
                  className="space-y-3"
                  variants={listContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {cart.map((item) => (
                    <motion.li
                      key={item.id}
                      variants={itemVariants}
                      layout
                      className="glass-panel p-4 rounded border border-couro-gold/10 hover:border-couro-gold/25 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {/* Imagem pequena se existir */}
                        {item.image && (
                          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 border border-couro-gold/15">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif font-semibold text-sm text-couro-ivory leading-tight truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-couro-gold font-semibold font-mono mt-0.5">
                            R$ {item.price.toFixed(2)}
                          </p>
                        </div>

                        {/* Controles de quantidade */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-center border border-couro-gold/20 rounded overflow-hidden bg-couro-black/40">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1.5 hover:bg-couro-gold/10 text-couro-ivory/50 hover:text-couro-gold transition-colors cursor-pointer"
                              aria-label="Diminuir quantidade"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-mono font-bold text-couro-ivory">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1.5 hover:bg-couro-gold/10 text-couro-ivory/50 hover:text-couro-gold transition-colors cursor-pointer"
                              aria-label="Aumentar quantidade"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-couro-ivory/30 hover:text-red-400 hover:bg-red-950/20 rounded transition-colors cursor-pointer"
                            aria-label="Remover item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </div>

            {/* ── Footer: Total + CTA ── */}
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t border-couro-gold/10 flex-shrink-0 bg-couro-black/60">
                {/* Subtotal por linha */}
                <div className="space-y-1 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-[11px] text-couro-ivory/35 font-mono">
                      <span>{item.quantity}× {item.name}</span>
                      <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-baseline mb-5 pt-3 border-t border-couro-gold/10">
                  <span className="text-xs uppercase tracking-widest text-couro-ivory/40">Total estimado</span>
                  <span className="text-2xl font-serif font-bold text-couro-gold">
                    R$ {cartTotalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Botão WhatsApp */}
                  <button
                    id="cart-checkout-btn"
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-couro-gold to-couro-caramel hover:from-couro-caramel hover:to-couro-gold text-couro-black font-semibold uppercase tracking-[0.15em] py-3.5 rounded text-xs shadow-lg shadow-couro-gold/10 hover:shadow-couro-gold/25 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Finalizar via WhatsApp
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Limpar sacola */}
                  <button
                    onClick={clearCart}
                    className="w-full text-xs text-couro-ivory/30 hover:text-red-400 py-2 transition-colors cursor-pointer"
                  >
                    Limpar sacola
                  </button>
                </div>

                <p className="text-[10px] text-center text-couro-ivory/25 mt-3 leading-relaxed">
                  Você será direcionado ao WhatsApp com o resumo do pedido. O carrinho será limpo automaticamente.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
