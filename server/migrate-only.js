import { pool, config } from "./db.js";
import { migrate } from "./migrate.js";
try {
  await migrate(pool, config);
  console.log("Database schema updated. Existing records were preserved.");
} catch (error) {
  console.error("Migration failed:", error.code || error.name);
  process.exitCode = 1;
} finally {
  await pool.end();
}
