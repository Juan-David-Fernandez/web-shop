/**
 * Product type definitions for the catalog
 */

export type ProductCategory = 'gastronomia' | 'salumeria' | 'rosticceria'

export interface Product {
  id: string
  name: string
  description: string
  slug: string
  category: ProductCategory
  price?: number
  image: string
  attributes?: string[]
  featured?: boolean
  inStock?: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export interface FilterOptions {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'
}
