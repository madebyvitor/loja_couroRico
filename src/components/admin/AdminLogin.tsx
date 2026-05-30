import { useState } from 'react'
import { motion } from 'motion/react'
import { supabase } from '@/lib/supabase'
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react'

// ─── Variants ─────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { ease: [0.76, 0, 0.24, 1] as const, duration: 0.6, delay: i * 0.08 },
  }),
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Credenciais inválidas. Verifique e-mail e senha.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-couro-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-couro-gold/4 rounded-full blur-[150px]" />
      </div>

      <div className="w-full max-w-sm relative z-10">

        {/* Logo */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center mb-10"
        >
          <span className="font-serif tracking-[0.35em] text-xl text-couro-ivory">
            COURO RICO
          </span>
          <div className="w-8 h-px bg-couro-gold/50 mx-auto mt-3" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-couro-ivory/30 font-mono mt-3">
            Painel Administrativo
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="glass-panel rounded-sm p-8"
        >
          <form onSubmit={handleLogin} noValidate className="space-y-5">
            {/* E-mail */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-[10px] uppercase tracking-[0.25em] text-couro-ivory/40 font-mono mb-2"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-couro-ivory/30" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="admin@courorico.com.br"
                  className="w-full bg-couro-black/50 border border-couro-gold/15 focus:border-couro-gold/50 rounded pl-9 pr-4 py-3 text-sm text-couro-ivory placeholder:text-couro-ivory/20 outline-none transition-colors font-light"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-[10px] uppercase tracking-[0.25em] text-couro-ivory/40 font-mono mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-couro-ivory/30" />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••"
                  className="w-full bg-couro-black/50 border border-couro-gold/15 focus:border-couro-gold/50 rounded pl-9 pr-4 py-3 text-sm text-couro-ivory placeholder:text-couro-ivory/20 outline-none transition-colors font-light tracking-widest"
                />
              </div>
            </div>

            {/* Erro */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400/80 bg-red-950/20 border border-red-900/30 rounded px-3 py-2.5"
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <p className="text-xs">{error}</p>
              </motion.div>
            )}

            {/* Submit */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-couro-gold hover:bg-couro-caramel text-couro-black font-semibold uppercase tracking-[0.2em] py-3.5 rounded text-xs transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Entrando…
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </motion.div>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center text-[10px] text-couro-ivory/20 mt-6"
        >
          Acesso restrito. Couro Rico © {new Date().getFullYear()}
        </motion.p>
      </div>
    </div>
  )
}
