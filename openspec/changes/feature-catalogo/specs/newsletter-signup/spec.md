# Newsletter Signup Specification

## Purpose

Email capture system with double opt-in confirmation to build a subscriber list for marketing communications.

## Requirements

### Requirement: Email Collection Form

The system MUST provide a visible newsletter signup form with email input field and submit button.

#### Scenario: Submit valid email

- GIVEN user enters a valid email address in the signup form
- WHEN user clicks "Iscriviti" button
- THEN system SHALL validate email format
- AND if valid, system SHALL store pending subscription in database
- AND system SHALL send confirmation email to user
- AND success message SHALL display "Controlla la tua email per confermare l'iscrizione"

#### Scenario: Submit invalid email

- GIVEN user enters an invalid email address (e.g., "notanemail")
- WHEN user clicks submit
- THEN error message SHALL display "Inserisci un indirizzo email valido"
- AND form SHALL remain visible for correction

#### Scenario: Submit empty email

- GIVEN user submits form without entering email
- WHEN user clicks submit
- THEN error message SHALL display "L'email è obbligatoria"
- AND form SHALL not submit

### Requirement: Double Opt-In Confirmation

The system MUST require email verification before activating subscription.

#### Scenario: Confirmation email sent

- GIVEN user submits valid email
- THEN system SHALL send confirmation email with unique token
- AND email SHALL contain link to /newsletter/confirm?token={unique-token}
- AND email SHALL be sent from noreply@lasalumeriasilvio.it (or similar)

#### Scenario: User confirms email

- GIVEN user receives confirmation email and clicks link
- WHEN user navigates to confirmation URL
- THEN system SHALL validate token
- AND if valid, subscription SHALL be marked as active in database
- AND success page SHALL display "Iscrizione confermata! Grazie per esserti iscritto"

#### Scenario: Invalid or expired token

- GIVEN user visits confirmation URL with invalid/expired token
- THEN error page SHALL display "Link di conferma non valido o scaduto"
- AND user SHALL be offered option to request new confirmation email

#### Scenario: User ignores confirmation email

- GIVEN user receives but does not confirm
- THEN subscription SHALL remain pending (not active)
- AND no marketing emails SHALL be sent

### Requirement: Duplicate Email Handling

The system MUST handle duplicate subscription attempts gracefully.

#### Scenario: Email already subscribed

- GIVEN user attempts to subscribe with email that already exists
- THEN system SHALL check subscription status:
  - If active: display "Sei già iscritto alla newsletter!"
  - If pending: display "H già richiesto la conferma. Controlla la tua email."
  - If unsubscribed: reactivate and send new confirmation

### Requirement: Unsubscribe Capability

The system MUST provide a way for subscribers to unsubscribe from newsletters.

#### Scenario: Unsubscribe via link

- GIVEN user receives newsletter email
- WHEN user clicks unsubscribe link
- THEN user SHALL be redirected to /newsletter/unsubscribe?token={token}
- AND system SHALL mark subscription as unsubscribed
- AND confirmation message SHALL display "Iscrizione cancellata"

### Requirement: Privacy Compliance

The system MUST comply with privacy regulations (GDPR-style).

#### Scenario: Privacy notice displayed

- GIVEN user views newsletter form
- THEN privacy notice SHALL be visible near form
- AND notice SHALL state "I tuoi dati saranno trattati secondo la nostra Privacy Policy"
- AND link to privacy policy SHALL be provided

## Data Model

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

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/newsletter/subscribe | Submit email for signup |
| GET | /api/newsletter/confirm | Confirm subscription via token |
| GET | /api/newsletter/unsubscribe | Unsubscribe via token |

## Acceptance Criteria

- [ ] Valid email submits successfully
- [ ] Invalid email shows validation error
- [ ] Confirmation email is sent on submit
- [ ] Confirmation link activates subscription
- [ ] Invalid token shows appropriate error
- [ ] Duplicate email handled gracefully
- [ ] Unsubscribe works correctly
- [ ] Privacy notice is visible on form
- [ ] Form is accessible (keyboard navigation, screen reader)
