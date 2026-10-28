import { pool, config } from "./db.js";
import { createAuth } from "./auth.js";
import { createApp } from "./app.js";
await pool.query("SELECT 1");
const server = createApp({
  pool,
  config,
  auth: createAuth(pool, config),
}).listen(config.port, config.host, () =>
  console.log(`TravelPoint API listening on port ${config.port}`),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () =>
    server.close(async () => {
      await pool.end();
      process.exit(0);
    }),
  );
