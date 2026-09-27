import "server-only";
import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

/**
 * サインイン中ユーザーの検証済み JWT クレーム、未サインインなら null。
 *
 * `getClaims()` は毎回トークンの署名を検証する（プロジェクトが非対称署名鍵を
 * 使っていればキャッシュ済み JWKS でローカル検証、そうでなければ Auth
 * サーバーに問い合わせる）。サーバー側で `getSession()` は使わないこと
 * （Cookie の内容を無検証で信じてしまう）。
 *
 * React の `cache` で包んでいるので、1 回のレンダーで検証は最大 1 回。
 */
export const getClaims = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error) {
    return null;
  }

  return data?.claims ?? null;
});

/** サインイン中ユーザーの `auth.users.id`、未サインインなら null。 */
export async function getUserId() {
  const claims = await getClaims();
  return claims?.sub ?? null;
}

/** Auth サーバーから取得したユーザー行全体。呼ぶたびに 1 往復する。 */
export async function getUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}
