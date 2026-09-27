/**
 * `public` スキーマの Drizzle 定義。今は意図的に空。
 *
 * 末尾の `export {}` は必須。import / export を持たない .ts はグローバル
 * スクリプト扱いになり、`import * as schema from "./schema"` が TS2306 で落ちる。
 *
 * テーブルはここに追加する。例:
 *
 *   import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
 *   import { authUsers } from "drizzle-orm/supabase";
 *
 *   export const projects = pgTable("projects", {
 *     id: uuid().primaryKey().defaultRandom(),
 *     ownerId: uuid()
 *       .notNull()
 *       .references(() => authUsers.id, { onDelete: "cascade" }),
 *     name: text().notNull(),
 *     createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
 *   }).enableRLS();
 *
 * `casing: "snake_case"` を drizzle.config.ts と src/db/index.ts の両方で
 * 指定しているので、`ownerId` はカラム名を書かずに `owner_id` になる。
 *
 * `.enableRLS()` は付けておく。アプリは postgres ロールで接続するので RLS は
 * バイパスされるが、PostgREST が publishable キーでブラウザに public を
 * 公開するため、RLS 無効のテーブルは誰でも読める状態になる。
 */

export {};
