import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Navbar } from '@/layouts/Navbar'
import { Footer } from '@/layouts/Footer'
import { MobileMenu } from '@/components/MobileMenu'
import { AtmosphericBackground } from '@/components/AtmosphericBackground'

const sections = [
  {
    title: 'Quais dados coletamos?',
    content: `Este site não coleta, armazena ou processa dados pessoais de visitantes. Não utilizamos formulários de cadastro, contas de usuário ou qualquer mecanismo de autenticação que exija informações pessoais do público geral.

O banco de dados da plataforma (Supabase) é utilizado exclusivamente para a gestão interna do catálogo de produtos por parte da equipe administrativa da Couro Rico. Nenhum dado de visitante é registrado nele.`,
  },
  {
    title: 'Dados fornecidos voluntariamente via WhatsApp',
    content: `Ao clicar no botão de contato e iniciar uma conversa pelo WhatsApp, você fornece voluntariamente informações como seu nome e número de telefone diretamente à plataforma WhatsApp (Meta Platforms, Inc.). Esses dados são transmitidos e gerenciados segundo as próprias políticas de privacidade do WhatsApp e da Meta, não sendo armazenados em nenhum banco de dados de nossa propriedade.

Utilizamos essas informações unicamente para responder à sua solicitação de compra ou orçamento, e elas não são compartilhadas com terceiros.`,
  },
  {
    title: 'Cookies e rastreamento',
    content: `Este site não utiliza cookies de rastreamento, ferramentas de análise de comportamento (como Google Analytics) ou pixels de publicidade. A navegação no catálogo Couro Rico é completamente anônima.`,
  },
  {
    title: 'Links para serviços de terceiros',
    content: `Nosso site contém links para o WhatsApp, que é um serviço de terceiros. Ao acessar plataformas externas, você passa a ser regido pelas políticas de privacidade delas. Recomendamos que leia a Política de Privacidade do WhatsApp/Meta para entender como seus dados são tratados nessa plataforma.`,
  },
  {
    title: 'Segurança',
    content: `Como não coletamos nem armazenamos dados de usuários finais, o risco de exposição de informações pessoais em nossa plataforma é mínimo. A área administrativa do site é protegida por autenticação e acessível apenas pela equipe autorizada da Couro Rico.`,
  },
  {
    title: 'Seus direitos',
    content: `Em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018), caso você acredite que algum dado seu possa estar sendo tratado por nós, entre em contato pelo WhatsApp. Nos comprometemos a responder e, se aplicável, a retificar ou eliminar quaisquer informações.`,
  },
  {
    title: 'Alterações nesta Política',
    content: `Esta Política de Privacidade pode ser atualizada periodicamente. Qualquer alteração será publicada nesta página com a respectiva data de atualização. O uso continuado do site após as alterações constitui aceitação da política revisada.`,
  },
]

export function PrivacidadePage() {
  useEffect(() => {
    document.title = 'Política de Privacidade — Couro Rico'
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
              Política de
              <br />
              <em className="font-light text-couro-gold/80">Privacidade</em>
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
              A <strong className="text-couro-ivory">Couro Rico</strong> respeita a sua privacidade. Esta política descreve de forma transparente como (e se) tratamos suas informações ao utilizar nosso catálogo digital.
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
                  <p className="text-gray-300 leading-relaxed text-base whitespace-pre-line">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Links de navegação */}
            <div className="mt-20 pt-10 border-t border-couro-gold/10 flex items-center gap-4">
              <Link
                to="/"
                className="text-xs uppercase tracking-[0.25em] text-couro-gold/60 hover:text-couro-gold transition-colors duration-300 font-mono"
              >
                ← Voltar ao início
              </Link>
              <span className="text-couro-ivory/20 text-xs">|</span>
              <Link
                to="/termos"
                className="text-xs uppercase tracking-[0.25em] text-couro-gold/60 hover:text-couro-gold transition-colors duration-300 font-mono"
              >
                Termos de Uso →
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
