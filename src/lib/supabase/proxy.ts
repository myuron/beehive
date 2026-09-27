import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Supabase セッションを更新し、ローテートされた認証 Cookie をレスポンスに書く。
 * 必ず `setAll` が最後に作ったレスポンスオブジェクトを返すこと。
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // クライアントはリクエストごとに作る。モジュールスコープや globalThis に
  // 持ち上げてはいけない（Next の proxy はレンダリングとは別に実行される）。
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
          // Cache-Control / Expires / Pragma。他人のセッション Cookie を
          // 載せたレスポンスが CDN にキャッシュされるのを防ぐ。
          for (const [key, value] of Object.entries(headers)) {
            supabaseResponse.headers.set(key, value);
          }
        },
      },
    },
  );

  // createServerClient と getClaims() の間にコードを挟まないこと。レスポンスが
  // 確定した後にトークン更新が落ちると「ランダムにログアウトされる」症状になる。
  await supabase.auth.getClaims();

  // ルート保護を入れるならここ。例:
  //   const { data } = await supabase.auth.getClaims();
  //   if (!data?.claims && !request.nextUrl.pathname.startsWith("/login")) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = "/login";
  //     return NextResponse.redirect(url);
  //   }
  // 別のレスポンスを返す場合は、supabaseResponse の Cookie と
  // cache-control / expires / pragma ヘッダを先にコピーすること。

  return supabaseResponse;
}
