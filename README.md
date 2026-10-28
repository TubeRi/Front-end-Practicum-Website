# TravelPoint

Travel agency course project using React, Vite, Tailwind CSS, React Router, Express, PostgreSQL, and Better Auth. The frontend keeps the existing design. Accounts, profile details, booking requests, payment preferences, and reviews now use the backend.

## First setup

Use Node.js 22.12+ (Node 24 recommended).

1. Install dependencies with npm install.
2. Create a free project in https://console.neon.tech (or use another PostgreSQL provider). Select its connection dialog and copy the PostgreSQL connection string. Never share it publicly.
3. Copy .env.example to .env **only if .env does not already exist**. A local .env with a generated authentication secret may already be present. Fill DATABASE_URL with the actual connection string, retaining the provider's TLS options. Keep APP_ORIGIN=http://localhost:5173 for local development. Generate a secret if needed with node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))" and save it as BETTER_AUTH_SECRET.
4. Run npm run db:setup. This creates Better Auth's tables, the application schema, and seeds the catalog and editorial testimonials. Running it again preserves accounts, bookings, and user reviews.
5. Run npm run dev. This starts the API on port 4000 and Vite on http://localhost:5173. Use this address, not Live Server or a directly opened dist/index.html.
6. Open Log in, choose Create account, and register your own account. The previous temporary admin credentials have been removed. No shared administrator account is built in.

.env and .env.* are ignored by Git, except .env.example. DATABASE_URL and BETTER_AUTH_SECRET are server-only: never prefix them with VITE_, which exposes values to the browser. No real hosted database has been provisioned until the connection is supplied and db:setup succeeds.

## Commands

| Command | Purpose |
| --- | --- |
| npm run dev | Run API and frontend together |
| npm run dev:client | Frontend only; requires a running API |
| npm run dev:server | Backend with restart on changes |
| npm run db:setup | Create schema and seed PostgreSQL |
| npm run build | Build React into dist/ |
| npm start | Serve the built frontend and API together |
| npm test | Integration checks with a disposable local PostgreSQL engine |

For production, build first and set NODE_ENV=production, APP_ORIGIN to the site's HTTPS origin, PORT to the backend port, and the server secrets in the host's environment. Serve through an HTTPS reverse proxy forwarding /api, /images, assets, and page routes to this server. The default server binds to localhost; configure HOST=0.0.0.0 when required by your hosting service. Set proxy trust only for your actual trusted proxy; do not blindly trust forwarded headers. Configure per-IP auth limits for your hosting arrangement before public launch. npm run preview only previews static assets and does not provide the backend.

## Project structure and rendering

- src/main.jsx mounts React and wraps the app in BrowserRouter, AuthProvider, AccountProvider, CatalogProvider, and ReviewsProvider.
- src/App.jsx selects a page using the URL and renders the shared Header and Footer. Home composes Hero, DestinationPicker, and MainContent.
- src/context/AuthContext.jsx restores the server session on refresh. Login/signup call Better Auth; logout revokes the session. RequireAuth waits for session loading and redirects guests to login with a safe internal return URL.
- src/context/CatalogContext.jsx loads destination objects from GET /api/destinations. Cards, the home grid, and the country picker use that shared response, rather than importing hardcoded JSX/data arrays.
- src/components/DestinationGrid.jsx owns category, search, duration and sorting state. Each DestinationCard reuses the controlled QuantityStepper.
- src/context/AccountContext.jsx loads only the signed-in user's profile, trips, payment preferences and reviews. ProfileForm, TripHistory, PaymentPreferences, and MyReviews each handle one section.
- src/context/ReviewsContext.jsx loads the public review wall. A successful submission adds the server's review immediately and refreshes the personal account data. The form is entirely hidden for guests.
- src/services/integrations.js is the shared fetch boundary. Cookies travel with requests; passwords/session tokens are not put in localStorage or sessionStorage.
- src/index.css and Tailwind utility classes provide the styling. Vite proxies /api and /images to the backend during development.
- server/app.js contains the JSON routes, validation, access control and static serving.
- server/auth.js configures Better Auth email/password authentication and seven-day sessions.
- server/schema.sql defines the application tables. server/migrate.js runs the authentication library migrations first.
- server/seed-data/ holds the original destination and editorial testimonial arrays, used only by server/seed.js. The first six photos remain in the existing photo folder and are served at /images. Future sample departures are added for next year so the sample catalog remains bookable.

## Database tables

| Table | Stored information |
| --- | --- |
| user, account, session, verification | Better Auth owns accounts, password hashes, sessions and verification records |
| destinations | Catalog descriptions, photos, categories, prices, durations |
| departures | Available dates for each destination |
| profiles | Address, hobbies, travel style and other personal details, linked to user |
| bookings | User, destination, dates, traveler count, trusted total, contact details, unpaid status and payment preference nickname |
| payment_preferences | User-owned payment type/nickname and preferred choice; no card numbers or bank credentials |
| reviews | Public name, rating, review and server posting date, linked to the author's account; original editorial entries have no account owner |

Foreign keys link records to users. SQL values are parameterized. The backend derives ownership from the verified session rather than a user ID supplied by the browser. Prices and trip length come from the database, and only available future departures can be requested. Repeating a booking request with the same request ID does not duplicate it. Original editorial testimonials remain distinct from new user reviews.

## API routes

| Method and route | Access / behavior |
| --- | --- |
| GET /api/health | Database connectivity status |
| GET /api/destinations | Public JSON catalog and categories |
| GET /api/reviews | Public editorial stories and user reviews |
| POST /api/auth/sign-up/email | Register and sign in |
| POST /api/auth/sign-in/email | Email/password login |
| GET /api/auth/get-session | Restore current signed-in state |
| POST /api/auth/sign-out | Revoke session |
| GET /api/account | Current user's profile, trips, preferences and reviews |
| PUT /api/profile | Save current user's details |
| POST /api/bookings | Save an unpaid booking request |
| POST /api/reviews | Publish a review linked to the current user |
| POST /api/payment-preferences | Add a method type and nickname |
| PUT /api/payment-preferences/:id/default | Select own preferred method |
| DELETE /api/payment-preferences/:id | Remove own preference |

All custom writes require the configured same-origin request. Authenticated routes return 401 for guests. Cookie sessions are managed by Better Auth; production requires HTTPS. Responses containing account data are not cached.

## What persists and what is not connected

Refresh or sign out and sign back in: your profile, bookings, payment preferences and reviews are read back from PostgreSQL. Your reviews remain on the public Stories wall and are also shown in My reviews. Upcoming and past trips are grouped by trip end date in Europe/Vilnius. Displayed review dates use that same timezone; creation timestamps come from the server.

Bookings are stored as **unpaid booking requests**, not supplier-confirmed reservations. No payment provider, card tokenization, charge, booking email, password-reset email, or email verification delivery is configured. Payment preferences are only method names and nicknames. The separate trip-ideas planner still creates an unsaved planning summary; use a destination's booking button to save a trip.

## Verification

npm test exercises real Better Auth signup, password hashing, failed login, sessions, logout/relogin, idempotent seeding, JSON catalog, profile persistence, booking idempotency, server-calculated prices, rejected past dates, public review persistence and server timestamps, guest rejection, origin checks, and isolation between two users. It uses PGlite, a disposable local PostgreSQL engine, through a test-only adapter. This does not prove a hosted Neon connection: run db:setup and the application against your actual DATABASE_URL to verify that deployment.

Browser QA may use server/tests/browser-server.js for an explicitly disposable test API. It is never used by npm run dev or npm start and all its data disappears when stopped.
