import { ExportedDeclarations, JSDoc } from "ts-morph";

/**
 * @public
 * @kind interface
 * @category Parser
 * @name ParsedJSDoc
 * @description
 * Represents the parsed result of JSDoc templates used in Docflow.
 *
 * @property {string} [name] Name of the documented element
 * @property {string} [description] Description of the element
 * @property {string} [category] Category classification of the element
 * @property {string} [kind] Type of declaration (function, class, interface, etc.)
 * @property {string} [signature] TypeScript signature of the element
 * @property {string} [deprecated] Deprecation notice (if applicable)
 * @property {ExampleData[]} [examples] Array of example code
 * @property {ParameterData[]} [parameters] Array of parameter information
 * @property {PropertyData[]} [properties] Array of property information for interface/type declarations
 * @property {ReturnData} [returns] Return value information
 * @property {ThrowsData[]} [throws] Array of exception information
 * @property {TypedefData[]} [typedef] Array of type definitions
 * @property {SeeData[]} [see] Array of references to related documentation
 * @property {VersionData[]} [version] Array of version information
 */
export interface ParsedJSDoc {
  name?: string;
  description?: string;
  category?: string;
  kind?: string;
  signature?: string;
  deprecated?: string;
  examples?: ExampleData[];
  parameters?: ParameterData[];
  properties?: PropertyData[];
  returns?: ReturnData;
  throws?: ThrowsData[];
  typedef?: TypedefData[];
  see?: SeeData[];
  version?: VersionData[];
}

/**
 * @public
 * @kind interface
 * @category Parser
 * @name PropertyData
 * @description
 * Represents property information of an object type. Used to describe object properties in ReturnData and TypedefData.
 *
 * @property {string} name Name of the property
 * @property {string} [type] Type of the property
 * @property {string} description Description of the property
 * @property {boolean} required Whether the property is required
 * @property {string} [defaultValue] Default value if the property is optional
 */
export interface PropertyData {
  name: string;
  type?: string;
  description: string;
  required: boolean;
  defaultValue?: string;
  nested?: PropertyData[];
}

/**
 * @public
 * @kind interface
 * @category Parser
 * @name ExampleData
 * @description
 * Represents the parsed result of @example tags in JSDoc.
 *
 * @property {string} [title] Optional title of the example
 * @property {string} code Example code content
 * @property {string} [language] Programming language for syntax highlighting
 */
export interface ExampleData {
  title?: string;
  code: string;
  language?: string;
}

/**
 * @public
 * @kind interface
 * @category Parser
 * @name ParameterData
 * @description
 * Represents the parsed result of @param tags in JSDoc.
 *
 * @property {string} name Parameter name
 * @property {string} type Parameter type
 * @property {string} description Parameter description
 * @property {boolean} required Whether the parameter is required
 * @property {string} [defaultValue] Default value if the parameter is optional
 * @property {ParameterData[]} [nested] Nested parameter data for object parameters
 */
export interface ParameterData {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
  nested?: ParameterData[];
}

/**
 * @public
 * @kind interface
 * @category Parser
 * @name ReturnData
 * @description
 * Represents the parsed result of @returns tags in JSDoc. Used to describe return value information of functions.
 *
 * @property {string} type Type of the return value
 * @property {string} [name] Optional name of the return value
 * @property {string} description Description of the return value
 * @property {PropertyData[]} [properties] Array of property information if the return value is an object
 */
export interface ReturnData {
  type: string;
  name?: string;
  description: string;
  properties?: PropertyData[];
}

/**
 * @public
 * @kind interface
 * @category Parser
 * @name ThrowsData
 * @description
 * Represents the parsed result of @throws tags in JSDoc. Used to describe exception information that can occur in functions.
 *
 * @property {string} type Type of the exception
 * @property {string} [name] Optional name of the exception
 * @property {string} description Exception occurrence conditions and description
 */
export interface ThrowsData {
  type: string;
  name?: string;
  description: string;
}

/**
 * @public
 * @kind interface
 * @category Parser
 * @name TypedefData
 * @description
 * Represents the parsed result of @typedef tags in JSDoc. Used to define custom types or complex object structures.
 *
 * @property {string} name Name of the type
 * @property {string} type Base type of the type (e.g., Object, Array, etc.)
 * @property {string} description Description of the type
 * @property {PropertyData[]} properties Array of property information if the type is an object
 */
export interface TypedefData {
  name: string;
  type: string;
  description: string;
  properties: PropertyData[];
}

/**
 * @public
 * @kind interface
 * @category Parser
 * @name SeeData
 * @description
 * Represents the parsed result of @see tags in JSDoc. Used to provide references to external documents or related content.
 *
 * @property {string} reference URL or link to the external document to reference
 * @property {string} [description] Optional description for the reference
 */
export interface SeeData {
  reference: string;
  description?: string;
}

/**
 * @public
 * @kind interface
 * @category Parser
 * @name VersionData
 * @description
 * Represents the parsed result of @version tags in JSDoc. Used to display version information in table format.
 *
 * @property {string} version Version number
 * @property {string} description Description of changes in the version
 * @property {string[]} [platforms] List of supported platforms (optional)
 */
export interface VersionData {
  version: string;
  description: string;
  platforms?: string[];
}

/**
 * @public
 * @kind interface
 * @category Parser
 * @name TargetWithJSDoc
 * @description
 * Parsed JSDoc data for document generation, extending the [ExportDeclaration](/en/reference/cli/parser/ExportDeclaration) interface.
 *
 * @property {ParsedJSDoc} parsedJSDoc Parsed result of JSDoc templates used in Docflow
 */
export interface TargetWithJSDoc extends ExportDeclaration {
  parsedJSDoc: ParsedJSDoc;
}

/**
 * @public
 * @kind type
 * @category Parser
 * @name DeclarationKind
 * @description
 * Represents the types of TypeScript declarations that can be documented.
 */
export type DeclarationKind = "function" | "class" | "interface" | "type" | "enum" | "variable";

/**
 * @public
 * @kind type
 * @category Parser
 * @name StandardizedFilePath
 * @description
 * Standardized file path type used in ts-morph.
 */
export type StandardizedFilePath = string & {
  _standardizedFilePathBrand: undefined;
};

/**
 * @public
 * @kind type
 * @category Parser
 * @name ExportDeclaration
 * @description
 * Represents an exported declaration with metadata including file path, symbol name, and JSDoc information.
 *
 * @property {StandardizedFilePath} filePath Standardized file path of the exported declaration
 * @property {string} symbolName Symbol name of the exported declaration
 * @property {ExportedDeclarations} declaration TypeScript declaration object
 * @property {DeclarationKind} kind Type of the declaration
 * @property {JSDoc} jsDoc Raw JSDoc data
 * @property {string} signature TypeScript signature string
 */
export type ExportDeclaration = {
  filePath: StandardizedFilePath;
  symbolName: string;
  declaration: ExportedDeclarations;
  kind: DeclarationKind;
  jsDoc: JSDoc;
  signature: string;
};
