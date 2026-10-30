import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import Stripe from "stripe";
import { postgresFixture } from "./postgres-fixture.js";
import { migrate } from "../migrate.js";
import { seed } from "../seed.js";
import { createAuth } from "../auth.js";
import { createApp } from "../app.js";
import { createWebHandler } from "../netlify-handler.js";
import { createStripe } from "../payments.js";

test("test checkout uses trusted prices and only signed webhooks can mark owned orders paid", async (t) => {
  const { pool, database, close } = postgresFixture();
  t.after(close);
  const config = {
    origin: "https://payments-test.netlify.app",
    secret: randomUUID() + randomUUID(),
    stripeWebhookSecret: "whsec_disposable_test_fixture",
  };
  await migrate(pool, config, database);
  await seed(pool);
  const sdk = new Stripe("sk_test_disposable_fixture");
  const sessions = new Map(),
    keys = new Map();
  let lastParams,
    failNext = false;
  const stripe = {
    webhooks: sdk.webhooks,
    checkout: {
      sessions: {
        create: async (params, options) => {
          lastParams = params;
          if (failNext) {
            failNext = false;
            throw new Error("Simulated Stripe outage");
          }
          if (keys.has(options.idempotencyKey))
            return keys.get(options.idempotencyKey);
          const session = {
            id: "cs_test_" + randomUUID(),
            livemode: false,
            mode: "payment",
            status: "open",
            payment_status: "unpaid",
            currency: "eur",
            amount_total:
              params.line_items[0].price_data.unit_amount *
              params.line_items[0].quantity,
            metadata: params.metadata,
            client_reference_id: params.client_reference_id,
            payment_intent: "pi_test_fixture",
            url: "https://checkout.stripe.com/c/pay/test_fixture",
          };
          sessions.set(session.id, session);
          keys.set(options.idempotencyKey, session);
          return session;
        },
        retrieve: async (id) => {
          if (!sessions.has(id)) throw new Error("Unknown session");
          return sessions.get(id);
        },
      },
    },
  };
  const auth = createAuth(database, config);
  const app = createApp({ pool, auth, config, stripe, serveStatic: false });
  const handler = createWebHandler(app);
  async function request(
    path,
    {
      method = "GET",
      cookie,
      body,
      signature,
      raw,
      origin = config.origin,
    } = {},
  ) {
    const response = await handler(
      new Request(config.origin + "/api" + path, {
        method,
        headers: {
          "content-type": "application/json",
          ...(origin ? { origin } : {}),
          ...(cookie ? { cookie } : {}),
          ...(signature ? { "stripe-signature": signature } : {}),
        },
        ...(!["GET", "HEAD"].includes(method)
          ? { body: raw ?? JSON.stringify(body || {}) }
          : {}),
      }),
      { ip: "127.0.0.1" },
    );
    return {
      status: response.status,
      data: await response.json(),
      cookie: response.headers
        .getSetCookie()
        .map((v) => v.split(";")[0])
        .join("; "),
    };
  }
  const signup = await request("/auth/sign-up/email", {
    method: "POST",
    body: {
      name: "Payment Test",
      email: "pay-one@example.com",
      password: "CheckoutTest!123",
    },
  });
  assert.equal(signup.status, 200);
  const cookie = signup.cookie;
  const other = await request("/auth/sign-up/email", {
    method: "POST",
    body: {
      name: "Other Test",
      email: "pay-two@example.com",
      password: "CheckoutTest!123",
    },
  });
  const catalog = (await request("/destinations")).data.destinations;
  const destination = catalog.find((item) => item.dates.length);
  const book = async (travelers = 2) =>
    request("/bookings", {
      method: "POST",
      cookie,
      body: {
        destinationId: destination.id,
        travelDate: destination.dates.at(-1),
        travelers,
        customerName: "Payment Test",
        email: "pay-one@example.com",
        requestId: randomUUID(),
      },
    });
  const booking = await book();
  assert.equal(booking.status, 201);
  const checkoutBody = {
    bookingId: booking.data.id,
    total: 1,
    price: 1,
    status: "paid",
    userId: other.data.user.id,
  };
  assert.equal(
    (await request("/checkout", { method: "POST", body: checkoutBody })).status,
    401,
  );
  assert.equal(
    (
      await request("/checkout", {
        method: "POST",
        cookie: other.cookie,
        body: checkoutBody,
      })
    ).status,
    404,
  );
  const checkout = await request("/checkout", {
    method: "POST",
    cookie,
    body: checkoutBody,
  });
  assert.equal(checkout.status, 200, JSON.stringify(checkout.data));
  assert.ok(checkout.data.url.startsWith("https://checkout.stripe.com/"));
  const id = checkout.data.orderId,
    path = "/orders/" + id;
  assert.equal(
    lastParams.line_items[0].price_data.unit_amount,
    destination.price * 100,
  );
  assert.equal(lastParams.line_items[0].quantity, 2);
  assert.equal(lastParams.mode, "payment");
  assert.equal(Object.hasOwn(lastParams, "payment_method_types"), false);
  assert.equal((await request(path)).status, 401);
  assert.equal((await request(path, { cookie: other.cookie })).status, 404);
  let order = (await request(path, { cookie })).data.order;
  assert.equal(order.status, "pending");
  assert.equal(order.totalCents, destination.price * 200);
  assert.equal(order.items[0].unitPriceCents, destination.price * 100);
  assert.equal(
    (await request(path, { cookie, method: "PUT", body: { status: "paid" } }))
      .status,
    404,
  );
  assert.equal(
    (await request("/checkout", { method: "POST", cookie, body: checkoutBody }))
      .data.orderId,
    id,
  );
  assert.equal(keys.size, 1);
  await pool.query("UPDATE destinations SET price=price+100 WHERE id=$1", [
    destination.id,
  ]);
  await request("/checkout", { method: "POST", cookie, body: checkoutBody });
  assert.equal(
    (await request(path, { cookie })).data.order.totalCents,
    destination.price * 200,
  );
  assert.equal((await pool.query("SELECT * FROM orders")).rows.length, 1);
  const session = [...sessions.values()][0];
  async function webhook(type, extra = {}) {
    const event = {
      id: "evt_" + randomUUID(),
      object: "event",
      livemode: false,
      type,
      data: { object: { id: session.id } },
      ...extra,
    };
    // Keep whitespace and Unicode: the Netlify adapter must preserve raw bytes.
    const raw = JSON.stringify(
      { ...event, testDescription: "A trip – café" },
      null,
      2,
    );
    const signature = sdk.webhooks.generateTestHeaderString({
      payload: raw,
      secret: config.stripeWebhookSecret,
    });
    return request("/stripe/webhook", {
      method: "POST",
      origin: null,
      raw,
      signature,
    });
  }
  assert.equal(
    (
      await request("/stripe/webhook", {
        method: "POST",
        origin: null,
        body: {},
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await request("/stripe/webhook", {
        method: "POST",
        origin: null,
        raw: "{}",
        signature: "invalid",
      })
    ).status,
    400,
  );
  assert.equal((await webhook("checkout.session.completed")).status, 200);
  assert.equal((await request(path, { cookie })).data.order.status, "pending");
  session.payment_status = "paid";
  session.status = "complete";
  session.amount_total += 1;
  assert.equal((await webhook("checkout.session.completed")).status, 400);
  assert.equal((await request(path, { cookie })).data.order.status, "pending");
  session.amount_total -= 1;
  assert.equal(
    (await webhook("checkout.session.completed", { livemode: true })).status,
    400,
  );
  assert.equal((await webhook("checkout.session.completed")).status, 200);
  order = (await request(path, { cookie })).data.order;
  assert.equal(order.status, "paid");
  assert.ok(order.paidAt);
  const paidAt = order.paidAt;
  assert.equal(
    (await webhook("checkout.session.async_payment_succeeded")).status,
    200,
  );
  assert.equal((await webhook("checkout.session.expired")).status, 200);
  order = (await request(path, { cookie })).data.order;
  assert.equal(order.status, "paid");
  assert.equal(order.paidAt, paidAt);
  const account = (await request("/account", { cookie })).data;
  assert.equal(account.trips[0].status, "Paid · Stripe test payment");
  assert.equal(account.trips[0].orderId, id);
  assert.equal(
    (await request("/checkout", { method: "POST", cookie, body: checkoutBody }))
      .data.paid,
    true,
  );

  const nextBooking = await book(1);
  failNext = true;
  assert.equal(
    (
      await request("/checkout", {
        method: "POST",
        cookie,
        body: { bookingId: nextBooking.data.id },
      })
    ).status,
    500,
  );
  const pending = (
    await pool.query("SELECT * FROM orders WHERE booking_id=$1", [
      nextBooking.data.id,
    ])
  ).rows[0];
  assert.equal(pending.status, "pending");
  assert.equal(pending.stripe_session_id, null);
  const retried = await request("/checkout", {
    method: "POST",
    cookie,
    body: { bookingId: nextBooking.data.id },
  });
  assert.equal(retried.status, 200);
  assert.equal(retried.data.orderId, pending.id);
  assert.equal(
    (
      await pool.query("SELECT * FROM order_items WHERE order_id=$1", [
        pending.id,
      ])
    ).rows.length,
    1,
  );
  assert.throws(
    () => createStripe({ stripeSecretKey: "sk_live_disallowed_fixture" }),
    /test keys/,
  );
});
