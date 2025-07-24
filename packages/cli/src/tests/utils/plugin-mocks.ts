import { Plugin } from "../../plugins/types/plugin.types.js";
import { SidebarItem } from "../../commands/build/manifest/manifest.js";
import { MarkdownGenerator } from "../../core/types/generator.types.js";
import { StandardizedFilePath } from "../../core/types/parser.types.js";

export const MockPlugins = {
  empty: (name: string = "test-plugin"): Plugin => ({
    name,
    hooks: {},
  }),

  basicGenerator: (name: string = "mock-generator"): Plugin => ({
    name,
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
  }),

  manifestAppender: (name: string, itemToAdd: SidebarItem): Plugin => ({
    name,
    hooks: {
      transformManifest: (manifest) => [...manifest, itemToAdd],
    },
  }),

  manifestMarker: (name: string, marker: Record<string, unknown>): Plugin => ({
    name,
    hooks: {
      transformManifest: (manifest) =>
        manifest.map((item) => ({ ...item, ...marker })),
    },
  }),
};

export function createManifestTransformPlugin(
  name: string,
  transform: (manifest: SidebarItem[]) => SidebarItem[]
): Plugin {
  return {
    name,
    hooks: {
      transformManifest: transform,
    },
  };
}

export function createGeneratorPlugin(
  name: string,
  generator: MarkdownGenerator
): Plugin {
  return {
    name,
    hooks: {
      provideGenerator: () => generator,
    },
  };
}
