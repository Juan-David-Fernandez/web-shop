# Proposal: La Salumeria Silvio Web Platform

## Intent

Build a modern web platform for La Salumeria Silvio to attract younger clientele while preserving the historic identity (since 1963). The website will showcase products, share the family's legacy story, and capture leads via newsletter signup.

## Scope

### In Scope
- **Astro-based static site** with React islands for interactivity
- **Interactive Product Catalog** with categories (Gastronomia, Salumeria, Rosticceria), filters, search, and product detail pages
- **Storia (History) section** with timeline, vintage photos, and family legacy storytelling
- **Newsletter system**: email signup form, API endpoint, database storage, double opt-in
- **"Modern Heritage" design**: Serif headings (Playfair Display), sans-serif body (Inter), warm color palette (wood tones, cream, deep red)
- **SEO optimization** for local search "Salumeria Bergamo"

### Out of Scope
- E-commerce transactions/payments (catalog display only)
- CMS for content management (hardcoded/Markdown initially)
- User accounts or authentication for public visitors
- Mobile app or PWA

## Capabilities

### New Capabilities
- `product-catalog`: Interactive catalog with category browsing, filtering, and search
- `product-detail`: Individual product pages with images and descriptions
- `history-section`: Timeline and vintage photo gallery telling the 1963 story
- `newsletter-signup`: Email capture with double opt-in confirmation
- `leads-admin`: Simple admin panel to view newsletter subscribers

### Modified Capabilities
- None (greenfield project)

## Approach

**Tech Stack**: Astro 5.x + React islands + TypeScript + Nano Stores  
**Database**: SQLite via Turso (serverless) for leads storage  
**Hosting**: Static deployment on Vercel/Netlify/Cloudflare  
**Styling**: CSS Modules with CSS variables for theming  

Architecture follows Container/Presentational pattern:
- Static pages (Homepage, Storia, Contatti) ship zero JS
- Interactive islands (filter/search, newsletter) hydrate on demand
- Nano Stores handle client-side state for filtering and cart

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/pages/` | New | Homepage, catalog routes, storia, contatti |
| `src/components/` | New | Layout, UI primitives, catalog components, islands |
| `src/stores/` | New | catalogStore, filterStore for product filtering |
| `src/data/` | New | catalog.json, categories.json with initial product data |
| `src/styles/` | New | CSS variables for "Modern Heritage" theme |
| `src/api/` | New | Serverless endpoints for newsletter signup |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| No high-quality product photography | Medium | Use placeholders initially, plan photo shoot |
| Content management without CMS | Medium | Use Markdown files, plan for future CMS integration |
| SEO competition in Bergamo | Low | Focus on local SEO, structured data, fast load times |

## Rollback Plan

- Rollback via git: `git revert HEAD && git push --force`
- Database rollback: Turso provides point-in-time restore
- Hosting: Static sites allow instant rollback via deploy rollback

## Dependencies

- None - greenfield project

## Success Criteria

- [ ] Homepage loads in < 2 seconds (Lighthouse score > 90)
- [ ] Product catalog displays all 3 categories with working filters
- [ ] Search returns relevant products within 100ms
- [ ] Newsletter form captures email and stores in database
- [ ] Storia page displays timeline and at least 3 vintage photos
- [ ] Mobile-responsive down to 320px width
- [ ] Lighthouse SEO score > 95