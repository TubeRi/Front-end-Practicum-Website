import "dotenv/config";

export function readConfig() {
  const {
    DATABASE_URL,
    BETTER_AUTH_SECRET,
    APP_ORIGIN = "http://localhost:5173",
    PORT = "4000",
  } = process.env;
  if (!DATABASE_URL)
    throw new Error("Set DATABASE_URL in .env before starting the backend.");
  if (!BETTER_AUTH_SECRET || BETTER_AUTH_SECRET.length < 32)
    throw new Error(
      "Set a random BETTER_AUTH_SECRET of at least 32 characters in .env.",
    );
  const origin = new URL(APP_ORIGIN).origin;
  if (
    process.env.STRIPE_SECRET_KEY &&
    !process.env.STRIPE_SECRET_KEY.startsWith("sk_test_")
  )
    throw new Error(
      "This course project accepts only Stripe test secret keys (sk_test_). Live payments are disabled.",
    );
  if (process.env.NODE_ENV === "production" && !origin.startsWith("https://"))
    throw new Error("Production APP_ORIGIN must use HTTPS.");
  return {
    databaseUrl: DATABASE_URL,
    secret: BETTER_AUTH_SECRET,
    origin,
    port: Number(PORT),
    host: process.env.HOST || "127.0.0.1",
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  };
}
