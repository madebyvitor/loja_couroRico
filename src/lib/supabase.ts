import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Variáveis de ambiente não configuradas. ' +
    'Crie um arquivo .env.local com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'
  )
}

// ─── Database Types ───────────────────────────────────────────────────────────

export type ProductCategory = 'carteira' | 'bolsa' | 'acessorio' | 'chapeu'

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  promotional_price: number | null
  is_promoted: boolean
  image_url: string | null
  category: ProductCategory
  created_at: string
}

export type ProductInsert = Omit<Product, 'id' | 'created_at'>
export type ProductUpdate = Partial<ProductInsert>

// ─── Client ──────────────────────────────────────────────────────────────────

export const supabase = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? ''
)
