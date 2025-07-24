import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { PluginManager } from "../../plugins/plugin-manager.js";
import { Plugin } from "../../plugins/types/plugin.types.js";
import { SidebarItem } from "../../commands/build/manifest/manifest.js";
import { loadConfig } from "../../config/load-config.js";
import { createE2EWorkspace, E2EWorkspace } from "../utils/create-e2e-workspace.js";
import { Config } from "../../config/config.schema.js";
import { MockPlugins } from "../utils/plugin-mocks.js";
import {
  GeneratedDoc,
  MarkdownDocument,
  MarkdownGenerator,
} from "../../core/types/generator.types.js";
import {
  ParsedJSDoc,
  StandardizedFilePath,
  TargetWithJSDoc,
} from "../../core/types/parser.types.js";

describe("PluginManager", () => {
  it("should register single plugin", () => {
    const manager = new PluginManager();
    const plugin = MockPlugins.empty("test-plugin");

    manager.register(plugin);

    expect(manager.getPlugins()).toHaveLength(1);
    expect(manager.getPlugins()[0].name).toBe("test-plugin");
  });

  it("should register multiple plugins", () => {
    const manager = new PluginManager();
    const plugins = [
      MockPlugins.empty("plugin-1"),
      MockPlugins.empty("plugin-2"),
    ];

    manager.registerAll(plugins);

    expect(manager.getPlugins()).toHaveLength(2);
  });

  it("should transform manifest through plugins", () => {
    const manager = new PluginManager();
    const plugin = MockPlugins.manifestMarker("transform-plugin", {
      modified: true,
    });

    manager.register(plugin);

    const input = [{ text: "test" }];
    const result = manager.transformManifest(input);

    expect(result[0]).toEqual({ text: "test", modified: true });
  });

  it("should apply multiple transformations in order", () => {
    const manager = new PluginManager();

    manager.registerAll([
      MockPlugins.manifestAppender("plugin-1", { text: "added-by-1" }),
      MockPlugins.manifestAppender("plugin-2", { text: "added-by-2" }),
    ]);

    const input: SidebarItem[] = [];
    const result = manager.transformManifest(input);

    expect(result).toHaveLength(2);
    expect(result[0].text).toBe("added-by-1");
    expect(result[1].text).toBe("added-by-2");
  });

  describe("Generator functionality", () => {
    let workspace: E2EWorkspace;

    beforeEach(async () => {
      workspace = await createE2EWorkspace();
    });

    afterEach(async () => {
      await workspace.cleanup();
    });

    it("should return VitePressGenerator for 'vitepress'", async () => {
      const config = await loadConfig(workspace.root);
      const manager = new PluginManager();

      const generator = manager.getGenerator(config);

      expect(generator).toBeDefined();
      expect(typeof generator.generate).toBe("function");
      expect(typeof generator.serialize).toBe("function");
    });

    it("should return custom generator from plugin", async () => {
      let config = await loadConfig(workspace.root);
      const manager = new PluginManager();

      const mockGenerator: MarkdownGenerator = {
        generateDocs: () => ({
          filePath: "" as StandardizedFilePath,
          content: "",
          relativePath: "",
        }),
        generate: (jsDocData: ParsedJSDoc): MarkdownDocument => ({
          frontmatter: { title: jsDocData.name },
          sections: [
            {
              type: "title",
              content: `# ${jsDocData.name}`,
            },
          ],
        }),
        serialize: (doc: MarkdownDocument): string => {
          return doc.sections.map((s) => s.content).join("\n");
        },
      };

      config.commands.build.generator.name = "custom-generator";

      const plugin: Plugin = {
        name: "custom-generator",
        hooks: {
          provideGenerator: () => mockGenerator,
        },
      };

      manager.register(plugin);

      const generator = manager.getGenerator(config);

      expect(generator).toBe(mockGenerator);
    });

    it("should throw error for unknown generator", async () => {
      let config = await loadConfig(workspace.root);
      const manager = new PluginManager();

      config.commands.build.generator.name = "unknown-generator";

      expect(() => {
        manager.getGenerator(config);
      }).toThrow("Generator 'unknown-generator' not found");
    });

    it("should list available generators in error message", async () => {
      let config = await loadConfig(workspace.root);
      const manager = new PluginManager();

      const plugin1: Plugin = {
        name: "custom-1",
        hooks: {
          provideGenerator: () => ({
            generate: () => ({ sections: [] }),
            serialize: () => "",
            generateDocs: () => ({
              filePath: "" as StandardizedFilePath,
              content: "",
              relativePath: "",
            }),
          }),
        },
      };

      const plugin2: Plugin = {
        name: "custom-2",
        hooks: {
          provideGenerator: () => ({
            generate: () => ({ sections: [] }),
            serialize: () => "",
            generateDocs: () => ({
              filePath: "" as StandardizedFilePath,
              content: "",
              relativePath: "",
            }),
          }),
        },
      };

      manager.registerAll([plugin1, plugin2]);

      config.commands.build.generator.name = "unknown";

      expect(() => {
        manager.getGenerator(config);
      }).toThrow(
        "Generator 'unknown' not found. Available: vitepress, custom-1, custom-2"
      );
    });

    it("should work with plugin that doesn't provide generator", async () => {
      let config = await loadConfig(workspace.root);
      const manager = new PluginManager();

      const plugin: Plugin = {
        name: "manifest-only-plugin",
        hooks: {
          transformManifest: (manifest) => manifest,
        },
      };

      manager.register(plugin);

      config.commands.build.generator.name = "manifest-only-plugin";

      expect(() => {
        manager.getGenerator(config);
      }).toThrow("Generator 'manifest-only-plugin' not found");
    });

    it("should generate and serialize with custom generator", async () => {
      let config = await loadConfig(workspace.root);
      const manager = new PluginManager();

      const mockGenerator: MarkdownGenerator = {
        generateDocs: (_: TargetWithJSDoc, __: string): GeneratedDoc => ({
          filePath: "" as StandardizedFilePath,
          content: "",
          relativePath: "",
        }),
        generate: (jsDocData: ParsedJSDoc): MarkdownDocument => ({
          frontmatter: { title: jsDocData.name },
          sections: [
            {
              type: "title",
              content: `# ${jsDocData.name}`,
            },
            {
              type: "description",
              content: jsDocData.description || "No description",
            },
          ],
        }),
        serialize: (doc: MarkdownDocument): string => {
          let result = "";
          if (doc.frontmatter) {
            result += "---\n";
            for (const [key, value] of Object.entries(doc.frontmatter)) {
              result += `${key}: ${JSON.stringify(value)}\n`;
            }
            result += "---\n\n";
          }
          result += doc.sections.map((s) => s.content).join("\n\n");
          return result;
        },
      };

      config.commands.build.generator.name = "test-generator";

      const plugin: Plugin = {
        name: "test-generator",
        hooks: {
          provideGenerator: () => mockGenerator,
        },
      };

      manager.register(plugin);

      const generator = manager.getGenerator(config);

      const jsDocData: ParsedJSDoc = {
        name: "testFunction",
        description: "A test function",
        examples: [],
        parameters: [],
        throws: [],
        typedef: [],
        see: [],
        version: [],
      };

      const markdownDoc = generator.generate(jsDocData);
      expect(markdownDoc.frontmatter?.title).toBe("testFunction");
      expect(markdownDoc.sections).toHaveLength(2);

      const serialized = generator.serialize(markdownDoc);
      expect(serialized).toContain("---");
      expect(serialized).toContain('title: "testFunction"');
      expect(serialized).toContain("# testFunction");
      expect(serialized).toContain("A test function");
    });
  });
});
