import { expect, test } from "bun:test";
import type { PluginHttpClient, ProviderFetchContext } from "@tokentop/plugin-sdk";
import { perplexityPlugin } from "./perplexity.ts";

test("attributes Perplexity API requests", async () => {
  let requestHeaders = new Headers();
  const http: PluginHttpClient = {
    fetch: async (_url, init) => {
      requestHeaders = new Headers(init?.headers);
      return new Response(null, { status: 401 });
    },
  };
  const context = {
    credentials: { apiKey: "test-key", source: "env" },
    http,
    logger: { debug() {}, info() {}, warn() {}, error() {} },
    config: {},
    signal: AbortSignal.timeout(5000),
  } satisfies ProviderFetchContext;

  await perplexityPlugin.fetchUsage(context);

  expect(requestHeaders.get("x-pplx-integration")).toBe("tokentop");
});
