import { VitePressGenerator } from "../../core/generator/vitepress/vitepress-generator.js";
import { Plugin } from "../types/plugin.types.js";
import { GeneratorConfig } from "../../core/types/generator.types.js";

export function createVitePressPlugin(config: GeneratorConfig): Plugin {
  return {
    name: "vitepress",
    hooks: {
      provideGenerator: () => new VitePressGenerator(config),
    },
  };
}
