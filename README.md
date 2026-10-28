# TravelPoint

Travel agency frontend built with React, Vite, and Tailwind CSS. The interface follows the exported Figma Make design, adapted to React Router without Next.js or a CMS.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
npm run build
npm run preview
```

Edit `src/`; `dist/` is generated build output. Use the Vite address instead of Live Server.

## Frontend features

- Responsive shared navigation, homepage destination picker, and login/signup presentation.
- Searchable country list, date-range calendar, date flexibility, length-of-stay choices, adult/child counters.
- Ten local destination records with category/search/duration filtering, price/rating sorting, and empty states.
- Independent controlled traveler steppers with live euro totals and a booking summary dialog.
- Separate testimonial components and data, shared footer, and trip-planning dialog.

The first six photos use existing local assets. The hero and four new destination photos reference the URLs in the Figma source.

## Routes and structure

- `/`: `pages/Home.jsx`, composed of Hero, DestinationPicker, and MainContent.
- `/about`: home alias. `/#about` scrolls to the homepage introduction.
- `/destinations`: DestinationGrid, FilterBar, DestinationCard, QuantityStepper, and BookingModal.
- `/stories`: testimonial page.
- `/login`: login/signup UI only. `/account` is a protected personal profile with personal details, trips, and payment preferences.
- `src/data/`: destination and testimonial arrays.
- `src/services/integrations.js`: frontend-only integration boundaries.

Configure production hosting to fall back to `index.html` for application routes. If deploying under a subdirectory, adjust Vite base and router basename together.

## Backend integration points - deliberately unconnected

There are no server routes, database, CMS, account sessions, authentication provider, payments, or network submission calls in this project.

`src/services/integrations.js` names proposed endpoint contracts only:

| Adapter | Proposed future endpoint | Current behavior |
|---|---|---|
| `authenticate(mode, credentials)` | `/api/auth/login`, `/api/auth/signup` | Returns an explicit not-connected message; does not transmit or persist credentials |
| `requestBooking(details)` | `/api/bookings` | Returns a demo result; no reservation, email, payment, or storage |
| Trip planner boundary | `/api/trip-requests` | Planner currently creates an in-memory summary; no request is sent |

A future backend can replace the adapter internals after defining validation, authentication, error responses, and data contracts. These paths are placeholders, not functioning APIs.

Picker dates and flexibility are carried to the results as preferences, not claimed live availability. Duration filters use journey days minus one as nights. Demo totals use the same per-person price for adults and children; no age-specific fare service is connected. Figma's sample departure dates are preserved and labeled as sample dates in the booking dialog.

No personal form values are saved to localStorage, cookies, or a database.

## Login requirement for booking

Guests can browse and filter journeys, but must log in before opening `/book/:destinationId`. Card actions redirect to `/login?returnTo=...`, preserving the selected journey and traveler count. The login page returns to that route only when the authentication adapter returns `{ connected: true, user: { id, ... } }` after a verified login. Return targets are restricted to internal booking routes.

`AuthProvider` owns the in-memory frontend user state. The current authentication adapter always reports disconnected, so no one can proceed to booking in this frontend preview. There is no pretend login or localStorage authentication flag. Booking submission also rejects a missing user.

The future backend must verify its session and authorize every booking/payment request independently; React route guards are navigation behavior, not server-side security. Restore verified sessions through a backend adapter when authentication is connected. No payment or purchase backend is implemented.

## Login requirement for testimonials

Stories renders ReviewSection at the bottom only when AuthContext contains a user ID. Guests receive no form, review-section heading, or login reminder. The old /stories/write route redirects to /stories#write-review; it no longer offers a separate writing page.

Signed-in users can enter a display name, a rating from 1 to 5, and a review of 20-1,500 characters. Submission captures an ISO timestamp; previews display its date in the Europe/Vilnius timezone. That date stays attached to the preview rather than changing when read later. Display names do not establish account identity: the future backend must derive authorship from its verified session.

The unconnected requestTestimonial adapter returns only a demo result. Submitted reviews are immediately prepended to the Stories review grid with their name, rating, text, and submission date. There is no separate preview step. They remain in page state only; navigating away or refreshing discards them, and no server publication occurs. Authentication remains unconnected, so the section is currently hidden to all guests. A future backend must authorize and validate review submissions and supply its own trusted creation timestamp.

## Temporary demo admin - local development only

Run `npm run dev` and open `/login`.

- Email: `admin@travelpoint.test`
- Password: `TravelPointDemo!28`

These are public test credentials, not real secrets. The account is enabled only by Vite's development mode (`import.meta.env.DEV`), and is disabled in `npm run build` / `npm run preview`. It has no server privileges and unlocks only frontend booking/review previews. The login page shows the credentials while development mode is enabled.

A sessionStorage marker keeps the demo login across refreshes in that tab. Passwords are never saved. Use Log out in the header to clear the demo session; a new unrelated tab starts logged out. This explicitly requested demo mode is not security or real authentication. Production authentication still requires a backend.

## Personal profile and payment preferences

Logged-in users have a separate profile icon in the header linking to the protected `/account` page. The page contains editable name, address, contact details, hobbies, biography, and travel style; read-only authentication email; Upcoming and Past trip tabs; and payment preferences with add/remove/default actions.

AccountProvider owns this account's in-memory data, keyed by user ID. Data survives navigation but resets on refresh or logout and is not written to localStorage or a backend. Demo login itself can survive refresh independently. New sessions have empty trip history rather than invented bookings. Submitted booking demos append an explicitly unpaid request, grouped by trip end date relative to the current date in Europe/Vilnius.

Payment preferences contain only a method type and a nickname. Supported types are card, PayPal, Apple Pay, Google Pay, and bank transfer. No card numbers, CVV, bank credentials, or wallet credentials are collected. The preferred choice appears in the booking form and is recorded as a preference on a demo trip; it never marks a trip as paid. Actual payment-method tokenization and payment confirmation require a future payment provider/backend and are deliberately unconnected.
