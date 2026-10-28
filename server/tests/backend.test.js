import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { postgresFixture } from "./postgres-fixture.js";
import { createAuth } from "../auth.js";
import { migrate } from "../migrate.js";
import { seed } from "../seed.js";
import { createApp } from "../app.js";

// PGlite runs a real PostgreSQL engine locally. Production always uses pg + DATABASE_URL.
test("real auth, ownership, bookings and reviews survive logout/login", async (t) => {
  const { pool, database, close } = postgresFixture();
  const config = {
    secret: randomUUID() + randomUUID(),
    origin: "http://localhost:5173",
  };
  await migrate(pool, config, database);
  await seed(pool);
  await seed(pool); // Idempotent: no duplicate catalog or editorial stories.
  const auth = createAuth(database, config);
  const server = createApp({ pool, auth, config }).listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await close();
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  async function request(
    path,
    { cookie = "", method = "GET", body, origin = config.origin } = {},
  ) {
    const response = await fetch(base + "/api" + path, {
      method,
      headers: {
        Origin: origin,
        "Content-Type": "application/json",
        ...(cookie ? { Cookie: cookie } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = await response.json();
    return {
      status: response.status,
      data,
      cookie: response.headers
        .getSetCookie()
        .map((value) => value.split(";")[0])
        .join("; "),
    };
  }
  const signup = async (email, origin = config.origin) =>
    request("/auth/sign-up/email", {
      method: "POST",
      origin,
      body: { name: "Test Traveler", email, password: "TestPassword!123" },
    });
  const catalog = await request("/destinations");
  assert.equal(catalog.status, 200);
  assert.equal(catalog.data.destinations.length, 10);
  assert.equal((await request("/reviews")).data.reviews.length, 6);
  assert.equal((await request("/account")).status, 401);
  assert.equal(
    (await request("/reviews", { method: "POST", body: {} })).status,
    401,
  );
  assert.equal(
    (
      await request("/reviews", {
        method: "POST",
        body: {},
        origin: "https://other.example",
      })
    ).status,
    403,
  );
  const first = await signup("one@example.com");
  assert.equal(first.status, 200, JSON.stringify(first.data));
  assert.ok(first.cookie);
  const cookie = first.cookie;
  assert.equal(
    (await request("/auth/get-session", { cookie })).data.user.email,
    "one@example.com",
  );
  const profile = {
    name: "Saved Traveler",
    phone: "12345",
    address: "Example street",
    addressExtra: "",
    city: "Vilnius",
    postalCode: "12345",
    country: "Lithuania",
    hobbies: "Hiking",
    bio: "I enjoy traveling.",
    travelStyle: "Adventure & outdoors",
  };
  assert.equal(
    (await request("/profile", { cookie, method: "PUT", body: profile }))
      .status,
    200,
  );
  assert.equal(
    (
      await request("/payment-preferences", {
        cookie,
        method: "POST",
        body: { type: "paypal", label: "Travel wallet" },
      })
    ).status,
    201,
  );
  const method = (await request("/account", { cookie })).data.paymentMethods[0];
  const destination = catalog.data.destinations.find(
    (item) => item.dates.length,
  );
  const booking = {
    destinationId: destination.id,
    travelDate: destination.dates.at(-1),
    travelers: 2,
    customerName: "Test Traveler",
    email: "one@example.com",
    paymentMethodId: method.id,
    requestId: randomUUID(),
    total: 1,
    userId: "attacker",
    status: "paid",
  };
  const saved = await request("/bookings", {
    cookie,
    method: "POST",
    body: booking,
  });
  assert.equal(saved.status, 201, JSON.stringify(saved.data));
  assert.equal(
    (await request("/bookings", { cookie, method: "POST", body: booking })).data
      .id,
    saved.data.id,
  );
  assert.equal(
    (
      await request("/bookings", {
        cookie,
        method: "POST",
        body: { ...booking, travelDate: "2020-01-01", requestId: randomUUID() },
      })
    ).status,
    400,
  );
  const posted = await request("/reviews", {
    cookie,
    method: "POST",
    body: {
      name: "Public name",
      quote: "A wonderful trip with thoughtful guides and beautiful views.",
      rating: 5,
      createdAt: "1999-01-01",
      userId: "attacker",
    },
  });
  assert.equal(posted.status, 201);
  assert.ok(posted.data.review.createdAt);
  assert.notEqual(posted.data.review.createdAt, "1999-01-01");
  assert.ok(
    (await request("/reviews")).data.reviews.some(
      (item) => item.id === posted.data.review.id,
    ),
  );
  // The URL printed by Vite must work as well as the localhost setup URL.
  const second = await signup("two@example.com", "http://127.0.0.1:5173");
  assert.equal(second.status, 200);
  const other = await request("/account", { cookie: second.cookie });
  assert.equal(other.data.trips.length, 0);
  assert.equal(other.data.reviews.length, 0);
  assert.equal(
    (
      await request("/payment-preferences/" + method.id + "/default", {
        cookie: second.cookie,
        method: "PUT",
      })
    ).status,
    404,
  );
  assert.equal(
    (
      await request("/bookings", {
        cookie: second.cookie,
        method: "POST",
        body: { ...booking, requestId: randomUUID() },
      })
    ).status,
    400,
  );
  assert.equal(
    (await request("/auth/sign-out", { cookie, method: "POST", body: {} }))
      .status,
    200,
  );
  assert.equal((await request("/account", { cookie })).status, 401);
  assert.equal(
    (
      await request("/auth/sign-in/email", {
        method: "POST",
        body: { email: "one@example.com", password: "wrong-password" },
      })
    ).status,
    401,
  );
  const login = await request("/auth/sign-in/email", {
    method: "POST",
    body: { email: "one@example.com", password: "TestPassword!123" },
  });
  assert.equal(login.status, 200);
  const account = (await request("/account", { cookie: login.cookie })).data;
  assert.equal(account.profile.hobbies, "Hiking");
  assert.equal(account.trips.length, 1);
  assert.equal(account.reviews.length, 1);
  assert.equal(account.trips[0].total, destination.price * 2);
  assert.equal(account.trips[0].status, "Booking request · unpaid");
  assert.equal(account.defaultPaymentId, method.id);
  const credentials = await pool.query(
    'SELECT password FROM account WHERE "userId"=$1',
    [first.data.user.id],
  );
  assert.ok(credentials.rows[0].password);
  assert.notEqual(credentials.rows[0].password, "TestPassword!123");
});
