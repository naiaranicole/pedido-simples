import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/lib/**", "src/components/ui-app.tsx", "src/routes/**"],
      exclude: [
        "src/routeTree.gen.ts",
        "src/routes/api/**",
        // Arquivos de infraestrutura da plataforma, não fazem parte das regras do projeto.
        "src/lib/error-capture.ts",
        "src/lib/error-page.ts",
        "src/lib/lovable-error-reporting.ts",
      ],
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
