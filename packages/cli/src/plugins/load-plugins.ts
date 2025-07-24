import { Plugin } from "./types/plugin.types.js";
import { Config } from "../config/config.schema.js";

export async function loadPlugins(config: Config): Promise<Plugin[]> {
  const plugins: Plugin[] = [];

  for (const pluginConfig of config.plugins) {
    try {
      const pluginInstance = await pluginConfig.plugin(
        pluginConfig.options || {},
      );

      if (!pluginInstance || typeof pluginInstance !== "object") {
        throw new Error(
          `Plugin factory for '${pluginConfig.name}' did not return a valid plugin object`,
        );
      }

      const plugin = pluginInstance as Plugin;

      if (!plugin.hooks) {
        throw new Error(
          `Plugin '${pluginConfig.name}' must have hooks defined`,
        );
      }

      plugin.name = pluginConfig.name;
      plugins.push(plugin);
    } catch (error) {
      throw new Error(
        `Failed to load plugin '${pluginConfig.name}': ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  return plugins;
}
