import Stripe from "stripe";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { rateLimit } from "express-rate-limit";

const checkoutSchema = z.object({ bookingId: z.uuid() });
const fail = (status, message) => Object.assign(new Error(message), { status });

export function createStripe(config) {
  if (!config.stripeSecretKey) return null;
  if (!config.stripeSecretKey.startsWith("sk_test_"))
    throw new Error("Only Stripe test keys are supported.");
  return new Stripe(config.stripeSecretKey, {
    maxNetworkRetries: 2,
    timeout: 10000,
  });
}

function requireStripe(stripe, config) {
  if (!stripe || !config.stripeWebhookSecret)
    throw fail(
      503,
      "Test payments are not configured yet. Please try again later.",
    );
}

export function registerPaymentRoutes(app, { pool, stripe, config }) {
  // Registered after the shared session middleware: user identity is verified.
  app.post(
    "/api/checkout",
    rateLimit({
      windowMs: 60000,
      limit: 10,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    }),
    async (req, res) => {
      requireStripe(stripe, config);
      const { bookingId } = checkoutSchema.parse(req.body);
      const client = await pool.connect();
      let order;
      let item;
      try {
        await client.query("BEGIN");
        const bookingResult = await client.query(
          "SELECT b.*,d.price,d.data->>'name' AS name FROM bookings b JOIN destinations d ON d.id=b.destination_id WHERE b.id=$1 AND b.user_id=$2 FOR UPDATE OF b",
          [bookingId, req.user.id],
        );
        const booking = bookingResult.rows[0];
        if (!booking) throw fail(404, "Booking not found.");
        const available = await client.query(
          "SELECT 1 FROM departures WHERE destination_id=$1 AND departure=$2 AND departure >= (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Vilnius')::date",
          [booking.destination_id, booking.departure],
        );
        if (!available.rowCount)
          throw fail(
            400,
            "This departure is no longer available for checkout.",
          );
        const previous = await client.query(
          "SELECT * FROM orders WHERE booking_id=$1",
          [bookingId],
        );
        order = previous.rows[0];
        if (!order) {
          const total = booking.price * 100 * booking.travelers;
          const created = await client.query(
            "INSERT INTO orders(id,user_id,booking_id,total_cents) VALUES($1,$2,$3,$4) RETURNING *",
            [randomUUID(), req.user.id, bookingId, total],
          );
          order = created.rows[0];
          await client.query(
            "INSERT INTO order_items(id,order_id,destination_id,name,unit_price_cents,quantity) VALUES($1,$2,$3,$4,$5,$6)",
            [
              randomUUID(),
              order.id,
              booking.destination_id,
              booking.name,
              booking.price * 100,
              booking.travelers,
            ],
          );
        }
        item = (
          await client.query("SELECT * FROM order_items WHERE order_id=$1", [
            order.id,
          ])
        ).rows[0];
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }

      if (order.status === "paid")
        return res.json({ orderId: order.id, paid: true });
      if (order.status !== "pending")
        throw fail(
          409,
          "This checkout has expired or failed. Create a new booking request to try again.",
        );
      let session;
      if (order.stripe_session_id) {
        session = await stripe.checkout.sessions.retrieve(
          order.stripe_session_id,
        );
        if (session.status !== "open")
          return res.json({ orderId: order.id, pendingConfirmation: true });
      } else {
        // Repeated clicks and transient Stripe/database failures reuse one session.
        session = await stripe.checkout.sessions.create(
          {
            mode: "payment",
            customer_email: req.user.email,
            client_reference_id: order.id,
            metadata: { orderId: order.id, userId: req.user.id },
            line_items: [
              {
                price_data: {
                  currency: "eur",
                  unit_amount: item.unit_price_cents,
                  product_data: { name: item.name },
                },
                quantity: item.quantity,
              },
            ],
            success_url: `${config.origin}/checkout/success?order=${order.id}`,
            cancel_url: `${config.origin}/checkout/cancel?order=${order.id}`,
          },
          { idempotencyKey: `travelpoint-order-v2-${order.id}` },
        );
        if (session.livemode !== false)
          throw fail(502, "Only test payments are allowed.");
        await pool.query(
          "UPDATE orders SET stripe_session_id=$1 WHERE id=$2 AND (stripe_session_id IS NULL OR stripe_session_id=$1)",
          [session.id, order.id],
        );
      }
      const target = new URL(session.url);
      if (target.origin !== "https://checkout.stripe.com")
        throw fail(502, "Stripe checkout is temporarily unavailable.");
      res.json({ orderId: order.id, url: session.url });
    },
  );

  app.get("/api/orders/:id", async (req, res) => {
    const id = z.uuid().parse(req.params.id);
    const { rows } = await pool.query(
      'SELECT id,booking_id AS "bookingId",status,total_cents AS "totalCents",currency,created_at AS "createdAt",paid_at AS "paidAt" FROM orders WHERE id=$1 AND user_id=$2',
      [id, req.user.id],
    );
    if (!rows.length) throw fail(404, "Order not found.");
    const items = await pool.query(
      'SELECT destination_id AS "destinationId",name,unit_price_cents AS "unitPriceCents",quantity FROM order_items WHERE order_id=$1',
      [id],
    );
    res.json({ order: { ...rows[0], items: items.rows } });
  });
}

