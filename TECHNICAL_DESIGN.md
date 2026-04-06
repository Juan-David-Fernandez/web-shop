# Technical Design: Sitio Astro + Catálogo

## 1. Arquitectura de Componentes

### Estructura General
```
src/
├── components/
│   ├── layout/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── Nav.astro
│   ├── ui/
│   │   ├── Button.module.css
│   │   ├── Card.module.css
│   │   ├── Input.module.css
│   │   ├── Badge.module.css
│   │   └── Avatar.module.css
│   ├── catalog/
│   │   ├── ProductGrid.astro
│   │   ├── ProductCard.astro
│   │   ├── FilterPanel.astro
│   │   ├── SortDropdown.astro
│   │   └── Pagination.astro
│   ├── account/
│   │   ├── LoginForm.astro
│   │   ├── UserProfile.astro
│   │   └── AdminDashboard.astro
│   └── shared/
│       ├── LoadingSpinner.astro
│       └── ErrorBoundary.astro
├── pages/
│   ├── index.astro
│   ├── catalog/
│   │   ├── [category].astro
│   │   └── [slug].astro
│   ├── account/
│   │   ├── login.astro
│   │   ├── dashboard.astro
│   │   └── admin/
│   │       ├── products.astro
│   │       └── orders.astro
│   └── about.astro
├── stores/
│   ├── catalogStore.ts
│   ├── cartStore.ts
│   └── authStore.ts
├── types/
│   ├── catalog.ts
│   └── auth.ts
└── data/
    ├── catalog.json
    └── categories.json
```

### Container/Presentational Pattern
- **Containers**: páginas que manejan lógica de datos y estado (ej: `pages/catalog/[category].astro`)
- **Presentational**: componentes que solo reciben props y renderizan UI (ej: `components/catalog/ProductCard.astro`)
- **Regla**: Los containers importan stores y manejan data fetching; presentacionales son puros

### Ejemplo de Separación
```astro
<!-- pages/catalog/[category].astro (Container) -->
---
import ProductGrid from '@/components/catalog/ProductGrid.astro'
import { catalogStore } from '@/stores/catalogStore'

const { category } = Astro.params
const products = await catalogStore.getByCategory(category)
---
<ProductGrid products={products} category={category} />

<!-- components/catalog/ProductCard.astro (Presentational) -->
---
interface Props {
  product: Product
}
const { product } = Astro.props
---
<article class="card">
  <img src={product.image} alt={product.name} />
  <h3>{product.name}</h3>
  <p>${product.price}</p>
</article>
```

## 2. Estructura de CSS Modules

### Organización de Archivos
```
src/
├── styles/
│   ├── variables.module.css
│   ├── breakpoints.module.css
│   └── globals.module.css
├── components/
│   ├── ui/
│   │   ├── Button.module.css
│   │   └── Card.module.css
│   └── catalog/
│       ├── ProductGrid.module.css
│       └── ProductCard.module.css
└── pages/
    └── catalog/
        └── [category].module.css
```

### Variables CSS para Theming
```css
/* src/styles/variables.module.css */
:root {
  --color-brown: #8B4513;
  --color-cream: #F5F5DC;
  --color-gold: #DAA520;
  
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;
  
  --font-primary: 'Georgia', serif;
  --font-secondary: 'Helvetica Neue', sans-serif;
  
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
}
```

### Breakpoints para Responsive
```css
/* src/styles/breakpoints.module.css */
@media (min-width: 640px) {  /* sm */
  /* estilos pequeños */
}

@media (min-width: 768px) {  /* md */
  /* estilos medianos */
}

@media (min-width: 1024px) {  /* lg */
  /* estilos grandes */
}

@media (min-width: 1280px) {  /* xl */
  /* estilos extra grandes */
}
```

### Uso en Componentes
```astro
<!-- components/catalog/ProductCard.astro -->
---
import styles from './ProductCard.module.css'
---
<article class={styles.card}>
  <!-- contenido -->
</article>
```

## 3. Data Flow

### Nano Stores Implementation
```typescript
// src/stores/catalogStore.ts
import { writable } from 'nanostores'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  inStock: boolean
}

export interface FilterOptions {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
  sortBy?: 'price-asc' | 'price-desc' | 'name'
}

export const catalogStore = writable<Product[]>([])
export const filterStore = writable<FilterOptions>({})

export async function loadCatalog() {
  const response = await fetch('/data/catalog.json')
  const data = await response.json()
  catalogStore.set(data)
}

export function applyFilters(filters: FilterOptions) {
  filterStore.set(filters)
  // Lógica de filtrado aplicada en componentes que se suscriben
}

// src/stores/cartStore.ts
export interface CartItem extends Product {
  quantity: number
}

export const cartStore = writable<CartItem[]>([])

export function addToCart(product: Product) {
  cartStore.set([...cartStore.get(), { ...product, quantity: 1 }])
}

export function removeFromCart(id: string) {
  cartStore.set(cartStore.get().filter(item => item.id !== id))
}
```

