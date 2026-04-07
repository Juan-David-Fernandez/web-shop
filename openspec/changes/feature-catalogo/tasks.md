# Tasks: Feature Catalogo

## Phase 1: Foundation / Infrastructure

- [x] 1.1 Create Product type interface in src/types/catalog.ts matching spec requirements
- [x] 1.2 Create Lead type interface in src/types/auth.ts matching spec requirements
- [x] 1.3 Create TimelineEvent and VintagePhoto interfaces in src/types/history.ts
- [x] 1.4 Set up Nano Store for catalog state in src/stores/catalogStore.ts with loadCatalog function
- [x] 1.5 Set up Nano Store for leads state in src/stores/leadsStore.ts with CRUD operations
- [x] 1.6 Create placeholder Image component src/shared/ImagePlaceholder.astro per technical design
- [x] 1.7 Set up basic CSS Modules structure with variables and breakpoints per technical design
- [x] 1.8 Create mock data files: src/data/catalog.json and src/data/categories.json
- [x] 1.9 Set up API route handlers for newsletter endpoints in src/pages/api/newsletter/
- [x] 1.10 Set up API route handlers for admin leads endpoints in src/pages/api/admin/leads/

## Phase 2: Core Implementation

### Product Catalog
- [x] 2.1 Create ProductGrid component src/components/catalog/ProductGrid.astro with store subscription
- [x] 2.2 Create ProductCard component src/components/catalog/ProductCard.astro with placeholder handling
- [x] 2.3 Create FilterPanel component src/components/catalog/FilterPanel.astro for category/tabs filtering
- [x] 2.4 Create SearchInput component src/components/catalog/SearchInput.astro with real-time filtering
- [x] 2.5 Implement category tab navigation logic for Gastronomia, Salumeria, Rosticceria, Tutti
- [x] 2.6 Implement search functionality with 100ms update requirement
- [x] 2.7 Create responsive grid layout (1/2/3 columns) using CSS Modules breakpoints

### Product Detail
- [x] 2.8 Create ProductDetail component src/components/catalog/ProductDetail.astro
- [x] 2.9 Implement image gallery with main image and thumbnails
- [x] 2.10 Create breadcrumb navigation component src/components/shared/Breadcrumb.astro
- [x] 2.11 Implement related products section (up to 3 from same category)
- [x] 2.12 Create 404 error page src/pages/404.astro for product not found
- [x] 2.13 Implement back-to-catalog link with filter preservation logic

### History Section
- [x] 2.14 Create Historia page src/pages/storia.astro
- [x] 2.15 Create Timeline component src/components/history/Timeline.astro
- [x] 2.16 Create VintagePhotoGallery component src/components/history/VintagePhotoGallery.astro
- [x] 2.17 Implement lightbox functionality for photo gallery
- [x] 2.18 Add family legacy narrative content mentioning founding year 1963
- [x] 2.19 Ensure all vintage photos have descriptive alt text with year when known
- [x] 2.20 Implement responsive layout for timeline (vertical on mobile, horizontal on desktop)

### Newsletter Signup
- [x] 2.21 Create NewsletterForm component src/components/newsletter/NewsletterForm.astro
- [x] 2.22 Implement email validation (format, required field)
- [x] 2.23 Implement double opt-in flow: store pending lead, send confirmation email
- [x] 2.24 Create confirmation page src/pages/newsletter/confirm/[token].astro
- [x] 2.25 Create unsubscribe page src/pages/newsletter/unsubscribe/[token].astro
- [x] 2.26 Handle duplicate email scenarios (active, pending, unsubscribed)
- [x] 2.27 Add privacy notice with link to privacy policy
- [x] 2.28 Implement success/error messaging for all scenarios

### Leads Admin
- [x] 2.29 Create admin login page src/pages/account/login.astro
- [x] 2.30 Create admin dashboard wrapper src/pages/account/admin/index.astro
- [x] 2.31 Create LeadsTable component src/components/admin/LeadsTable.astro
- [x] 2.32 Implement authentication check using authStore for admin routes
- [x] 2.33 Implement leads table with sorting, pagination (>20 leads), and status filtering
- [x] 2.34 Create lead detail view modal/component
- [x] 2.35 Implement manual lead confirmation action
- [x] 2.36 Implement lead deletion with confirmation dialog
- [x] 2.37 Implement CSV export functionality for leads
- [x] 2.38 Set up environment variable handling for admin credentials

