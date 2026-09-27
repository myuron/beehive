import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit は dotenv/config を内蔵しており、cwd の `.env` だけを読む。
// 実値は Next の慣習どおり `.env.local` に置くので明示的に読み込む。
// 配列で渡した場合、キーを最初に定義したファイルが勝つ。
config({ path: [".env.local", ".env"], quiet: true });

// drizzle-kit は prepared statements を使うため、Supabase の transaction
// pooler (6543) では動かない。DATABASE_URL が 6543 を指すときは
// DIRECT_DATABASE_URL に direct 接続か session pooler (5432) を設定する。
const url = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;

if (!url) {
  throw new Error("DATABASE_URL is not set. Copy my-pm-app/.env.example to .env.local.");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
  // camelCase の TS 識別子から snake_case のカラム名を導出する。
  casing: "snake_case",
  // 差分を取るのは public のみ。auth / storage / realtime は Supabase の所有物。
  schemaFilter: ["public"],
  // Supabase 組み込みロールを作成・削除させない。
  entities: { roles: { provider: "supabase" } },
  verbose: true,
  strict: true,
});
