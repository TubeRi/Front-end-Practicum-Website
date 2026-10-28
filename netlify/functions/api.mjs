import serverless from "serverless-http";
import { pool, config } from "../../server/db.js";
import { createAuth } from "../../server/auth.js";
import { createApp } from "../../server/app.js";

// Reuse the connection pool between warm function invocations. Netlify serves
// the built frontend and photos itself; this function only handles the API.
const app = createApp({
  pool,
  config,
  auth: createAuth(pool, config),
  serveStatic: false,
});
export const handler = serverless(app);
