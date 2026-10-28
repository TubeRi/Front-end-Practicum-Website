import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import serverless from "serverless-http";
import { createApp } from "../app.js";
import { createAuth } from "../auth.js";
import { migrate } from "../migrate.js";
import { seed } from "../seed.js";
import { postgresFixture } from "./postgres-fixture.js";

test("Netlify function returns API JSON and preserves auth cookies", async (t) => {
  const { pool, database, close } = postgresFixture();
  t.after(close);
  const config = {
    origin: "https://travelpoint-test.netlify.app",
    secret: randomUUID() + randomUUID(),
  };
  await migrate(pool, config, database);
  await seed(pool);
  const handler = serverless(
    createApp({
      pool,
      config,
      auth: createAuth(database, config),
      serveStatic: false,
    }),
  );
  async function invoke(path, { method = "GET", body, cookie } = {}) {
    return handler(
      {
        httpMethod: method,
        path,
        headers: {
          host: "travelpoint-test.netlify.app",
          origin: config.origin,
          "content-type": "application/json",
          "x-forwarded-proto": "https",
          ...(cookie ? { cookie } : {}),
        },
        body: body ? JSON.stringify(body) : null,
        isBase64Encoded: false,
        requestContext: { identity: { sourceIp: "127.0.0.1" } },
      },
      {},
    );
  }
  const health = await invoke("/api/health");
  assert.equal(health.statusCode, 200);
  assert.deepEqual(JSON.parse(health.body), { ok: true });
  const catalog = await invoke("/api/destinations");
  assert.equal(JSON.parse(catalog.body).destinations.length, 10);
  const signup = await invoke("/api/auth/sign-up/email", {
    method: "POST",
    body: {
      name: "Netlify Test",
      email: "netlify@example.com",
      password: "NetlifyTest!123",
    },
  });
  assert.equal(signup.statusCode, 200, signup.body);
  const cookies = signup.multiValueHeaders?.["set-cookie"] || [];
  assert.ok(cookies.length, "Auth cookies must survive the function adapter");
  assert.ok(cookies.some((cookie) => /secure/i.test(cookie)));
  const cookie = cookies.map((value) => value.split(";")[0]).join("; ");
  const account = await invoke("/api/account", { cookie });
  assert.equal(account.statusCode, 200, account.body);
  assert.equal(JSON.parse(account.body).profile.email, "netlify@example.com");
});
