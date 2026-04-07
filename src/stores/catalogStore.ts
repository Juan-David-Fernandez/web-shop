/**
 * Catalog store for managing product data and filters
 */

import { atom, computed } from 'nanostores'
import type { Product, FilterOptions } from '../types/catalog'

// Core stores
export const catalogStore = atom<Product[]>([])
export const filterStore = atom<FilterOptions>({})
export const isLoadingStore = atom<boolean>(false)
export const errorStore = atom<string | null>(null)

// Derived store for filtered products
export const filteredProductsStore = computed(
  [catalogStore, filterStore],
  ($catalog, $filters) => {
    let products = [...$catalog]

    // Filter by category
    if ($filters.category && $filters.category !== 'tutti') {
      products = products.filter(p => p.category === $filters.category)
    }

    // Filter by search term
    if ($filters.search && $filters.search.trim() !== '') {
      const search = $filters.search.toLowerCase().trim()
      products = products.filter(
        p =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      )
    }

    // Filter by price range
    if ($filters.minPrice !== undefined) {
      products = products.filter(
        p => p.price !== undefined && p.price >= $filters.minPrice!
      )
    }
    if ($filters.maxPrice !== undefined) {
      products = products.filter(
        p => p.price !== undefined && p.price <= $filters.maxPrice!
      )
    }

    // Filter by stock
    if ($filters.inStockOnly) {
      products = products.filter(p => p.inStock !== false)
    }

    // Sort products
    if ($filters.sortBy) {
      switch ($filters.sortBy) {
        case 'price-asc':
          products.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
          break
        case 'price-desc':
          products.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
          break
        case 'name-asc':
          products.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'name-desc':
          products.sort((a, b) => b.name.localeCompare(a.name))
          break
      }
    }

    return products
  }
)

/**
 * Load catalog data from JSON file
 */
export async function loadCatalog(): Promise<void> {
  isLoadingStore.set(true)
  errorStore.set(null)

  try {
    const response = await fetch('/data/catalog.json')
    if (!response.ok) {
      throw new Error('Failed to load catalog data')
    }
    const data = await response.json()
    catalogStore.set(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    errorStore.set(message)
    console.error('Error loading catalog:', error)
  } finally {
    isLoadingStore.set(false)
  }
}

/**
 * Update filter options
 */
export function updateFilters(filters: Partial<FilterOptions>): void {
  filterStore.set({ ...filterStore.get(), ...filters })
}

/**
 * Clear all filters
 */
export function clearFilters(): void {
  filterStore.set({})
}

/**
 * Get product by slug
 */
export function getProductBySlug(slug: string): Product | undefined {
  return catalogStore.get().find(p => p.slug === slug)
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: string): Product[] {
  if (category === 'tutti') {
    return catalogStore.get()
  }
  return catalogStore.get().filter(p => p.category === category)
}
