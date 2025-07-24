import { describe, it, expect } from "vitest";
import { configSchema, Config } from "../../config/config.schema.js";

describe("configSchema", () => {
  const validConfig: Config = {
    project: {
      root: ".",
      packageManager: "pnpm",
      workspace: {
        include: ["packages/*"],
        exclude: [],
      },
    },
    commands: {
      build: {
        outputDir: "docs",
        manifest: {
          enabled: true,
          prefix: "/reference",
          path: "docs/manifest.json",
        },
        generator: {
          name: "vitepress",
          signatureLanguage: "typescript",
        },
      },
      check: {},
      generate: {
        jsdoc: {
          fetcher: () => Promise.resolve(""),
          prompt: "",
        },
      },
    },
    plugins: [],
  };

  it("should validate correct config", () => {
    const result = configSchema.safeParse(validConfig);

    expect(result.success).toBe(true);
  });

  it("should fail validation when project is missing", () => {
    const invalidConfig = { ...validConfig };
    delete (invalidConfig as Partial<Config>).project;

    const result = configSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it("should fail validation when packageManager is invalid", () => {
    const invalidConfig = {
      ...validConfig,
      project: {
        ...validConfig.project,
        packageManager:
          "invalid" as unknown as Config["project"]["packageManager"],
      },
    };

    const result = configSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it("should fail validation when workspace include is not array", () => {
    const invalidConfig = {
      ...validConfig,
      project: {
        ...validConfig.project,
        workspace: {
          ...validConfig.project.workspace,
          include:
            "not-array" as unknown as Config["project"]["workspace"]["include"],
        },
      },
    };

    const result = configSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it("should fail validation when commands is missing", () => {
    const invalidConfig = { ...validConfig };
    delete (invalidConfig as Partial<Config>).commands;

    const result = configSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it("should validate config with plugins", () => {
    const configWithPlugins = {
      ...validConfig,
      plugins: [
        {
          name: "test-plugin",
          plugin: () => ({}),
          options: { test: true },
        },
      ],
    };

    const result = configSchema.safeParse(configWithPlugins);
    expect(result.success).toBe(true);
  });

  it("should default plugins to empty array", () => {
    const configWithoutPlugins = { ...validConfig };
    delete (configWithoutPlugins as Partial<Config>).plugins;

    const result = configSchema.safeParse(configWithoutPlugins);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.plugins).toEqual([]);
    }
  });
});
