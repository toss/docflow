import { ExportedDeclarations, JSDoc } from "ts-morph";

/**
 * @public
 * @kind interface
 * @category Parser
 * @name ParsedJSDoc
 * @description
 * Represents the parsed result of JSDoc templates used in Docflow.
 * 
 * @param {string} [name] Name of the documented element
 * @param {string} [description] Description of the element
 * @param {string} [category] Category classification of the element
 * @param {string} [kind] Type of declaration (function, class, interface, etc.)
 * @param {string} [signature] TypeScript signature of the element
 * @param {string} [deprecated] Deprecation notice (if applicable)
 * @param {ExampleData[]} [examples] Array of example code
 * @param {ParameterData[]} [parameters] Array of parameter information
 * @param {ReturnData} [returns] Return value information
 * @param {ThrowsData[]} [throws] Array of exception information
 * @param {TypedefData[]} [typedef] Array of type definitions
 * @param {SeeData[]} [see] Array of references to related documentation
 * @param {VersionData[]} [version] Array of version information
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
 * @param {string} name Name of the property
 * @param {string} description Description of the property
 * @param {boolean} required Whether the property is required
 * @param {string} [defaultValue] Default value if the property is optional
 */
interface PropertyData {
  name: string;
  description: string;
  required: boolean;
  defaultValue?: string;
}

/**
 * @public
 * @kind interface
 * @category Parser
 * @name ExampleData
 * @description
 * Represents the parsed result of @example tags in JSDoc.
 * 
 * @param {string} [title] Optional title of the example
 * @param {string} code Example code content
 * @param {string} [language] Programming language for syntax highlighting
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
 * @param {string} name Parameter name
 * @param {string} type Parameter type
 * @param {string} description Parameter description
 * @param {boolean} required Whether the parameter is required
 * @param {string} [defaultValue] Default value if the parameter is optional
 * @param {ParameterData[]} [nested] Nested parameter data for object parameters
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
 * @param {string} type Type of the return value
 * @param {string} [name] Optional name of the return value
 * @param {string} description Description of the return value
 * @param {PropertyData[]} [properties] Array of property information if the return value is an object
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
 * @param {string} type Type of the exception
 * @param {string} [name] Optional name of the exception
 * @param {string} description Exception occurrence conditions and description
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
 * @param {string} name Name of the type
 * @param {string} type Base type of the type (e.g., Object, Array, etc.)
 * @param {string} description Description of the type
 * @param {PropertyData[]} properties Array of property information if the type is an object
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
 * @param {string} reference URL or link to the external document to reference
 * @param {string} [description] Optional description for the reference
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
 * @param {string} version Version number
 * @param {string} description Description of changes in the version
 * @param {string[]} [platforms] List of supported platforms (optional)
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
 * @param {ParsedJSDoc} parsedJSDoc Parsed result of JSDoc templates used in Docflow
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
export type DeclarationKind =
  | "function"
  | "class"
  | "interface"
  | "type"
  | "enum"
  | "variable";

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
 * @param {StandardizedFilePath} filePath Standardized file path of the exported declaration
 * @param {string} symbolName Symbol name of the exported declaration
 * @param {ExportedDeclarations} declaration TypeScript declaration object
 * @param {DeclarationKind} kind Type of the declaration
 * @param {JSDoc} jsDoc Raw JSDoc data
 * @param {string} signature TypeScript signature string
 */
export type ExportDeclaration = {
  filePath: StandardizedFilePath;
  symbolName: string;
  declaration: ExportedDeclarations;
  kind: DeclarationKind;
  jsDoc: JSDoc;
  signature: string;
};