## Phase 3: Integration / Wiring

- [x] 3.1 Set up routing for catalog pages: src/pages/catalog/index.astro, [category].astro, [slug].astro
- [x] 3.2 Connect ProductGrid to catalogStore and filterStore for derived state
- [x] 3.3 Wire up category navigation to update URL and filter state
- [x] 3.4 Wire up search input to update filter state in real-time
- [x] 3.5 Connect ProductDetail to catalogStore via slug parameter
- [x] 3.6 Wire up breadcrumb navigation to reflect current category and product
- [x] 3.7 Connect related products to display items from same category
- [x] 3.8 Wire up Historia page to load timeline and photo data
- [x] 3.9 Connect newsletter form to API endpoints for subscription
- [x] 3.10 Wire up confirmation and unsubscribe pages to validate tokens
- [x] 3.11 Connect admin leads table to leadsStore API endpoints
- [x] 3.12 Implement proper loading states and error boundaries
- [x] 3.13 Add meta tags and structured data for SEO (Schema.org for products)
- [x] 3.14 Ensure all interactive elements are keyboard accessible

## Phase 4: Testing / Verification

- [x] 4.1 Verify all three categories display correct products when selected (spec scenario)
- [x] 4.2 Test search returns results within 100ms with various inputs
- [x] 4.3 Test empty search state shows "Nessun prodotto trovato" message
- [x] 4.4 Verify product cards link to correct detail pages
- [x] 4.5 Test grid layout responds correctly at all breakpoints (320px, 640px, 1024px)
- [x] 4.6 Verify product detail page displays name, description, category, price, image
- [x] 4.7 Test image gallery functionality with multiple images
- [x] 4.8 Verify breadcrumb navigation shows correct path and is clickable
- [x] 4.9 Test related products display when available (same category)
- [x] 4.10 Verify 404 page shows for invalid product URLs with "Prodotto non trovato" message
- [x] 4.11 Test history section displays at least 5 milestone events in chronological order
- [x] 4.12 Verify at least 3 vintage photos are displayed with captions
- [x] 4.13 Test photo lightbox opens/closes correctly with escape and outside click
- [x] 4.14 Validate legacy narrative mentions founding year 1963 and traditional values
- [x] 4.15 Test newsletter form validates email and shows appropriate errors
- [x] 4.16 Verify confirmation email is sent on valid submit (mock implementation)
- [x] 4.17 Test confirmation link activates subscription and shows success message
- [x] 4.18 Verify invalid/expired token shows appropriate error message
- [x] 4.19 Test duplicate email handling for all three scenarios (active, pending, unsubscribed)
- [x] 4.20 Verify unsubscribe functionality works correctly
- [x] 4.21 Confirm privacy notice is visible on newsletter form
- [x] 4.22 Test admin panel requires authentication and redirects unauthenticated users
- [x] 4.23 Verify leads table displays all subscriber data with correct columns
- [x] 4.24 Test table sorting, filtering by status, and search by email
- [x] 4.25 Verify lead details are viewable in modal/detail view
- [x] 4.26 Test admin can manually confirm pending leads
- [x] 4.27 Verify admin can delete leads with confirmation
- [x] 4.28 Test CSV export generates valid file with correct columns
- [x] 4.29 Verify invalid login shows error message and keeps user on login page
- [x] 4.30 Run Lighthouse audits: Performance > 90, SEO > 95, Accessibility > 90

## Phase 5: Cleanup / Documentation

- [ ] 5.1 Remove any temporary code or console.log statements
- [ ] 5.2 Ensure all components have proper PropTypes/TypeScript interfaces
- [ ] 5.3 Add JSDoc comments to complex functions and components
- [ ] 5.4 Verify all images have appropriate alt text
- [ ] 5.5 Check for and fix any console warnings or errors
- [ ] 5.6 Update README.md with feature catalog documentation if needed
- [ ] 5.7 Ensure all files follow consistent formatting (Prettier/ESLint)
- [ ] 5.8 Verify bundle size is reasonable for initial load

(End of file - total 125 lines)
