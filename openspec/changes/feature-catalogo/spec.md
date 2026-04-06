# Delta Spec: Feature Catalogo

## Overview

This delta spec covers 5 new capabilities for the La Salumeria Silvio web platform.

## ADDED Requirements

### Requirement: Product Catalog Capability

**Scope**: New capability - see `specs/product-catalog/spec.md`

The system MUST provide an interactive product catalog enabling customers to browse products by category (Gastronomia, Salumeria, Rosticceria), filter by attributes, and search in real-time.

#### Scenario: Category Navigation
- GIVEN user is on catalog page
- WHEN user clicks a category tab
- THEN only products from that category SHALL be displayed

#### Scenario: Search Functionality
- GIVEN user types in search input
- THEN results SHALL update within 100ms
- AND match product name or description

### Requirement: Product Detail Capability

**Scope**: New capability - see `specs/product-detail/spec.md`

The system MUST provide individual product pages with full information, image gallery, and related products.

### Requirement: History Section Capability

**Scope**: New capability - see `specs/history-section/spec.md`

The system MUST display the family legacy story since 1963 with timeline milestones and vintage photo gallery.

### Requirement: Newsletter Signup Capability

**Scope**: New capability - see `specs/newsletter-signup/spec.md`

The system MUST provide email capture with double opt-in confirmation flow.

#### Scenario: Double Opt-In Flow
- GIVEN user submits valid email
- THEN confirmation email SHALL be sent
- AND subscription remains pending until confirmed

### Requirement: Leads Admin Capability

**Scope**: New capability - see `specs/leads-admin/spec.md`

The system MUST provide authenticated admin panel for viewing and managing newsletter subscribers.

## Non-Functional Requirements

### Performance
- Homepage MUST load in < 2 seconds
- Search SHALL return results within 100ms
- Lighthouse performance score > 90

### SEO
- Page titles and meta descriptions for all catalog pages
- Structured data for products (Schema.org)
- Lighthouse SEO score > 95

### Accessibility
- All interactive elements keyboard accessible
- Alt text for all images
- Lighthouse accessibility score > 90

### Responsive
- Mobile-first design
- Breakpoints: 640px (tablet), 1024px (desktop)
- Support viewport down to 320px width

## Data Models

### Product
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  category: 'gastronomia' | 'salumeria' | 'rosticceria';
  price?: number;
  image: string;
  attributes?: string[];
  featured?: boolean;
}
```

### Lead
```typescript
interface Lead {
  id: string;
  email: string;
  status: 'pending' | 'active' | 'unsubscribed';
  subscribedAt?: Date;
  confirmedAt?: Date;
  unsubscribeToken: string;
  confirmationToken: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

| Capability | Method | Path |
|------------|--------|------|
| newsletter-signup | POST | /api/newsletter/subscribe |
| newsletter-signup | GET | /api/newsletter/confirm |
| newsletter-signup | GET | /api/newsletter/unsubscribe |
| leads-admin | GET | /api/admin/leads |
| leads-admin | GET | /api/admin/leads/:id |
| leads-admin | POST | /api/admin/leads/:id/confirm |
| leads-admin | DELETE | /api/admin/leads/:id |
| leads-admin | GET | /api/admin/leads/export |

## Dependencies

- Astro 5.x with React integration
- TypeScript
- Nano Stores for client state
- Turso (SQLite) for leads storage

## Acceptance Criteria Summary

- [ ] All 3 categories display correct products
- [ ] Search returns results within 100ms
- [ ] Product detail pages render correctly
- [ ] Timeline displays 5+ milestones
- [ ] Vintage photo gallery with lightbox
- [ ] Newsletter form validates and stores leads
- [ ] Double opt-in confirmation flow works
- [ ] Admin panel displays leads table
- [ ] Performance: Lighthouse > 90
- [ ] SEO: Lighthouse > 95
- [ ] Accessibility: Lighthouse > 90
- [ ] Responsive down to 320px
