import { createWebHandler } from "../../server/netlify-handler.js";
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

// A default Web Request handler selects Netlify's modern ES-module runtime.
// The legacy named handler export was bundled as CommonJS, which cannot load
// Better Auth's ES-module entry point on the deployed runtime.
export default createWebHandler(app);
