CREATE TABLE IF NOT EXISTS destinations (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  price integer NOT NULL CHECK(price > 0),
  duration integer NOT NULL CHECK(duration > 0)
);
CREATE TABLE IF NOT EXISTS departures (
  destination_id text NOT NULL REFERENCES destinations(id),
  departure date NOT NULL,
  PRIMARY KEY(destination_id, departure)
);
CREATE TABLE IF NOT EXISTS profiles (
  user_id text PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  data jsonb NOT NULL DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS payment_preferences (
  id uuid PRIMARY KEY,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  type text NOT NULL,
  label text NOT NULL,
  preferred boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS one_preferred_payment ON payment_preferences(user_id) WHERE preferred;
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  destination_id text NOT NULL REFERENCES destinations(id),
  departure date NOT NULL,
  end_date date NOT NULL,
  travelers integer NOT NULL CHECK(travelers BETWEEN 1 AND 10),
  total integer NOT NULL CHECK(total > 0),
  customer_name text NOT NULL,
  contact_email text NOT NULL,
  payment_preference text NOT NULL,
  status text NOT NULL DEFAULT 'Booking request · unpaid',
  request_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, request_id),
  FOREIGN KEY(destination_id, departure) REFERENCES departures(destination_id, departure)
);
CREATE TABLE IF NOT EXISTS reviews (
  id text PRIMARY KEY,
  user_id text REFERENCES "user"(id) ON DELETE CASCADE,
  name text NOT NULL,
  quote text NOT NULL,
  rating numeric(2,1) NOT NULL CHECK(rating BETWEEN 1 AND 5),
  trip text,
  created_at timestamptz NOT NULL DEFAULT now(),
  editorial boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS bookings_user ON bookings(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS reviews_user ON reviews(user_id, created_at DESC);

-- Prices are snapshots in euro cents. Paid status is written only by the
-- signature-verified Stripe webhook, never by checkout or a browser redirect.
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY,
  user_id text NOT NULL REFERENCES "user"(id),
  booking_id uuid NOT NULL UNIQUE REFERENCES bookings(id),
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','paid','expired','failed')),
  total_cents integer NOT NULL CHECK(total_cents > 0),
  currency text NOT NULL DEFAULT 'eur' CHECK(currency = 'eur'),
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  paid_event_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  destination_id text NOT NULL REFERENCES destinations(id),
  name text NOT NULL,
  unit_price_cents integer NOT NULL CHECK(unit_price_cents > 0),
  quantity integer NOT NULL CHECK(quantity BETWEEN 1 AND 10)
);
CREATE INDEX IF NOT EXISTS orders_user ON orders(user_id, created_at DESC);
