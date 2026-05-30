import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

// ─── Sub-components ───────────────────────────────────────────────────────────
import { AdminLogin } from './AdminLogin'
import { AdminPanel } from './AdminPanel'

// ─── Variants ─────────────────────────────────────────────────────────────────
const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProtectedRoute() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // Escutar mudanças de autenticação (login / logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-couro-black flex items-center justify-center">
        <motion.div
          className="w-8 h-8 border-2 border-couro-gold/30 border-t-couro-gold rounded-full"
          animate={{ rotate: 360 }}
          transition={{ ease: 'linear', duration: 1, repeat: Infinity }}
        />
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {session ? (
        <motion.div key="panel" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">
          <AdminPanel session={session} />
        </motion.div>
      ) : (
        <motion.div key="login" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">
          <AdminLogin />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
