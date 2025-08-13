import z from "zod";

export const buildConfigSchema = z.object({
  manifest: z
    .object({
      prefix: z
        .string()
        .describe("Default prefix for documentation links")
        .default("docs/references"),
      enabled: z
        .boolean()
        .describe("Whether to generate manifest.json file")
        .default(true),
      path: z
        .string()
        .describe(
          "Path to save manifest file (relative to project root or absolute path). If not specified, uses outputDir/manifest.json",
        )
        .optional(),
    })
    .default({}),
  outputDir: z
    .string()
    .describe("Directory where build output will be saved")
    .default("docs/references"),
  generator: z.object({
    name: z.string().describe("Generator name (vitepress or plugin name)"),
    signatureLanguage: z
      .string()
      .optional()
      .default("typescript")
      .describe(
        "Language for code signature highlighting (e.g., typescript, tsx, javascript)",
      ),
    labels: z
      .object({
        parameters: z.string().default("Parameters"),
        returns: z.string().default("Returns"),
        throws: z.string().default("Throws"),
        examples: z.string().default("Examples"),
        see: z.string().default("See"),
        version: z.string().default("Version"),
        deprecated: z.string().default("Deprecated"),
        signature: z.string().default("Signature"),
        typedef: z.string().default("Type Definitions"),
      })
      .optional()
      .describe("Custom section labels"),
  }),
});
