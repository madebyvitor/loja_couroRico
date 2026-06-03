import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Navbar } from '@/layouts/Navbar'
import { Footer } from '@/layouts/Footer'
import { MobileMenu } from '@/components/MobileMenu'
import { AtmosphericBackground } from '@/components/AtmosphericBackground'

const sections = [
  {
    title: 'Natureza do Serviço',
    content: `O site da Couro Rico funciona exclusivamente como um catálogo digital de produtos. Não realizamos transações financeiras, processamento de pagamentos ou checkout diretamente nesta plataforma. Todo o processo de negociação, orçamento e finalização de compra ocorre externamente, por meio do WhatsApp, de forma direta entre o cliente e a equipe Couro Rico.`,
  },
  {
    title: 'Uso Permitido',
    content: `Ao acessar este site, você concorda em utilizá-lo apenas para fins lícitos e de acordo com estas condições. É proibido copiar, reproduzir ou redistribuir imagens, textos e conteúdos presentes nesta plataforma sem autorização prévia e expressa da Couro Rico.`,
  },
  {
    title: 'Isenção de Responsabilidade sobre Links Externos',
    content: `Este site contém links para plataformas de terceiros, incluindo o WhatsApp (de propriedade da Meta Platforms, Inc.). Ao clicar nesses links e iniciar uma conversa, você estará sujeito aos termos de uso e à política de privacidade dessas plataformas. A Couro Rico não se responsabiliza pelo conteúdo, práticas de privacidade ou disponibilidade de serviços de terceiros.`,
  },
  {
    title: 'Disponibilidade e Precisão das Informações',
    content: `Nos esforçamos para manter as informações de produtos (descrições, imagens e preços) sempre atualizadas. No entanto, não garantimos que o catálogo estará livre de erros ou que todos os itens exibidos estarão disponíveis para pronta-entrega. Confirme a disponibilidade diretamente pelo WhatsApp antes de qualquer decisão de compra.`,
  },
  {
    title: 'Alterações nos Termos',
    content: `A Couro Rico se reserva o direito de modificar estes Termos de Uso a qualquer momento. Alterações serão publicadas nesta página com a respectiva data de atualização. O uso continuado do site após a publicação de alterações constitui aceitação dos novos termos.`,
  },
  {
    title: 'Contato',
    content: `Para dúvidas sobre estes Termos de Uso, entre em contato conosco pelo WhatsApp através do botão disponível em nosso catálogo de produtos.`,
  },
]

export function TermosPage() {
  useEffect(() => {
    document.title = 'Termos de Uso — Couro Rico'
  }, [])

  return (
    <div className="min-h-screen bg-couro-black text-couro-ivory relative font-sans selection:bg-couro-gold/30 selection:text-couro-gold">
      <div className="grain-overlay" aria-hidden="true" />
      <AtmosphericBackground />
      <Navbar />
      <MobileMenu />

      <main>
        {/* ── Hero minimalista ── */}
        <section className="relative pt-40 pb-24 px-6 text-center overflow-hidden">
          {/* Glow central */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-couro-gold/5 rounded-full blur-[120px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-couro-gold/60 font-mono block mb-6">
              Legal
            </span>
            <h1 className="font-serif text-5xl md:text-7xl text-couro-ivory font-bold leading-tight mb-6">
              Termos de Uso
            </h1>
            <div className="w-16 h-px bg-couro-gold/30 mx-auto mb-6" />
            <p className="text-sm text-couro-ivory/40 font-mono">
              Última atualização: Junho de 2026
            </p>
          </motion.div>
        </section>

        {/* ── Conteúdo ── */}
        <section className="relative z-10 pb-32 px-6">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-gray-300 leading-relaxed text-base mb-16 border-l-2 border-couro-gold/30 pl-6">
              Ao utilizar o site, você concorda com os termos e condições descritos abaixo. Leia com atenção antes de navegar ou utilizar nossos serviços.
            </p>

            <div className="space-y-14">
              {sections.map((section, i) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <h2 className="font-serif text-xl md:text-2xl text-couro-ivory font-semibold mb-4">
                    {i + 1}. {section.title}
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-base">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Link de volta */}
            <div className="mt-20 pt-10 border-t border-couro-gold/10 flex items-center gap-4">
              <Link
                to="/"
                className="text-xs uppercase tracking-[0.25em] text-couro-gold/60 hover:text-couro-gold transition-colors duration-300 font-mono"
              >
                ← Voltar ao início
              </Link>
              <span className="text-couro-ivory/20 text-xs">|</span>
              <Link
                to="/privacidade"
                className="text-xs uppercase tracking-[0.25em] text-couro-gold/60 hover:text-couro-gold transition-colors duration-300 font-mono"
              >
                Política de Privacidade →
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
