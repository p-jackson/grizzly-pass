import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: "src/setup-tests.ts",
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
