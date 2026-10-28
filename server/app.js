import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { z } from "zod";
import { trustedOrigins } from "./origins.js";

const text = (max) => z.string().trim().max(max);
const profileSchema = z.object({
  name: text(80).min(1),
  phone: text(30),
  address: text(150),
  addressExtra: text(150),
  city: text(80),
  postalCode: text(20),
  country: text(80),
  hobbies: text(200),
  bio: text(600),
  travelStyle: text(80),
});
const paymentSchema = z.object({
  type: z.enum(["card", "paypal", "apple-pay", "google-pay", "bank-transfer"]),
  label: text(40)
    .min(1)
    .refine(
      (value) => !/(?:\d[ -]*){8,}/.test(value),
      "Use a nickname without financial account numbers.",
    ),
});
const bookingSchema = z.object({
  destinationId: text(80).min(1),
  travelDate: z.iso.date(),
  travelers: z.number().int().min(1).max(10),
  customerName: text(80).min(1),
  email: z.email().max(254),
  paymentMethodId: z.union([z.uuid(), z.literal("")]).optional(),
  requestId: z.uuid(),
});
const reviewSchema = z.object({
  name: text(80).min(1),
  rating: z.coerce.number().int().min(1).max(5),
  quote: text(1500).min(20),
});
const reviewColumns =
  'id,name,quote,rating,trip,created_at AS "createdAt",editorial';
const serializeReview = (row) => ({
  ...row,
  rating: String(row.rating),
  createdAt: row.editorial ? undefined : row.createdAt,
  initials: row.name
    .split(/\s+/)
    .filter((part) => /[\p{L}\p{N}]/u.test(part))
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase(),
});
const issue = (status, message) =>
  Object.assign(new Error(message), { status });

