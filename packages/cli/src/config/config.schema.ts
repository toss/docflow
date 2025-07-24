import { z } from "zod";
import { buildConfigSchema } from "../commands/build/build.schema.js";
import { generateConfigSchema } from "../commands/generate/generate.schema.js";
import { checkConfigSchema } from "../commands/check/check.schema.js";

export const configSchema = z.object({
  project: z.object({
    root: z.string().describe("Project root directory"),
    packageManager: z.enum(["yarn", "pnpm", "npm"]).describe("Package manager"),
    workspace: z.object({
      include: z
        .array(z.string())
        .describe("Package patterns to include in build"),
      exclude: z
        .array(z.string())
        .describe("Package patterns to exclude from build"),
    }),
  }),
  commands: z.object({
    build: buildConfigSchema,
    check: checkConfigSchema,
    generate: generateConfigSchema,
  }),
  plugins: z
    .array(
      z.object({
        name: z.string().describe("Plugin name"),
        plugin: z
          .function()
          .describe("Plugin factory function that returns plugin instance"),
        options: z.record(z.any()).optional().describe("Plugin options"),
      }),
    )
    .optional()
    .default([]),
});

/**
 * @public
 * @kind type
 * @category Configuration
 * @name Config
 * @description
 * Type for Docflow configuration files. Includes project settings, command settings, and plugin settings.
 * 
 * @param {object} project Project configuration information
 * @param {string} project.root Project root directory
 * @param {"yarn" | "pnpm" | "npm"} project.packageManager Package manager to use
 * @param {object} project.workspace Workspace configuration
 * @param {string[]} project.workspace.include Package patterns to include in build
 * @param {string[]} project.workspace.exclude Package patterns to exclude from build
 * @param {object} commands Command settings
 * @param {object} commands.build Build command settings
 * @param {object} commands.check Check command settings
 * @param {object} commands.generate Generate command settings
 * @param {object[]} [plugins] Plugin settings
 * @param {string} plugins.name Plugin name
 * @param {function} plugins.plugin Factory function that returns plugin instance
 * @param {object} [plugins.options] Plugin options
 */
export type Config = z.infer<typeof configSchema>;
