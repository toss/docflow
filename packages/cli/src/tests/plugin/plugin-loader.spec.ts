import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { loadPlugins } from "../../plugins/load-plugins.js";
import { createE2EWorkspace, E2EWorkspace } from "../utils/create-e2e-workspace.js";
import { configSchema } from "../../config/config.schema.js";
import { SidebarItem } from "../../commands/build/manifest/manifest.js";
import { MOCK_CONFIG } from "../__mock__/config.mock.js";

describe("loadPlugins", () => {
  let workspace: E2EWorkspace;

  beforeEach(async () => {
    workspace = await createE2EWorkspace();
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it("should load external plugin from file", async () => {
    await workspace.write(
      "my-plugin.js",
      `
export default {
  name: "my-plugin",
  hooks: {
    transformManifest: (manifest) => {
      return manifest.map(item => ({ ...item, external: true }));
    }
  }
};
`
    );

    const config = configSchema.parse({
      ...MOCK_CONFIG,
      project: {
        ...MOCK_CONFIG.project,
        root: workspace.root,
      },
      plugins: [
        {
          name: "my-plugin",
          plugin: async () =>
            (await import(`${workspace.root}/my-plugin.js`)).default,
        },
      ],
    });

    const plugins = await loadPlugins(config);

    expect(plugins).toHaveLength(1);
    expect(plugins[0].name).toBe("my-plugin");
    expect(plugins[0].hooks.transformManifest).toBeDefined();
  });

  it("should load plugin with named export", async () => {
    await workspace.write(
      "named-plugin.js",
      `
export const myNamedPlugin = {
  name: "named-plugin",
  hooks: {
    provideGenerator: () => ({
      generate: () => ({ sections: [] }),
      serialize: () => "",
      generateDocs: () => []
    })
  }
};
`
    );

    const config = configSchema.parse({
      ...MOCK_CONFIG,
      project: {
        ...MOCK_CONFIG.project,
        root: workspace.root,
      },
      plugins: [
        {
          name: "myNamedPlugin",
          plugin: async () =>
            (await import(`${workspace.root}/named-plugin.js`)).myNamedPlugin,
        },
      ],
    });

    const plugins = await loadPlugins(config);

    expect(plugins).toHaveLength(1);
    expect(plugins[0].name).toBe("myNamedPlugin");
    expect(plugins[0].hooks.provideGenerator).toBeDefined();
  });

  it("should load inline plugin", async () => {
    const workspace = await createE2EWorkspace();
    const config = configSchema.parse({
      ...MOCK_CONFIG,
      project: {
        ...MOCK_CONFIG.project,
        root: workspace.root,
      },
      plugins: [
        {
          name: "inline-plugin",
          plugin: async () => ({
            name: "inline-plugin",
            hooks: {
              transformManifest: (manifest: SidebarItem[]) => {
                return manifest.map((item) => ({ ...item, inline: true }));
              },
            },
          }),
        },
      ],
    });

    const plugins = await loadPlugins(config);

    expect(plugins).toHaveLength(1);
    expect(plugins[0].name).toBe("inline-plugin");
    expect(plugins[0].hooks.transformManifest).toBeDefined();
  });

  it("should handle empty plugin list", async () => {
    const workspace = await createE2EWorkspace();
    const config = configSchema.parse({
      ...MOCK_CONFIG,
      project: {
        ...MOCK_CONFIG.project,
        root: workspace.root,
      },
      plugins: [],
    });

    const plugins = await loadPlugins(config);

    expect(plugins).toHaveLength(0);
  });

  it("should throw error for missing plugin file", async () => {
    const workspace = await createE2EWorkspace();
    const config = configSchema.parse({
      ...MOCK_CONFIG,
      project: {
        ...MOCK_CONFIG.project,
        root: workspace.root,
      },
      plugins: [
        {
          name: "missing-plugin",
          plugin: async () =>
            (await import(`${workspace.root}/nonexistent.js`)).default,
        },
      ],
    });

    await expect(loadPlugins(config)).rejects.toThrow(
      "Failed to load plugin 'missing-plugin'"
    );
  });

  it("should throw error for plugin without path or hooks", async () => {
    const workspace = await createE2EWorkspace();
    const config = configSchema.parse({
      ...MOCK_CONFIG,
      project: {
        ...MOCK_CONFIG.project,
        root: workspace.root,
      },
      plugins: [
        {
          name: "invalid-plugin",
          plugin: null as unknown as () => Promise<unknown>,
        },
      ],
    });

    await expect(loadPlugins(config)).rejects.toThrow(
      "pluginConfig.plugin is not a function"
    );
  });

  it("should throw error for invalid plugin export", async () => {
    const workspace = await createE2EWorkspace();
    await workspace.write(
      "invalid-plugin.js",
      `
export default "not a plugin object";
`
    );

    const config = configSchema.parse({
      ...MOCK_CONFIG,
      project: {
        ...MOCK_CONFIG.project,
        root: workspace.root,
      },
      plugins: [
        {
          name: "invalid-plugin",
          plugin: async () =>
            (await import(`${workspace.root}/invalid-plugin.js`)).default,
        },
      ],
    });

    await expect(loadPlugins(config)).rejects.toThrow(
      "did not return a valid plugin object"
    );
  });
});
