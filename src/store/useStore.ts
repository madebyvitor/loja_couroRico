import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/lib/supabase'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

// ─── Filter type ──────────────────────────────────────────────────────────────

export type CollectionFilter = 'todos' | 'bolsa' | 'carteira' | 'chapeu' | 'acessorio'

// ─── State & Actions ──────────────────────────────────────────────────────────

interface AppState {
  // Cart
  cart: CartItem[]
  isCartOpen: boolean

  // Catalog
  products: Product[]
  activeFilter: CollectionFilter
  isTransitioning: boolean
}

interface AppActions {
  // Cart actions
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: (open?: boolean) => void

  // Catalog actions
  setProducts: (products: Product[]) => void
  setActiveFilter: (filter: CollectionFilter) => void
  setTransitioning: (value: boolean) => void
}

// ─── Derived selector ─────────────────────────────────────────────────────────

/** Filtra produtos client-side — sem re-fetch ao banco */
export function selectFilteredProducts(state: AppState) {
  if (state.activeFilter === 'todos') return state.products
  return state.products.filter((p) => p.category === state.activeFilter)
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      // ── Cart ──────────────────────────────────────────────────────────────
      cart: [],
      isCartOpen: false,

      addToCart: (item) =>
        set((state) => {
          const existingIndex = state.cart.findIndex((cartItem) => cartItem.id === item.id)
          const quantityToAdd = item.quantity || 1

          if (existingIndex > -1) {
            const newCart = [...state.cart]
            newCart[existingIndex] = {
              ...newCart[existingIndex],
              quantity: newCart[existingIndex].quantity + quantityToAdd,
            }
            return { cart: newCart }
          }

          return {
            cart: [...state.cart, { ...item, quantity: quantityToAdd } as CartItem],
          }
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart
            .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
            .filter((item) => item.quantity > 0),
        })),

      clearCart: () => set({ cart: [] }),

      toggleCart: (open) =>
        set((state) => ({
          isCartOpen: open !== undefined ? open : !state.isCartOpen,
        })),

      // ── Catalog ───────────────────────────────────────────────────────────
      products: [],
      activeFilter: 'todos',
      isTransitioning: false,

      setProducts: (products) => set({ products }),
      setActiveFilter: (filter) => set({ activeFilter: filter }),
      setTransitioning: (value) => set({ isTransitioning: value }),
    }),
    {
      name: 'couro-rico-storage',
      // Persiste apenas o carrinho — produtos e filtro são efêmeros
      partialize: (state) => ({ cart: state.cart }),
    }
  )
)
