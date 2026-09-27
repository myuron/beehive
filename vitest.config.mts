import react from "@vitejs/plugin-react";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],

  // tsconfig.json の paths（"@/*" -> "./src/*"）をそのまま解決する。
  // Vite 8 のネイティブ機能なので vite-tsconfig-paths は不要。
  resolve: { tsconfigPaths: true },

  test: {
    // coverage / reporters / watch は root 専用。projects の中には書けない。
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [...coverageConfigDefaults.exclude, "src/**/*.d.ts"],
    },

    // extends は vitest 5 の既定が true で、上の plugins / resolve を継承する。
    // どちらの project も Vite レベルの設定を足していないので sharedViteServer
    // が効き、Vite サーバは 1 本で済む。
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: ["src/**/*.test.ts"],
          setupFiles: ["./vitest.setup.node.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "jsdom",
          environment: "jsdom",
          include: ["src/**/*.test.tsx"],
          setupFiles: ["./vitest.setup.jsdom.ts"],
        },
      },
    ],
  },
});
