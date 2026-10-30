# TravelPoint

TravelPoint is a travel website built with **React, Vite and Tailwind CSS**. Users can explore destinations, create an account, manage their profile, book trips, write reviews and make **Stripe test payments**. No real money is charged or real travel reservation made.

## Technologies

| Technology | Role |
| --- | --- |
| React + React Router | Components, interface state and page navigation |
| Vite + Tailwind CSS | Development/build tools and styling |
| Node.js + Express | Backend server and API routes |
| PostgreSQL + Neon | Persistent database and hosting |
| Better Auth | Signup, login, password hashing and sessions |
| Zod | Request validation |
| Stripe | Hosted test checkout and payment confirmation |
| Netlify | Frontend hosting and backend functions |

## Project structure

```text
src/
  main.jsx          Mounts React and shared providers
  App.jsx           Routes and shared layout
  pages/            Website pages
  components/       Reusable interface sections
  context/          Shared authentication, catalog and account state
  services/         API request functions
server/
  index.js          Starts the local backend
  app.js            Main API routes, validation and access checks
  auth.js           Better Auth configuration
  db.js             PostgreSQL connection pool
  config.js         Environment settings
  payments.js       Checkout, order lookup and Stripe webhook
  schema.sql        Application database tables
  migrate.js        Applies authentication and application schema
  seed.js           Loads sample catalog and editorial stories
  tests/            Backend integration tests
netlify/functions/api.mjs   Deployed backend entry point
netlify.toml               Hosting and URL rewrites
```

## How the frontend and API work

`main.jsx` starts React. `App.jsx` selects a page from the URL and renders the shared header and footer. Pages combine smaller components. Props pass data to children, state stores changing values, and context shares data across the application. Tailwind classes style the components.

The frontend calls the backend through `src/services/integrations.js`:

```text
React component → /api request → Express → PostgreSQL
React updates  ← JSON response ← Express ← stored data
```

For example, `GET /api/destinations` reads the catalog from PostgreSQL. React stores the returned objects in context and renders destination cards. The seed arrays initialize the database; the frontend reads the real API.

Express validates input with Zod, checks access and runs parameterized SQL queries. Protected routes use the user ID from the verified session, so users cannot access someone else's private records by sending a different ID.

## Authentication and database

Better Auth handles signup, login, password hashing and cookie sessions. The browser sends its session cookie with API requests. The backend verifies it before returning private data. `AuthContext` restores signed-in state on refresh; signing out revokes the session.

| Tables | Stored data |
| --- | --- |
| `user`, `account`, `session`, `verification` | Better Auth records |
| `destinations`, `departures` | Catalog, prices and available dates |
| `profiles`, `payment_preferences` | User details and payment nicknames; no card numbers |
| `bookings` | User-owned trip requests, travelers, dates and status |
| `reviews` | Reviews, ratings, authors and server posting dates |
| `orders`, `order_items` | Payment status and purchased items with price snapshots in cents |

Foreign keys link records together. Data remains after logout or refresh. Users can publish reviews and delete their own non-editorial reviews.

## Stripe payment flow

1. The signed-in user creates a booking. The backend checks availability and calculates its price from the database.
2. `POST /api/checkout` verifies ownership, creates or reuses a pending order, and starts Stripe Checkout.
3. The browser opens Stripe's hosted payment page.
4. Stripe calls `/api/stripe/webhook`. The backend verifies the signature and checks the order, user, amount and currency.
5. **Only the verified webhook marks the order paid.** The success page reads the order from the API and retries briefly while confirmation is pending.

The webhook receives the raw request body before JSON parsing, which is required for signature verification. Repeated requests and webhook events are handled without duplicating orders or paid updates. Only Stripe test keys are accepted.

## Main API routes

| Route | Purpose |
| --- | --- |
| `GET /api/health` | Check database connectivity |
| `GET /api/destinations` | Public catalog |
| `GET /api/reviews` | Public stories wall |
| `/api/auth/*` | Signup, login, session and logout |
| `GET /api/account` | Current user's profile, trips and reviews |
| `PUT /api/profile` | Save own profile |
| `POST /api/bookings` | Save an unpaid booking |
| `POST /api/checkout` | Start test checkout |
| `GET /api/orders/:id` | Read own order status |
| `POST /api/stripe/webhook` | Process signed Stripe events |
| `POST /api/reviews` | Publish a review |
| `DELETE /api/reviews/:id` | Delete own review |
| `/api/payment-preferences` | Add, select or remove payment nicknames |

## Run locally

Use Node.js 22.12+; Node 24 is recommended.

1. Run `npm install`.
2. Create a Neon PostgreSQL database and put its connection string in a root `.env` file.
3. Configure `DATABASE_URL`, `BETTER_AUTH_SECRET` (at least 32 random characters), and `APP_ORIGIN=http://localhost:5173`.
4. For payments, also set `STRIPE_SECRET_KEY` (`sk_test_...`) and the matching `STRIPE_WEBHOOK_SECRET` (`whsec_...`).
5. Run `npm run db:setup`, then `npm run dev`.
6. Open `http://localhost:5173` through Vite, rather than Live Server.

Keep `.env` private and uncommitted. Never prefix server secrets with `VITE_`.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start frontend and API |
| `npm run db:setup` | Apply schema and seed sample data |
| `npm run db:migrate` | Apply schema without seeding |
| `npm test` | Run backend integration tests |
| `npm run build` | Build frontend and copy images |
| `npm start` | Run standalone backend and built frontend |

## Deployment and testing

Locally, Vite forwards `/api` requests to Express on port 4000. On Netlify, `/api/*` goes to the backend function, while page routes go to React's `index.html`.

Set production environment variables with Functions access, use the public HTTPS origin for `APP_ORIGIN`, and redeploy after changing settings. Database migrations run separately from the frontend build.

Automated tests cover authentication, ownership, bookings, reviews and payment rules using a disposable database and mocked Stripe session calls. To verify the complete deployed flow, make a test-card purchase and confirm that the webhook, success page and database all show paid.

Payment preferences are nicknames, not saved Stripe cards. Email delivery and real supplier reservations are not connected.

More instructions: [Netlify setup](NETLIFY-SETUP.md) · [Stripe setup](STRIPE-SETUP.md)
