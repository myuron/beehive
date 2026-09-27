import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { Sql } from "postgres";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Copy my-pm-app/.env.example to .env.local.");
}

// Supabase の transaction pooler (6543) は prepared statements 非対応で、
// インスタンスあたりの接続も 1 本に抑えるべき。
const isTransactionPooler = new URL(connectionString).port === "6543";

// `next dev` は編集ごとにこのモジュールを再評価するため、素朴に書くと
// リロードのたびにソケットプールが漏れる。開発時のみ globalThis にキャッシュする。
const globalForDb = globalThis as typeof globalThis & { __pgClient?: Sql };

const client =
  globalForDb.__pgClient ??
  postgres(connectionString, {
    max: isTransactionPooler ? 1 : 10,
    prepare: !isTransactionPooler,
    idle_timeout: 20,
    connect_timeout: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__pgClient = client;
}

export const db = drizzle(client, { schema, casing: "snake_case" });
export { schema };
