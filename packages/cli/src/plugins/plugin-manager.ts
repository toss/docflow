import { SidebarItem } from "../commands/build/manifest/manifest.js";
import { Plugin, PluginContext } from "./types/plugin.types.js";
import { MarkdownGenerator } from "../core/types/generator.types.js";
import { createVitePressPlugin } from "./builtin/vitepress-plugin.js";
import path from "path";

import { Config } from "../config/config.schema.js";

export class PluginManager {
  private plugins: Plugin[] = [];
  private context: PluginContext;

  constructor(context: PluginContext = {}) {
    this.context = context;
  }

  register(plugin: Plugin) {
    this.plugins.push(plugin);
  }

  registerAll(plugins: Plugin[]) {
    this.plugins.push(...plugins);
  }

  transformManifest(manifest: SidebarItem[]): SidebarItem[] {
    return this.plugins.reduce<SidebarItem[]>((current, plugin) => {
      const { transformManifest } = plugin.hooks;

      return transformManifest
        ? transformManifest(current, this.context)
        : current;
    }, manifest);
  }

  getGenerator(config: Config): MarkdownGenerator {
    const generatorConfig = config.commands.build.generator;

    if (generatorConfig.name === "vitepress") {
      const vitepressPlugin = createVitePressPlugin({
        ...generatorConfig,
        projectRoot: path.resolve(config.project.root),
      });

      if (vitepressPlugin.hooks.provideGenerator) {
        return vitepressPlugin.hooks.provideGenerator();
      }
    }

    const plugin = this.plugins.find((p) => p.name === generatorConfig.name);
    if (plugin?.hooks.provideGenerator) {
      return plugin.hooks.provideGenerator();
    }

    const availableGenerators = [
      "vitepress",
      ...this.plugins
        .filter((p) => p.hooks.provideGenerator)
        .map((p) => p.name),
    ];
    throw new Error(
      `Generator '${
        generatorConfig.name
      }' not found. Available: ${availableGenerators.join(", ")}`,
    );
  }

  getPlugins(): Plugin[] {
    return [...this.plugins];
  }
}
