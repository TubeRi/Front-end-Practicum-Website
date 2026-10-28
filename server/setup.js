import { pool, config } from "./db.js";
import { migrate } from "./migrate.js";
import { seed } from "./seed.js";
try {
  await migrate(pool, config);
  await seed(pool);
  console.log(
    "Database schema and sample catalog are ready. Existing users, bookings and reviews were preserved.",
  );
} catch (error) {
  console.error("Database setup failed:", error.code || error.name);
  process.exitCode = 1;
} finally {
  await pool.end();
}