export function createApp({ pool, auth, config }) {
  const app = express();
  const allowedOrigins = trustedOrigins(config.origin);
  app.disable("x-powered-by");
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use("/api", (req, res, next) => {
    res.set("Cache-Control", "no-store");
    if (
      !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
      !allowedOrigins.includes(req.get("origin"))
    )
      return res
        .status(403)
        .json({ message: "Request origin is not allowed." });
    next();
  });
  app.use(
    "/api/auth",
    rateLimit({
      windowMs: 60000,
      limit: 30,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    }),
  );
  app.all("/api/auth/*splat", toNodeHandler(auth));
  app.use(express.json({ limit: "20kb" }));
  app.get("/api/health", async (req, res) => {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  });
  app.get("/api/destinations", async (req, res) => {
    const result = await pool.query(
      "SELECT d.data, d.price, d.duration, COALESCE(json_agg(to_char(p.departure,'YYYY-MM-DD') ORDER BY p.departure) FILTER (WHERE p.departure >= (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Vilnius')::date), '[]') AS dates FROM destinations d LEFT JOIN departures p ON p.destination_id=d.id GROUP BY d.id ORDER BY (d.data->>'position')::int, d.id",
    );
    res.json({
      destinations: result.rows.map((row) => ({
        ...row.data,
        price: row.price,
        duration: row.duration,
        dates: row.dates,
      })),
      categories: ["All Destinations", "Beach", "Adventure", "City", "Nature"],
    });
  });
  app.get("/api/reviews", async (req, res) => {
    const { rows } = await pool.query(
      `SELECT ${reviewColumns} FROM reviews ORDER BY CASE WHEN id='editorial-0' THEN 0 WHEN NOT editorial THEN 1 ELSE 2 END, CASE WHEN editorial THEN id END ASC, created_at DESC`,
    );
    res.json({ reviews: rows.map(serializeReview) });
  });
  app.use("/api", async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session)
      return res.status(401).json({ message: "Please log in to continue." });
    req.user = session.user;
    next();
  });
  app.get("/api/account", async (req, res) => {
    const id = req.user.id;
    const [profile, methods, trips, reviews] = await Promise.all([
      pool.query("SELECT data FROM profiles WHERE user_id=$1", [id]),
      pool.query(
        "SELECT id,type,label,preferred FROM payment_preferences WHERE user_id=$1 ORDER BY created_at",
        [id],
      ),
      pool.query(
        `SELECT b.id,b.destination_id AS "destinationId",d.data->>'name' AS name,concat(d.data->>'location',', ',d.data->>'country') AS location,d.data->>'image' AS image,to_char(b.departure,'YYYY-MM-DD') AS departure,to_char(b.end_date,'YYYY-MM-DD') AS "endDate",b.travelers,b.total,b.payment_preference AS "paymentPreference",b.status FROM bookings b JOIN destinations d ON d.id=b.destination_id WHERE b.user_id=$1 ORDER BY b.created_at DESC`,
        [id],
      ),
      pool.query(
        `SELECT ${reviewColumns} FROM reviews WHERE user_id=$1 ORDER BY created_at DESC`,
        [id],
      ),
    ]);
    res.json({
      profile: {
        ...profile.rows[0]?.data,
        name: profile.rows[0]?.data.name || req.user.name,
        email: req.user.email,
      },
      paymentMethods: methods.rows,
      defaultPaymentId:
        methods.rows.find((method) => method.preferred)?.id || "",
      trips: trips.rows,
      reviews: reviews.rows.map(serializeReview),
    });
  });
  app.put("/api/profile", async (req, res) => {
    const data = profileSchema.parse(req.body);
    await pool.query(
      "INSERT INTO profiles VALUES($1,$2) ON CONFLICT(user_id) DO UPDATE SET data=$2",
      [req.user.id, JSON.stringify(data)],
    );
    res.json({ ok: true });
  });
  // Serialize payment changes per user to keep exactly one preferred method.
  async function paymentChange(userId, change) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query('SELECT id FROM "user" WHERE id=$1 FOR UPDATE', [
        userId,
      ]);
      await change(client);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
  app.post("/api/payment-preferences", async (req, res) => {
    const data = paymentSchema.parse(req.body);
    await paymentChange(req.user.id, async (client) => {
      const { rows } = await client.query(
        "SELECT id FROM payment_preferences WHERE user_id=$1",
        [req.user.id],
      );
      if (rows.length >= 10)
        throw issue(400, "Keep up to 10 payment preferences.");
      await client.query(
        "INSERT INTO payment_preferences(id,user_id,type,label,preferred) VALUES($1,$2,$3,$4,$5)",
        [randomUUID(), req.user.id, data.type, data.label, !rows.length],
      );
    });
    res.status(201).json({ ok: true });
  });
  app.put("/api/payment-preferences/:id/default", async (req, res) => {
    const id = z.uuid().parse(req.params.id);
    await paymentChange(req.user.id, async (client) => {
      const found = await client.query(
        "SELECT id FROM payment_preferences WHERE user_id=$1 AND id=$2",
        [req.user.id, id],
      );
      if (!found.rowCount) throw issue(404, "Payment preference not found.");
      await client.query(
        "UPDATE payment_preferences SET preferred=false WHERE user_id=$1",
        [req.user.id],
      );
      await client.query(
        "UPDATE payment_preferences SET preferred=true WHERE user_id=$1 AND id=$2",
        [req.user.id, id],
      );
    });
    res.json({ ok: true });
  });
  app.delete("/api/payment-preferences/:id", async (req, res) => {
    const id = z.uuid().parse(req.params.id);
    await paymentChange(req.user.id, async (client) => {
      const removed = await client.query(
        "DELETE FROM payment_preferences WHERE user_id=$1 AND id=$2 RETURNING preferred",
        [req.user.id, id],
      );
      if (!removed.rowCount) throw issue(404, "Payment preference not found.");
      if (removed.rows[0].preferred)
        await client.query(
          "UPDATE payment_preferences SET preferred=true WHERE id=(SELECT id FROM payment_preferences WHERE user_id=$1 ORDER BY created_at LIMIT 1)",
          [req.user.id],
        );
    });
    res.json({ ok: true });
  });
  app.post("/api/bookings", async (req, res) => {
    const data = bookingSchema.parse(req.body);
    const { rows } = await pool.query(
      "SELECT d.price,d.duration FROM destinations d JOIN departures p ON p.destination_id=d.id WHERE d.id=$1 AND p.departure=$2 AND p.departure >= (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Vilnius')::date",
      [data.destinationId, data.travelDate],
    );
    if (!rows.length) throw issue(400, "Choose an available future departure.");
    let payment = "Choose later";
    if (data.paymentMethodId) {
      const method = await pool.query(
        "SELECT label FROM payment_preferences WHERE user_id=$1 AND id=$2",
        [req.user.id, data.paymentMethodId],
      );
      if (!method.rowCount)
        throw issue(400, "Choose one of your payment preferences.");
      payment = method.rows[0].label;
    }
    const result = await pool.query(
      "INSERT INTO bookings(id,user_id,destination_id,departure,end_date,travelers,total,customer_name,contact_email,payment_preference,request_id) VALUES($1,$2,$3,$4,$4::date+($5::int-1),$6,$7,$8,$9,$10,$11) ON CONFLICT(user_id,request_id) DO UPDATE SET request_id=EXCLUDED.request_id RETURNING id",
      [
        randomUUID(),
        req.user.id,
        data.destinationId,
        data.travelDate,
        rows[0].duration,
        data.travelers,
        rows[0].price * data.travelers,
        data.customerName,
        data.email,
        payment,
        data.requestId,
      ],
    );
    res.status(201).json({ id: result.rows[0].id });
  });
  app.post(
    "/api/reviews",
    rateLimit({
      windowMs: 60000,
      limit: 5,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    }),
    async (req, res) => {
      const data = reviewSchema.parse(req.body);
      const { rows } = await pool.query(
        `INSERT INTO reviews(id,user_id,name,quote,rating) VALUES($1,$2,$3,$4,$5) RETURNING ${reviewColumns}`,
        [randomUUID(), req.user.id, data.name, data.quote, data.rating],
      );
      res.status(201).json({ review: serializeReview(rows[0]) });
    },
  );
  app.use("/api", (req, res) =>
    res.status(404).json({ message: "API route not found." }),
  );
  app.use(
    "/images",
    express.static(
      fileURLToPath(new URL("../src/front-end/assets/Photos", import.meta.url)),
    ),
  );
  const dist = fileURLToPath(new URL("../dist/", import.meta.url));
  if (existsSync(dist)) {
    app.use(express.static(dist));
    app.get("/{*path}", (req, res) =>
      res.sendFile("index.html", { root: dist }),
    );
  }
  app.use((error, req, res, next) => {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: error.issues[0]?.message || "Invalid details." });
    const status =
      error.status >= 400 && error.status < 500 ? error.status : 500;
    if (status === 500)
      console.error("API request failed:", error.code || error.name);
    res.status(status).json({
      message:
        status === 500
          ? "Unable to save or load your data. Please try again."
          : error.message,
    });
  });
  return app;
}
