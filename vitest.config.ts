import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import Icons from "unplugin-icons/vite";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

function mockAgentApi(): Plugin {
  return {
    name: "mock-agent-api",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith("/api/agent/")) return next();
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ ok: true }));
      });
    },
  };
}

export default defineConfig({
  define: {
    __COMMIT_SHA__: JSON.stringify("test"),
    __COMMIT_TIMESTAMP__: JSON.stringify("2025-01-01T00:00:00Z"),
  },
  plugins: [mockAgentApi(), Icons({ compiler: "jsx", jsx: "react" }), react()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: "chromium" }],
    },
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
