import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";

import { config } from "@/proxy";

// Next 16 では middleware が proxy に改名されたが、テストユーティリティの
// エクスポート名は unstable_doesMiddlewareMatch のまま。
describe("proxy の matcher", () => {
  it("アプリのページにはマッチする", () => {
    expect(unstable_doesMiddlewareMatch({ config, url: "/" })).toBe(true);
    expect(unstable_doesMiddlewareMatch({ config, url: "/dashboard" })).toBe(true);
    expect(unstable_doesMiddlewareMatch({ config, url: "/login?next=%2F" })).toBe(true);
  });

  it("Next の内部パス・favicon・静的画像にはマッチしない", () => {
    for (const url of [
      "/_next/static/chunks/main.js",
      "/_next/image?url=%2Fnext.svg&w=128&q=75",
      "/favicon.ico",
      "/next.svg",
      "/vercel.svg",
    ]) {
      expect(unstable_doesMiddlewareMatch({ config, url })).toBe(false);
    }
  });
});
