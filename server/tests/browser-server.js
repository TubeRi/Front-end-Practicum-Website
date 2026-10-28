// Explicit, disposable database for browser QA. Not an application startup script.
import { randomUUID } from "node:crypto";
import { postgresFixture } from "./postgres-fixture.js";
import { migrate } from "../migrate.js";
import { seed } from "../seed.js";
import { createAuth } from "../auth.js";
import { createApp } from "../app.js";
const { pool, database, close } = postgresFixture();
const config = {
  origin: "http://localhost:5173",
  secret: randomUUID() + randomUUID(),
};
await migrate(pool, config, database);
await seed(pool);
const server = createApp({
  pool,
  config,
  auth: createAuth(database, config),
}).listen(4000, "127.0.0.1", () =>
  console.log("Disposable browser test API ready."),
);
process.on("SIGINT", () =>
  server.close(async () => {
    await close();
    process.exit(0);
  }),
);
