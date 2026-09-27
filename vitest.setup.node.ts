import { AsyncLocalStorage } from "node:async_hooks";

// next/experimental/testing/server など Next のサーバ内部モジュールは
// globalThis.AsyncLocalStorage が生えている前提で書かれている（本来は Next の
// サーバ起動時に設定される）。設定せずに import すると
// "Invariant: AsyncLocalStorage accessed in runtime where it is not available"
// で落ちるので、テストでは自分で入れておく。
Object.assign(globalThis, { AsyncLocalStorage });
