import { betterAuth } from "better-auth";
import { trustedOrigins } from "./origins.js";

export function createAuth(database, config, { migrating = false } = {}) {
  return betterAuth({
    database,
    secret: config.secret,
    baseURL: config.origin,
    trustedOrigins: trustedOrigins(config.origin),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
    rateLimit: { enabled: true, window: 60, max: 30 },
    advanced: { database: { validateSchema: !migrating } },
  });
}
