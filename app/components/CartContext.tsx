'use client'

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'

type CartItem = {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

type CartState = {
  items: CartItem[]
}

type CartAction =
  | { type: 'initialize'; payload: CartItem[] }
  | { type: 'add'; payload: CartItem }
  | { type: 'updateQuantity'; payload: { id: number; quantity: number } }
  | { type: 'remove'; payload: { id: number } }
  | { type: 'clear' }

type CartContextValue = {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (item: CartItem) => void
  updateQuantity: (id: number, quantity: number) => void
  removeItem: (id: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)
const STORAGE_KEY = 'my-store-cart'

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'initialize':
      return { items: action.payload }
    case 'add': {
      const existing = state.items.find(item => item.id === action.payload.id)
      if (existing) {
        return {
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        }
      }
      return { items: [...state.items, action.payload] }
    }
    case 'updateQuantity': {
      if (action.payload.quantity < 1) {
        return {
          items: state.items.filter(item => item.id !== action.payload.id),
        }
      }
      return {
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      }
    }
    case 'remove':
      return { items: state.items.filter(item => item.id !== action.payload.id) }
    case 'clear':
      return { items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const items: CartItem[] = JSON.parse(saved)
        dispatch({ type: 'initialize', payload: items })
      } catch {
        dispatch({ type: 'initialize', payload: [] })
      }
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [hydrated, state.items])

  const value = useMemo(
    () => ({
      items: state.items,
      totalItems: state.items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addItem: (item: CartItem) => dispatch({ type: 'add', payload: item }),
      updateQuantity: (id: number, quantity: number) =>
        dispatch({ type: 'updateQuantity', payload: { id, quantity } }),
      removeItem: (id: number) => dispatch({ type: 'remove', payload: { id } }),
      clearCart: () => dispatch({ type: 'clear' }),
    }),
    [state.items]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
