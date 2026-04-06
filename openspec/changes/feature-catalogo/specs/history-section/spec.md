# History Section Specification

## Purpose

Storytelling section showcasing the family legacy since 1963, featuring timeline and vintage photos.

## Requirements

### Requirement: Timeline Display

The system MUST display a chronological timeline of key family moments from 1963 to present.

#### Scenario: View timeline

- GIVEN user navigates to /storia
- THEN timeline SHALL display at least 5 milestone events
- AND each event SHALL show: year, title, and brief description
- AND events SHALL be ordered chronologically (oldest first)

#### Scenario: Timeline milestone events

- GIVEN timeline data includes "1963 - Fondazione" (founding)
- THEN this event SHALL appear first in the timeline
- AND subsequent events SHALL follow in chronological order

### Requirement: Vintage Photo Gallery

The system MUST display at least 3 vintage photographs from the shop's history.

#### Scenario: View photo gallery

- GIVEN user is on storia page
- THEN at least 3 historical photos SHALL be displayed
- AND each photo SHALL have a caption describing the scene/year
- AND photos SHALL be captioned in Italian

#### Scenario: Photo lightbox

- GIVEN user clicks on a vintage photo
- THEN a lightbox modal SHALL open
- AND full-size image SHALL be displayed
- AND caption SHALL remain visible
- AND clicking outside or pressing Escape SHALL close the lightbox

### Requirement: Family Legacy Content

The system MUST display written content describing the family's history, traditions, and values.

#### Scenario: View legacy story

- GIVEN user visits /storia
- THEN page SHALL contain narrative content about the family's history
- AND content SHALL mention the founding year (1963)
- AND content SHALL describe the traditional values (qualità, tradizione, passione)

### Requirement: Responsive Layout

The system SHALL adapt the timeline and gallery layout for mobile viewing.

#### Scenario: Timeline on mobile

- GIVEN user views storia page on mobile (< 640px)
- THEN timeline SHALL display vertically
- AND photos SHALL stack in single column

#### Scenario: Timeline on desktop

- GIVEN user views storia page on desktop (> 1024px)
- THEN timeline MAY display horizontally
- AND photos SHALL display in 2-3 column grid

### Requirement: Alt Text Accessibility

The system MUST provide descriptive alt text for all vintage photos for accessibility.

#### Scenario: Photo alt text

- GIVEN a vintage photo is rendered
- THEN alt attribute SHALL describe the photo content
- AND alt text SHALL include the year if known (e.g., "Foto del negozio nel 1975")

## Data Model

```typescript
interface TimelineEvent {
  year: number;
  title: string;
  description: string;
}

interface VintagePhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  year?: number;
}
```

## Acceptance Criteria

- [ ] Timeline displays at least 5 milestone events
- [ ] Events are in chronological order
- [ ] At least 3 vintage photos are displayed
- [ ] Photo lightbox opens and closes correctly
- [ ] Legacy narrative is present and mentions 1963
- [ ] Page is responsive on mobile
- [ ] All photos have descriptive alt text
- [ ] Lighthouse accessibility score > 90
