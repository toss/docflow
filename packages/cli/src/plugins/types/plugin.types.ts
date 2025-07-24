import { SidebarItem } from "../../commands/build/manifest/manifest.js";
import { Config } from "../../config/config.schema.js";
import { MarkdownGenerator } from "../../core/types/generator.types.js";

/**
 * @public
 * @kind interface
 * @category Plugin
 * @name PluginContext
 * @description
 * Context information passed during plugin execution. Includes workspace path and configuration data.
 * 
 * @param {string} [workspacePath] Absolute path to the workspace root directory
 * @param {Config} [config] Complete configuration object including project, command, and plugin settings
 */
export interface PluginContext {
  workspacePath?: string;
  config?: Config;
}

/**
 * @public
 * @kind interface
 * @category Plugin
 * @name Plugin
 * @description
 * Interface defining the basic structure of a Docflow plugin. Includes plugin name and hook functions.
 * 
 * @param {string} name Unique identifier for the plugin
 * @param {object} hooks Object containing hook functions that the plugin can implement
 * @param {function} [hooks.transformManifest] Hook to transform generated manifest data
 * @param {function} [hooks.provideGenerator] Hook to provide a custom markdown generator
 */
export interface Plugin {
  name: string;
  hooks: {
    transformManifest?: (
      manifest: SidebarItem[],
      context: PluginContext,
    ) => SidebarItem[];
    provideGenerator?: () => MarkdownGenerator;
  };
}
