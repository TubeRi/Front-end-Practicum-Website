import pg from "pg";
import { readConfig } from "./config.js";
export const config = readConfig();
export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: 10,
  connectionTimeoutMillis: 10000,
});
pool.on("error", () => console.error("Database connection interrupted."));