### Flujo de Datos
1. **Inicialización**: `loadCatalog()` carga datos desde `/data/catalog.json` al iniciar
2. **Filtrado**: `filterStore` actualiza cuando cambian parámetros de URL o UI
3. **Suscripción**: componentes como `ProductGrid` se suscriben a ambos stores
4. **URL Params**: Astro parametros como `[category].astro` actualizan `filterStore`
5. **Estado Derivado**: componentes calculan productos filtrados combinando stores

```astro
<!-- components/catalog/ProductGrid.astro -->
---
import { catalogStore, filterStore } from '@/stores/catalogStore'
import ProductCard from './ProductCard.astro'

let products = $catalogStore
let filters = $filterStore

// Estado derivado: productos filtrados
$: filteredProducts = applyFiltersToProducts(products, filters)
---
<div class="grid">
  {#if filteredProducts.length === 0}
    <p>No se encontraron productos</p>
  {:else}
    {#each filteredProducts as product}
      <ProductCard product={product} />
    {/each}
  {/if}
</div>
```

## 4. Routing Structure

### Archivo de Rutas (Astro File-based)
```
src/pages/
├── index.astro                    // Home
├── about.astro                    // About
├── catalog/
│   ├── index.astro                // /catalog (todos productos)
│   ├── [category].astro           // /catalog/categoria
│   └── [slug].astro               // /catalog/producto-slug
├── account/
│   ├── login.astro                // /account/login
│   ├── dashboard.astro            // /account/dashboard
│   └── admin/
│       ├── index.astro            // /account/admin
│       ├── products.astro         // /account/admin/products
│       └── orders.astro           // /account/admin/orders
└── cart.astro                     // /cart
```

### Dynamic Routes para Productos
- `[slug].astro`: maneja rutas como `/catalog/zapatos-cuero`
- Parámetro accesible vía `Astro.params.slug`
- Carga producto específico desde store mediante ID o slug

### Ejemplo de Ruta Dinámica
```astro
<!-- src/pages/catalog/[slug].astro -->
---
import { catalogStore } from '@/stores/catalogStore'
import ProductDetail from '@/components/catalog/ProductDetail.astro'

const { slug } = Astro.params
const product = catalogStore.get().find(p => p.slug === slug)

if (!product) {
  return Astro.redirect('/404')
}
---
<ProductDetail product={product} />
```

## 5. Account System Design

### Estructura de Autenticación (Mock JWT)
```typescript
// src/stores/authStore.ts
import { writable } from 'nanostores'

export interface User {
  id: string
  email: string
  role: 'admin' | 'employee' | 'guest'
  token: string
}

export const authStore = writable<User | null>(null)

export function login(email: string, password: string) {
  // Simulación de auth - en producción sería llamada real
  const mockUsers: Record<string, User> = {
    'admin@test.com': {
      id: '1',
      email: 'admin@test.com',
      role: 'admin',
      token: 'mock-jwt-admin-token'
    },
    'employee@test.com': {
      id: '2',
      email: 'employee@test.com',
      role: 'employee',
      token: 'mock-jwt-employee-token'
    }
  }

  const user = mockUsers[email]
  if (user && user.token === `mock-jwt-${user.role}-token`) {
    authStore.set(user)
    return true
  }
  return false
}

export function logout() {
  authStore.set(null)
}

export function isAuthenticated(): boolean {
  return authStore.get() !== null
}

export function isAdmin(): boolean {
  return authStore.get()?.role === 'admin'
}

export function isEmployee(): boolean {
  const user = authStore.get()
  return user && (user.role === 'admin' || user.role === 'employee')
}
```

### Protecciones de Ruta
```astro
<!-- src/pages/account/dashboard.astro -->
---
import { authStore } from '@/stores/authStore'
import { isEmployee } from '@/stores/authStore'

if (!isEmployee()) {
  return Astro.redirect('/account/login')
}
---
<Dashboard user={authStore.get()} />

<!-- src/pages/account/admin/products.astro -->
---
import { authStore } from '@/stores/authStore'
import { isAdmin } from '@/stores/authStore'

if (!isAdmin()) {
  return Astro.redirect('/account/dashboard')
}
---
<AdminProducts />
```

### Dashboard Pages
- `/account/login`: formulario de autenticación
- `/account/dashboard`: vista según rol (empleado ve productos básicos, admin ve gestión completa)
- `/account/admin/*`: rutas protegidas solo para admin

