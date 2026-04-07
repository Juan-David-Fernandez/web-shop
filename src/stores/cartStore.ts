/**
 * Cart store for managing shopping cart state
 */

import { writable, derived } from 'nanostores'
import type { Product } from '../types/catalog'

export interface CartItem extends Product {
  quantity: number
}

// Core store
export const cartStore = writable<CartItem[]>([])

// Derived store for cart count
export const cartCountStore = derived(cartStore, $cart =>
  $cart.reduce((total, item) => total + item.quantity, 0)
)

// Derived store for cart total
export const cartTotalStore = derived(cartStore, $cart =>
  $cart.reduce((total, item) => total + (item.price ?? 0) * item.quantity, 0)
)

/**
 * Add a product to the cart
 */
export function addToCart(product: Product): void {
  const cart = cartStore.get()
  const existingItem = cart.find(item => item.id === product.id)

  if (existingItem) {
    // Increment quantity if already in cart
    cartStore.set(
      cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  } else {
    // Add new item with quantity 1
    cartStore.set([...cart, { ...product, quantity: 1 }])
  }
}

/**
 * Remove a product from the cart
 */
export function removeFromCart(productId: string): void {
  cartStore.set(cartStore.get().filter(item => item.id !== productId))
}

/**
 * Update quantity of a cart item
 */
export function updateQuantity(productId: string, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(productId)
    return
  }

  cartStore.set(
    cartStore.get().map(item =>
      item.id === productId ? { ...item, quantity } : item
    )
  )
}

/**
 * Clear the entire cart
 */
export function clearCart(): void {
  cartStore.set([])
}

/**
 * Check if a product is in the cart
 */
export function isInCart(productId: string): boolean {
  return cartStore.get().some(item => item.id === productId)
}
