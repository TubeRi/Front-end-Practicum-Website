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
- `/login`: login/signup UI only. `/account` redirects here until authentication exists.
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
