import { test } from "node:test";
import assert from "node:assert/strict";
import { trustedOrigins } from "../origins.js";

test("development accepts the exact localhost and IP origins on the configured port", () => {
  assert.deepEqual(trustedOrigins("http://localhost:5173", false), [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ]);
  assert.deepEqual(trustedOrigins("http://127.0.0.1:5173", false), [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
  ]);
  assert.equal(
    trustedOrigins("http://localhost:5173", false).includes(
      "http://localhost:5174",
    ),
    false,
  );
  assert.deepEqual(trustedOrigins("https://travel.example", false), [
    "https://travel.example",
  ]);
});

test("production trusts only the configured origin", () => {
  assert.deepEqual(trustedOrigins("http://localhost:5173", true), [
    "http://localhost:5173",
  ]);
  assert.deepEqual(trustedOrigins("https://travel.example", true), [
    "https://travel.example",
  ]);
});
