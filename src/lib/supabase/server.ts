import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * リクエストごとの Supabase クライアント。
 * キャッシュしたりリクエスト間で共有したりしてはいけない。
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // 第 2 引数の `headers`（Cache-Control / Expires / Pragma）は受け取れるが、
        // `cookies()` 経由ではレスポンスヘッダに書けないので落としている。公式の
        // Supabase サンプルも同じ。Route Handler や Server Action で明示的に
        // Response を組み立ててサインインさせる場合は、そのレスポンスに
        // `Cache-Control: private, no-cache, no-store, must-revalidate, max-age=0`
        // を自分で付けること。セッション更新経路は src/proxy.ts が付けている。
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Component から呼ばれた場合。Cookie を書けないので無視して
            // よい。セッションの更新は src/proxy.ts が行う。
          }
        },
      },
    },
  );
}
