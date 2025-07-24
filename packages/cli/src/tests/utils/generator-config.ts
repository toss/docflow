import { GeneratorConfig } from "../../core/types/generator.types.js";

export const DEFAULT_GENERATOR_CONFIG: GeneratorConfig = {
  name: "vitepress",
  projectRoot: "",
  signatureLanguage: "typescript",
  labels: {
    parameters: "Parameters",
    returns: "Returns",
    throws: "Throws",
    examples: "Examples",
    deprecated: "Deprecated",
    see: "See Also",
    version: "Version",
    signature: "Signature",
  },
};

export function createGeneratorConfig(overrides: Partial<GeneratorConfig> = {}): GeneratorConfig {
  return { ...DEFAULT_GENERATOR_CONFIG, ...overrides };
}