# Leads Admin Specification

## Purpose

Admin panel for viewing and managing newsletter subscribers/leads.

## Requirements

### Requirement: Admin Authentication

The system MUST restrict access to the admin panel to authorized users.

#### Scenario: Access admin panel

- GIVEN user navigates to /admin/leads
- THEN system SHALL check for valid admin session/token
- AND if not authenticated, user SHALL be redirected to /admin/login

#### Scenario: Failed login attempt

- GIVEN user submits invalid credentials
- THEN error message SHALL display "Credenziali non valide"
- AND user SHALL remain on login page

### Requirement: Leads List View

The system MUST display a table of all newsletter subscribers with their details.

#### Scenario: View leads table

- GIVEN user is authenticated and accesses /admin/leads
- THEN table SHALL display: email, status, subscribed date, confirmed date
- AND table SHALL be sortable by each column
- AND pagination SHALL be available if > 20 leads

#### Scenario: Filter leads by status

- GIVEN user is viewing leads table
- WHEN user selects a status filter (e.g., "Attivi")
- THEN only leads with that status SHALL be displayed
- AND filter options SHALL include: tutti, attivi, pendenti, cancellati

#### Scenario: Search leads

- GIVEN user types in search input
- THEN table SHALL filter by email matching the search term
- AND search SHALL be case-insensitive

### Requirement: Lead Detail View

The system MUST allow viewing full details of an individual lead.

#### Scenario: View lead details

- GIVEN user clicks on a lead row in table
- THEN modal or detail view SHALL display all lead fields
- AND user SHALL see: email, status, timestamps, tokens (masked)

### Requirement: Lead Actions

The system SHOULD allow admins to perform actions on leads.

#### Scenario: Manually confirm lead

- GIVEN admin views a lead with status "pending"
- WHEN admin clicks "Conferma manualmente"
- THEN lead status SHALL change to "active"
- AND confirmation date SHALL be set to current timestamp

#### Scenario: Delete lead

- GIVEN admin views a lead
- WHEN admin clicks "Elimina"
- THEN confirmation dialog SHALL appear
- AND if confirmed, lead SHALL be removed from database

#### Scenario: Export leads

- GIVEN admin clicks "Esporta" button
- THEN CSV file SHALL be downloaded with all leads data
- AND file SHALL include: email, status, subscribedAt, confirmedAt

### Requirement: Basic Auth Credentials

The system MUST use environment variables for admin credentials.

#### Scenario: Environment configuration

- GIVEN application runs in production
- THEN admin credentials SHALL be read from environment variables (ADMIN_EMAIL, ADMIN_PASSWORD_HASH)
- AND credentials SHALL NOT be hardcoded

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/admin/leads | List all leads (auth required) |
| GET | /api/admin/leads/:id | Get single lead details |
| POST | /api/admin/leads/:id/confirm | Manually confirm lead |
| DELETE | /api/admin/leads/:id | Delete a lead |
| GET | /api/admin/leads/export | Export leads as CSV |

## Acceptance Criteria

- [ ] Admin panel requires authentication
- [ ] Leads table displays all subscriber data
- [ ] Table is sortable and filterable
- [ ] Search filters by email
- [ ] Lead details are viewable
- [ ] Admin can manually confirm pending leads
- [ ] Admin can delete leads
- [ ] Export generates valid CSV
- [ ] Invalid login shows error message
- [ ] Session expires after inactivity
