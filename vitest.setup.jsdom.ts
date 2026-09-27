import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// globals: false なので RTL の自動 cleanup は働かない
// （RTL はグローバルの afterEach が存在するときだけ自分で登録する）。
afterEach(() => {
  cleanup();
});
