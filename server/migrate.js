import { readFile } from "node:fs/promises";
import { getMigrations } from "better-auth/db/migration";
import { createAuth } from "./auth.js";

export async function migrate(pool, config, database = pool) {
  const auth = createAuth(database, config, { migrating: true });
  const { runMigrations } = await getMigrations(auth.options);
  await runMigrations();
  await pool.query(
    await readFile(new URL("./schema.sql", import.meta.url), "utf8"),
  );
}
