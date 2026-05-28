import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface AppState {
  cart: CartItem[]
  isCartOpen: boolean
}

interface AppActions {
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: (open?: boolean) => void
}

export const useStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      // Initial State
      cart: [],
      isCartOpen: false,

      // Actions
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
    }),
    {
      name: 'couro-rico-storage',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
)