export function stripeWebhook({ pool, stripe, config }) {
  return async (req, res) => {
    requireStripe(stripe, config);
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.get("stripe-signature"),
        config.stripeWebhookSecret,
      );
    } catch {
      return res
        .status(400)
        .json({ message: "Invalid Stripe webhook signature." });
    }
    if (event.livemode !== false)
      return res
        .status(400)
        .json({ message: "Only test events are accepted." });
    const supported = [
      "checkout.session.completed",
      "checkout.session.async_payment_succeeded",
      "checkout.session.expired",
      "checkout.session.async_payment_failed",
    ];
    if (!supported.includes(event.type)) return res.json({ received: true });
    const session = await stripe.checkout.sessions.retrieve(
      event.data.object.id,
    );
    const orderId = session.metadata?.orderId;
    if (!orderId) return res.json({ received: true }); // Checkout belongs to another integration.
    if (!z.uuid().safeParse(orderId).success)
      throw fail(400, "Invalid order reference.");
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const { rows } = await client.query(
        "SELECT * FROM orders WHERE id=$1 FOR UPDATE",
        [orderId],
      );
      const order = rows[0];
      if (!order) throw fail(409, "Order is not ready. Retry the event.");
      if (
        session.livemode !== false ||
        session.mode !== "payment" ||
        session.client_reference_id !== order.id ||
        session.metadata.userId !== order.user_id ||
        session.amount_total !== order.total_cents ||
        session.currency !== order.currency ||
        (order.stripe_session_id && order.stripe_session_id !== session.id)
      )
        throw fail(400, "Payment does not match this order.");
      // This is the ONLY code path that writes paid status. Duplicate/out-of-order
      // events cannot downgrade a paid order or create another booking.
      if (
        order.status !== "paid" &&
        session.payment_status === "paid" &&
        [
          "checkout.session.completed",
          "checkout.session.async_payment_succeeded",
        ].includes(event.type)
      ) {
        await client.query(
          "UPDATE orders SET status='paid',paid_at=now(),paid_event_id=$1,stripe_session_id=$2,stripe_payment_intent_id=$3 WHERE id=$4",
          [
            event.id,
            session.id,
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id || null,
            order.id,
          ],
        );
        await client.query(
          "UPDATE bookings SET status='Paid · Stripe test payment',total=$1 WHERE id=$2 AND user_id=$3",
          [order.total_cents / 100, order.booking_id, order.user_id],
        );
      } else if (order.status !== "paid" && session.payment_status !== "paid") {
        if (event.type === "checkout.session.expired")
          await client.query("UPDATE orders SET status='expired' WHERE id=$1", [
            order.id,
          ]);
        if (event.type === "checkout.session.async_payment_failed")
          await client.query("UPDATE orders SET status='failed' WHERE id=$1", [
            order.id,
          ]);
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
    res.json({ received: true });
  };
}
