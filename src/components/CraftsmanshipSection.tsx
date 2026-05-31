import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function CraftsmanshipSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Parallax effect for the image
    gsap.to(imageRef.current, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Fade up for the text
    gsap.from(textRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="tradicao" className="py-32 px-6 md:px-12 lg:px-24 bg-couro-black relative overflow-hidden border-t border-couro-gold/10 scroll-mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
        
        {/* Asymmetrical Text Column */}
        <div ref={textRef} className="flex-1 space-y-8 order-2 md:order-1">
          <div className="inline-flex items-center gap-3">
            <span className="w-12 h-px bg-couro-gold/50"></span>
            <span className="text-xs uppercase tracking-[0.3em] text-couro-gold font-mono">ELEGÂNCIA EM CADA DETALHE</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-couro-ivory font-bold leading-tight">
            O couro como expressão de estilo e <br />
            <span className="italic text-couro-gold/90 font-light">personalidade</span>
          </h2>
          <p className="text-couro-ivory/70 font-light leading-relaxed text-lg max-w-lg">
            Texturas, cores e acabamentos que transformam o cotidiano em algo extraordinário.
          </p>
          <p className="text-couro-ivory/50 font-light leading-relaxed max-w-lg">
            Mais do que acessórios, cada peça foi escolhida para acompanhar diferentes momentos da vida com autenticidade e sofisticação.
          </p>
          
          <div className="pt-6">
            <button className="text-xs uppercase tracking-[0.2em] text-couro-ivory hover:text-couro-gold border-b border-transparent hover:border-couro-gold transition-all pb-1 font-semibold">
              Descubra Nossa História
            </button>
          </div>
        </div>

        {/* Parallax Image Column */}
        <div className="flex-1 order-1 md:order-2 w-full">
          <div className="relative aspect-[4/5] md:aspect-[3/4] w-full max-w-md mx-auto overflow-hidden rounded-sm border border-couro-gold/20">
            {/* The image that moves slower than scroll */}
            <div 
              ref={imageRef}
              className="absolute inset-[-15%] bg-cover bg-center"
              style={{ backgroundImage: 'url("src/assets/hat.jpeg")' }}
            />
            {/* Inner elegant shadow */}
            <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(11,11,11,0.5)] pointer-events-none" />
          </div>
        </div>

      </div>
    </section>
  );
}
