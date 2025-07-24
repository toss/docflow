export type { Config } from "./config/config.schema.js";

export type { Plugin, PluginContext } from "./plugins/types/plugin.types.js";

export type {
  MarkdownGenerator,
  GeneratorConfig,
  MarkdownDocument,
  MarkdownSection,
  GeneratedDoc,
} from "./core/types/generator.types.js";

export type {
  ParsedJSDoc,
  TargetWithJSDoc,
  ExportDeclaration,
  DeclarationKind,
  StandardizedFilePath,
  ParameterData,
  ReturnData,
  ThrowsData,
  ExampleData,
  SeeData,
  VersionData,
  TypedefData,
} from "./core/types/parser.types.js";

export type { SidebarItem } from "./commands/build/manifest/manifest.js";