## 6. Placeholder Strategy

### Sistema de Placeholder para Imágenes
```astro
<!-- components/shared/ImagePlaceholder.astro -->
---
interface Props {
  width?: number
  height?: number
  alt?: string
  class?: string
}
const { width = 400, height = 300, alt = 'Imagen placeholder', class: className = '' } = Astro.props
---
<svg
  width={width}
  height={height}
  viewBox="0 0 400 300"
  xmlns="http://www.w3.org/2000/svg"
  class={className}
>
  <rect width="100%" height="100%" fill="#f0f0f0" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="16">
    {alt}
  </text>
</svg>
```

### Uso en Componentes
```astro
<!-- components/catalog/ProductCard.astro -->
---
import ImagePlaceholder from '@/shared/ImagePlaceholder.astro'
---
<figure>
  {product.image ? (
    <img src={product.image} alt={product.name} onerror="this.onerror=null;this.src='/placeholder.svg'">
  ) : (
    <ImagePlaceholder width={300} height={200} alt={product.name} />
  )}
  {/* resto del componente -->
</figure>
```

### Sistema de "Slots" para Fotos Reales
- Los componentes aceptan una prop `image` opcional
- Si no se proporciona imagen, se muestra placeholder
- En producción, las imágenes reales vendrían de un CDN o servicio externo
- Estrategia progresiva: cargar placeholder primero, luego imagen real

## 7. Git Branching

### Nombre de Branch
```
feature/catalogo
```

### Flujo de Trabajo
1. **Crear branch**: `git checkout -b feature/catalogo main`
2. **Desarrollo**: commits frecuentes con mensajes descriptivos
3. **Revisión**: abrir Pull Request contra `main`
4. **Merge**: usar squash merge para mantener historial limpio
5. **Tagging**: opcionalmente taggear releases como `v1.0.0-catalogo`

### Convenciones de Commit
```
feat(catalog): add product grid component
fix(ui): resolve button alignment issue
docs: update catalog API documentation
style: add CSS variables for theme
refactor(store): improve filter logic
test: add unit tests for cart store
```

## Executive Summary

Este technical design detalla la implementación de un sitio e-commerce usando Astro 5.x con TypeScript strict y Nano Stores para manejo de estado. La arquitectura sigue patrones estabelecidos como Container/Presentational para separar lógica de presentación, CSS Modules para styling encapsulado y un flujo de datos unificado mediante stores reactivos.

El diseño incluye un sistema completo de catálogo con filtrado y paginación, sistema de autenticación basado en roles (admin/employee/guest) con protección de rutas, y estrategia de placeholders para manejo graceful de imágenes. La estructura de archivos está organizada para escalabilidad y mantenibilidad, con separación clara de preocupaciones entre componentes UI, lógica de negocio y datos.

## Artifacts
- `src/styles/variables.module.css` - Variables CSS para theming
- `src/stores/catalogStore.ts` - Store principal para datos del catálogo
- `src/stores/cartStore.ts` - Store para manejo del carrito
- `src/stores/authStore.ts` - Store para autenticación y autorización
- `src/pages/catalog/[category].astro` - Ruta dinámica para filtrado por categoría
- `src/pages/catalog/[slug].astro` - Ruta dinámica para detalle de producto
- `src/components/shared/ImagePlaceholder.astro` - Componente placeholder reutilizable
- `src/data/catalog.json` - Datos iniciales del catálogo
- `src/data/categories.json` - Taxonomía de categorías

## Next Recommended
`sdd-tasks` - Para breakdown del change en tareas de implementation

## Risks
- **Sobrecarga de Stores**: Si el catálogo crece mucho, los stores en memoria podrían afectar rendimiento
  - *Mitigación*: Implementar paginación y lazy loading en future iterations
  
- **Dependencia de Nano Stores**: Biblioteca menos conocida que Redux/Zustand
  - *Mitigación*: Documentar bien el patrón y proporcionar escape hatches a otras soluciones
  
- **SEO con Renderizado Cliente Astro**: Por defecto Astro es estático pero necesitamos validar que las rutas dinámicas se generen correctamente
  - *Mitigación*: Verificar en build que todas las rutas estén pre-renderizadas
  
- **Gestión de Estado Complejo**: A medida que crece la aplicación, manejar múltiples stores puede volverse complejo
  - *Mitigación*: Considerar migrar a un store unificado si la complejidad supera umbral determinado
  
- **Placeholder vs Imágenes Reales**: El manejo de errores de carga de imágenes necesita testing exhaustivo
  - *Mitigación*: Implementar retry mechanism y fallback robusto