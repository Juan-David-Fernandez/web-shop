# Product Catalog Specification

## Purpose

Interactive catalog enabling customers to browse products by category, filter by type, and search by name/description.

## Requirements

### Requirement: Category Browsing

The system MUST display products organized into three primary categories: Gastronomia, Salumeria, and Rosticceria.

#### Scenario: View all products in a category

- GIVEN user is on the catalog page
- WHEN user clicks a category tab (e.g., "Salumeria")
- THEN only products belonging to that category SHALL be displayed
- AND the category tab SHALL appear active/highlighted

#### Scenario: View all products without filtering

- GIVEN user is on the catalog page
- WHEN user clicks "Tutti" (All) tab
- THEN all products from all categories SHALL be displayed

### Requirement: Product Filtering

The system SHOULD allow filtering products by additional attributes (e.g., dietary restrictions, price range).

#### Scenario: Filter by attribute

- GIVEN products are displayed
- WHEN user selects a filter option (e.g., "Senza glutine")
- THEN only products matching that attribute SHALL be shown
- AND filter state SHALL persist during session

### Requirement: Product Search

The system MUST provide a search input that filters products by name and description in real-time.

#### Scenario: Search by product name

- GIVEN user types "prosciutto" in search input
- THEN products containing "prosciutto" in name OR description SHALL appear
- AND results SHALL update within 100ms of keystroke

#### Scenario: Search with no results

- GIVEN user searches for a term that doesn't match any product
- THEN a "Nessun prodotto trovato" message SHALL be displayed
- AND a clear search button SHALL be shown

### Requirement: Product Display

The system MUST display each product card with: name, short description, category badge, and placeholder image.

#### Scenario: View product card

- GIVEN products are loaded
- WHEN a product card is rendered
- THEN it SHALL show: product name, 1-2 line description, category label, and image thumbnail
- AND clicking the card SHALL navigate to product detail page

### Requirement: Responsive Layout

The system SHALL display products in a grid that adapts to viewport width: 1 column (mobile), 2 columns (tablet), 3 columns (desktop).

#### Scenario: Grid adapts to screen size

- GIVEN user views catalog on mobile device (< 640px)
- THEN products SHALL display in single column
- AND on desktop (> 1024px) products SHALL display in 3 columns

## Data Model

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

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}
```

## Acceptance Criteria

- [ ] All three categories display correct products when selected
- [ ] Search returns results within 100ms
- [ ] Empty search state shows appropriate message
- [ ] Product cards link to detail pages
- [ ] Grid layout responds correctly at all breakpoints
- [ ] Filters can be combined with search
