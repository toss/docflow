import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/cli.ts"],
  format: "esm",
  outDir: "dist",
  clean: true,
  unbundle: true,
  exports: true,
});
