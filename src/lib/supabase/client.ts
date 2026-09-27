import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Component 用の Supabase クライアント。
 * `createBrowserClient` は内部でシングルトン化されているので、
 * コンポーネントごとに呼び出して構わない。
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
