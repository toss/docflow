import { Config } from "../../config/config.schema.js";

export const MOCK_CONFIG: Config = {
  project: {
    root: "apps/docs",
    packageManager: "yarn",
    workspace: {
      include: ["packages/*"],
      exclude: [],
    },
  },
  commands: {
    build: {
      manifest: {
        prefix: "/reference",
        enabled: true,
        path: "docs/reference/manifest.json",
      },
      outputDir: "docs/reference",
      generator: {
        name: "vitepress",
        signatureLanguage: "typescript",
      },
    },
    check: {
      entryPoints: ["src/index.ts"],
    },
    generate: {
      jsdoc: {
        fetcher: () => Promise.resolve(""),
        prompt: "",
      },
    },
  },
  plugins: [],
} as const;
