import { PGlite } from "@electric-sql/pglite";
import { PostgresDialect } from "kysely";

// Test-only adapter. The deployed application uses pg.Pool, never this fixture.
export function postgresFixture() {
  const db = new PGlite();
  async function query(sql, params = []) {
    if (sql.includes(";") && !params.length) {
      await db.exec(sql);
      return { rows: [], rowCount: 0 };
    }
    const result = await db.query(sql, params);
    const command = sql.trim().split(/\s/)[0].toUpperCase();
    return {
      ...result,
      command,
      rowCount:
        command === "SELECT"
          ? result.rows.length
          : (result.affectedRows ?? result.rows.length),
    };
  }
  const pool = {
    query,
    connect: async () => ({ query, release() {} }),
    end: async () => {},
  };
  return {
    pool,
    database: { dialect: new PostgresDialect({ pool }), type: "postgres" },
    close: () => db.close(),
  };
}
