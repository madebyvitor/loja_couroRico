import { useStore } from '../store/useStore';
import { ShoppingBag, Plus, Minus, Trash2, X, ArrowRight } from 'lucide-react';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    toggleCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useStore();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const messageHeader = '*Pedido - COURO RICO*\n\nOlá! Gostaria de encomendar os seguintes produtos:\n\n';
    const messageBody = cart.map(item => (
      `- ${item.quantity}x *${item.name}* (R$ ${item.price.toFixed(2)} cada) -> Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}`
    )).join('\n');
    
    const messageFooter = `\n\n*Total do Pedido:* R$ ${cartTotalPrice.toFixed(2)}\n\n_Aguardo confirmação para envio dos dados de pagamento e entrega._`;
    
    const encodedText = encodeURIComponent(messageHeader + messageBody + messageFooter);
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div 
      className={`fixed inset-0 z-50 transition-all duration-500 flex justify-end ${
        isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-couro-black/60 backdrop-blur-sm transition-opacity duration-500"
        onClick={() => toggleCart(false)}
      />
      
      {/* Drawer container */}
      <div 
        className={`w-full max-w-md h-full bg-couro-black/90 border-l border-couro-gold/20 p-6 flex flex-col justify-between shadow-2xl relative z-10 transition-transform duration-500 transform ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        data-lenis-prevent /* Essential for scroll containment inside Lenis */
      >
        {/* Header */}
        <div>
          <div className="flex justify-between items-center border-b border-couro-gold/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-couro-gold" />
              <h3 className="font-serif text-xl font-bold text-couro-ivory tracking-wide">
                Sua Sacola
              </h3>
              <span className="bg-couro-gold/10 text-couro-gold border border-couro-gold/30 text-[10px] px-2 py-0.5 rounded font-mono font-semibold">
                {cartItemCount} itens
              </span>
            </div>
            <button 
              onClick={() => toggleCart(false)}
              className="p-1 rounded-full border border-transparent hover:border-couro-gold/20 hover:bg-couro-gold/10 text-couro-ivory/60 hover:text-couro-gold transition-all cursor-pointer"
              aria-label="Fechar sacola"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
            {cart.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-dashed border-couro-gold/25 flex items-center justify-center mb-4 text-couro-gold/30">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm text-couro-ivory/40">Sua sacola está vazia.</p>
                <a
                  href="#colecao"
                  onClick={() => toggleCart(false)}
                  className="mt-4 text-xs font-semibold text-couro-gold hover:text-couro-ivory underline transition-colors cursor-none"
                >
                  Explorar a coleção
                </a>
              </div>
            ) : (
              cart.map(item => (
                <div 
                  key={item.id}
                  className="glass-panel p-4 rounded border border-couro-gold/10 hover:border-couro-gold/30 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <h4 className="font-serif font-semibold text-sm text-couro-ivory leading-tight mb-1">{item.name}</h4>
                    <p className="text-xs text-couro-gold font-semibold font-mono">
                      R$ {item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-couro-gold/30 rounded bg-couro-black/40 overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1.5 hover:bg-couro-gold/10 text-couro-ivory/60 hover:text-couro-gold transition-colors cursor-pointer"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-mono font-bold text-couro-ivory">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1.5 hover:bg-couro-gold/10 text-couro-ivory/60 hover:text-couro-gold transition-colors cursor-pointer"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-couro-ivory/40 hover:text-red-400 hover:bg-red-950/10 rounded transition-colors cursor-pointer"
                      aria-label="Remover item do carrinho"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer of Cart */}
        {cart.length > 0 && (
          <div className="border-t border-couro-gold/20 pt-6 mt-6">
            <div className="flex justify-between items-baseline mb-4">
              <span className="text-xs uppercase tracking-wider text-couro-ivory/40">Total do Pedido:</span>
              <span className="text-2xl font-serif font-bold text-couro-gold">
                R$ {cartTotalPrice.toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-couro-gold to-couro-caramel hover:from-couro-caramel hover:to-couro-gold text-couro-black font-semibold uppercase tracking-[0.15em] py-4 rounded text-xs shadow-lg shadow-couro-gold/10 hover:shadow-couro-gold/25 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                Finalizar via WhatsApp <ArrowRight className="w-4 h-4" />
              </button>
              
              <button 
                onClick={clearCart}
                className="w-full bg-transparent text-xs text-couro-ivory/40 hover:text-red-400 border border-transparent hover:border-red-950/20 py-2.5 rounded transition-all cursor-pointer"
              >
                Limpar Toda a Sacola
              </button>
            </div>
            
            <p className="text-[10px] text-center text-couro-ivory/30 mt-4 leading-relaxed">
              Você será redirecionado para o WhatsApp de atendimento com um resumo formatado de sua compra para processamento e entrega exclusivos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
