# La Salumeria Silvio - E-commerce

Plataforma web para La Salumeria Silvio, gastronomía histórica de Bérgamo (Italia) desde 1963.

## 🌐 Estado

- **Desarrollo local**: `http://localhost:4321`
- **Stack**: Astro 5.x + React islands + Nano Stores

## ✨ Features Implementados

| Feature | Estado |
|---------|--------|
| Catálogo de productos | ✅ |
| Búsqueda en tiempo real (~100ms) | ✅ |
| Filtro por categorías | ✅ |
| Detalle de producto con galería | ✅ |
| Historia de la empresa (timeline) | ✅ |
| Newsletter con double opt-in | ✅ |
| Panel admin para leads | ✅ |
| SEO (OG tags, sitemap, robots.txt) | ✅ |

### Por implementar
- Carrito de compras
- Checkout / Pago
- Cuentas de usuario
- Reseñas de productos

## 🚀 Getting Started

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build local
npm run preview
```

## 📁 Estructura

```
src/
├── components/    # Componentes Astro + React islands
├── layouts/       # Layouts base
├── pages/         # Rutas del sitio
├── stores/        # Nano Stores (state management)
├── styles/        # Estilos globales
└── types/         # TypeScript interfaces
```

## 🛠️ Tech Stack

- **Framework**: Astro 5.x
- **Interactivity**: React 18 (islands)
- **State**: Nano Stores
- **Styling**: CSS Modules
- **Deployment**: Node adapter