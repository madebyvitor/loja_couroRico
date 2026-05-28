import { useStore } from '../store/useStore';
import { Plus } from 'lucide-react';

export function FeaturedCollection() {
  const { addToCart } = useStore();

  const testProducts = [
    {
      id: 'carteira-classic',
      name: 'Carteira "Classic"',
      price: 450.00,
      description: 'Couro legítimo PBR, costura manual dupla, acabamento ultra refinado.',
      category: 'Acessórios',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'bolsa-elegance',
      name: 'Bolsa "Elegance"',
      price: 1200.00,
      description: 'Design de alta costura, detalhes em hardware metálico dourado 18k.',
      category: 'Bolsas',
      image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'chapeu-horizon',
      name: 'Chapéu "Horizon"',
      price: 600.00,
      description: 'Camurça premium, banda decorativa em couro fosco moldado.',
      category: 'Chapéus',
      image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=800&auto=format&fit=crop'
    }
  ];

  return (
    <section id="colecao" className="py-24 px-6 md:px-12 lg:px-24 bg-couro-black scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.3em] text-couro-gold font-semibold font-mono">Coleção MVP</span>
        <h2 className="text-3xl md:text-5xl font-serif text-couro-ivory mt-2 font-bold mb-4">Peças em Destaque</h2>
        <p className="text-sm text-couro-ivory/60 font-light">
          Artigos artesanais de couro genuíno, concebidos para durar gerações.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testProducts.map(product => (
          <div 
            key={product.id} 
            className="group relative glass-panel rounded-lg hover:border-couro-gold/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Image Container with Hover Zoom & Golden Shadow */}
            <div className="relative h-64 overflow-hidden mb-6 rounded-t-lg bg-couro-brown/20 border-b border-couro-gold/10">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                style={{ backgroundImage: `url(${product.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-couro-black via-transparent to-transparent opacity-80" />
              <div className="absolute inset-0 shadow-[inset_0_0_0_0_rgba(212,175,55,0)] group-hover:shadow-[inset_0_0_40px_0_rgba(212,175,55,0.15)] transition-shadow duration-700" />
              
              <div className="absolute bottom-4 left-6 z-10">
                <span className="text-[10px] tracking-widest text-couro-gold uppercase font-semibold font-mono block drop-shadow-md">
                  {product.category}
                </span>
              </div>
            </div>

            <div className="px-6 pb-6 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-2xl font-serif font-bold text-couro-ivory mb-2 group-hover:text-couro-gold transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-couro-ivory/60 font-light mb-6 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-6 border-t border-couro-gold/10 pt-4">
                  <span className="text-xs text-couro-ivory/40">Preço Sugerido:</span>
                  <span className="text-xl font-serif font-bold text-couro-gold">
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>
                
                <button 
                  onClick={() => addToCart({ id: product.id, name: product.name, price: product.price })}
                  className="w-full bg-transparent hover:bg-couro-gold text-couro-gold hover:text-couro-black border border-couro-gold/40 hover:border-couro-gold text-xs uppercase tracking-[0.1em] font-semibold py-3.5 rounded transition-all cursor-pointer flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-couro-gold/10"
                >
                  Adicionar à Sacola <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
