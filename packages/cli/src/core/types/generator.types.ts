import { TargetWithJSDoc, ParsedJSDoc, StandardizedFilePath } from "./parser.types.js";

/**
 * @public
 * @kind interface
 * @category Generator
 * @name GeneratorConfig
 * @description
 * Configuration for the markdown generator. Defines generator name, project root, labels, and signature language.
 *
 * @property {string} name Name of the generator (e.g., 'vitepress', 'nextra')
 * @property {string} projectRoot Absolute path to the project root directory
 * @property {object} [labels] Custom labels for documentation sections
 * @property {string} [labels.parameters] Label for the parameters section
 * @property {string} [labels.returns] Label for the returns section
 * @property {string} [labels.throws] Label for the throws section
 * @property {string} [labels.examples] Label for the examples section
 * @property {string} [labels.see] Label for the see section
 * @property {string} [labels.version] Label for the version section
 * @property {string} [labels.deprecated] Label for the deprecated section
 * @property {string} [labels.signature] Label for the signature section
 * @property {string} [labels.typedef] Label for the typedef section
 * @property {string} [labels.properties] Label for the properties section
 * @property {string} [signatureLanguage] Language for code signature highlighting (e.g., 'typescript', 'tsx')
 */
export interface GeneratorConfig {
  name: string;
  projectRoot: string;
  labels?: {
    parameters?: string;
    returns?: string;
    throws?: string;
    examples?: string;
    see?: string;
    version?: string;
    deprecated?: string;
    signature?: string;
    typedef?: string;
    properties?: string;
  };
  signatureLanguage?: string;
}

export const defaultVitePressLabels = {
  parameters: "Parameters",
  properties: "Properties",
  returns: "Returns",
  throws: "Throws",
  examples: "Examples",
  see: "See",
  version: "Version",
  deprecated: "Deprecated",
  signature: "Signature",
  typedef: "Typedef",
};

/**
 * @public
 * @kind interface
 * @category Generator
 * @name MarkdownSection
 * @description
 * Interface representing a section of a markdown document.
 *
 * @property {string} type Type of the markdown section (title, description, signature, etc.)
 * @property {string} content Section content in markdown format
 */
export interface MarkdownSection {
  type: MarkdownSectionType;
  content: string;
}

type MarkdownSectionType =
  | "title"
  | "description"
  | "deprecated"
  | "signature"
  | "parameters"
  | "properties"
  | "returns"
  | "throws"
  | "typedef"
  | "examples"
  | "see"
  | "version";

/**
 * @public
 * @kind interface
 * @category Generator
 * @name MarkdownDocument
 * @description
 * Structure representing a complete markdown document with optional frontmatter and sections.
 *
 * @property {object} [frontmatter] Optional frontmatter data for the document
 * @property {MarkdownSection[]} sections Array of sections that make up the document content
 */
export interface MarkdownDocument {
  frontmatter?: Record<string, unknown>;
  sections: MarkdownSection[];
}

/**
 * @public
 * @kind interface
 * @category Generator
 * @name GeneratedDoc
 * @description
 * Document generation result containing file path, content, and relative path information.
 *
 * @property {StandardizedFilePath} filePath Absolute file path where the document will be saved
 * @property {string} content Generated markdown content
 * @property {string} relativePath Relative path from the output directory
 */
export interface GeneratedDoc {
  filePath: StandardizedFilePath;
  content: string;
  relativePath: string;
}

/**
 * @public
 * @kind interface
 * @category Generator
 * @name MarkdownGenerator
 * @description
 * Interface for markdown generators that convert JSDoc data to markdown documents.
 *
 * @property {function} generate Function to convert JSDoc data to markdown document structure
 * @property {function} serialize Function to convert markdown document to string
 * @property {function} generateDocs Function to generate document files from targets
 */
export interface MarkdownGenerator {
  generate(jsDocData: ParsedJSDoc, sourcePath?: string): MarkdownDocument;
  serialize(markdownDoc: MarkdownDocument): string;
  generateDocs(targetsWithJSDoc: TargetWithJSDoc, packagePath: string): GeneratedDoc;
}
