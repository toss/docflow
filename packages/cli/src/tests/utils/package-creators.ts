import { TestWorkspace } from "./create-test-workspace.js";

export async function createCorePackage(workspace: TestWorkspace): Promise<void> {
  await workspace.write("packages/core/package.json", {
    name: "@libs/core",
    version: "1.0.0",
    main: "./src/index.ts",
    types: "./src/index.ts",
    exports: {
      ".": {
        import: "./src/index.ts",
        require: "./src/index.ts",
      },
      "./math": {
        import: "./src/math.ts",
        require: "./src/math.ts",
      },
    },
  });

  await workspace.write("packages/core/tsconfig.json", {
    compilerOptions: {
      target: "ES2020",
      module: "ESNext",
      moduleResolution: "node",
      declaration: true,
      outDir: "./dist",
      rootDir: "./src",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "dist"],
  });

  await workspace.write(
    "packages/core/src/index.ts",
    `/**
 * @generate
 */
export function fetchData(url: string): Promise<unknown> {
  return fetch(url).then((response) => response.json());
}

export { UserConfig } from '@libs/types';

export function getDefaultConfig(): UserConfig {
  return { name: '', email: '', preferences: { theme: 'light', language: 'en', notifications: true } };
}

export * from './math.js';
export * from './string.js';
export * from './classes.js';
export * from './toolbar.js';`
  );

  await workspace.write(
    "packages/core/src/math.ts",
    `/**
 * @public
 * @kind function
 * @category Math
 * @name add
 * @signature
 * \`\`\`typescript
 * function add(a: number, b: number): number
 * \`\`\`
 * @description
 * Performs addition of two numbers and returns the result.
 * @param {number} a - First number
 * @param {number} b - Second number  
 * @returns {number} Sum of the two numbers
 * @example
 * \`\`\`typescript
 * import { add } from '@libs/core';
 * 
 * const result = add(5, 3);
 * console.log(result); // 8
 * \`\`\`
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * @public
 * @kind const
 * @category Math
 * @name multiply
 * @signature
 * \`\`\`typescript
 * const multiply: (x: number, y: number) => number
 * \`\`\`
 * @description
 * Multiplies two numbers.
 * @param {number} x - First number
 * @param {number} y - Second number
 * @returns {number} Product of the two numbers
 */
export const multiply = (x: number, y: number): number => x * y;

export function subtract(a: number, b: number): number {
  return a - b;
}

/**
 * @public
 */
export const PI = 3.14159;

/**
 * @public
 */
export enum Status {
  PENDING = "pending",
  SUCCESS = "success",
  ERROR = "error"
}`
  );

  await workspace.write(
    "packages/core/src/string.ts",
    `/**
 * @public
 * @kind function
 * @category String
 * @name toUpper
 * @signature
 * \`\`\`typescript
 * function toUpper(str: string): string
 * \`\`\`
 * @description
 * Converts string to uppercase.
 * @param {string} str - Input string
 * @returns {string} Uppercase string
 */
export function toUpper(str: string): string {
  return str.toUpperCase();
}

export function toLower(str: string): string {
  return str.toLowerCase();
}

/**
 * @public
 */
export const greet = (name: string) => \`Hello, \${name}!\`;`
  );

  // Nested object with barrel-exported typeof references (DevTool pattern)
  // ToolbarMenu is directly imported → in scope → resolved by name
  // Actions is imported as barrel object, CopyAction/PasteAction inside are NOT directly imported
  await workspace.write(
    "packages/core/src/toolbar/copy-action.ts",
    `export class CopyAction {
  execute(): void {}
}`
  );

  await workspace.write(
    "packages/core/src/toolbar/paste-action.ts",
    `export class PasteAction {
  execute(): void {}
}`
  );

  await workspace.write(
    "packages/core/src/toolbar/actions.ts",
    `import { CopyAction } from './copy-action';
import { PasteAction } from './paste-action';

export const Actions = {
  Copy: CopyAction,
  Paste: PasteAction,
};`
  );

  await workspace.write(
    "packages/core/src/toolbar/toolbar-menu.ts",
    `export class ToolbarMenu {
  open(): void {}
}`
  );

  await workspace.write(
    "packages/core/src/toolbar.ts",
    `import { ToolbarMenu } from './toolbar/toolbar-menu';
import { Actions } from './toolbar/actions';

export const Toolbar = {
  Menu: ToolbarMenu,
  Actions,
};`
  );

  await workspace.write(
    "packages/core/src/classes.ts",
    `import { UserConfig } from '@libs/types';

/**
 * <!-- This comment was AI-generated. Please review before using. -->
 * @public
 * @kind class
 * @category User Management
 * @name User
 * @signature
 * \`\`\`typescript
 * class User {
 *   constructor(name: string, age: number)
 *   greet(): string
 * }
 * \`\`\`
 * @description
 * Represents a user with basic information and functionality.
 * @example
 * \`\`\`typescript
 * import { User } from '@libs/core';
 * 
 * const user = new User('John Doe', 30);
 * console.log(user.name); // 'John Doe'
 * \`\`\`
 */
export class User {
  constructor(public name: string, public age: number) {}
  
  /**
   * <!-- This comment was AI-generated. Please review before using. -->
   * @public
   * @kind method
   * @category User Management
   * @name greet
   * @signature
   * \`\`\`typescript
   * greet(): string
   * \`\`\`
   * @description
   * Generates a personalized greeting message.
   * @returns {string} A greeting message
   */
  greet(): string {
    return \`Hello, I'm \${this.name}\`;
  }
}

export class ConfigManager {
  private config: UserConfig;
  
  constructor(config: UserConfig) {
    this.config = config;
  }
  
  getConfig(): UserConfig {
    return this.config;
  }
}

// Class without JSDoc
export class SimpleClass {
  value: number = 0;
  
  increment() {
    this.value++;
  }
}`
  );
}

export async function createMathPackage(workspace: TestWorkspace): Promise<void> {
  await workspace.write("packages/math/package.json", {
    name: "@libs/math",
    version: "1.0.0",
    main: "./src/index.ts",
    types: "./src/index.ts",
  });

  await workspace.write("packages/math/tsconfig.json", {
    compilerOptions: {
      target: "ES2020",
      module: "ESNext",
      moduleResolution: "node",
      declaration: true,
      outDir: "./dist",
      rootDir: "./src",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "dist"],
  });

  await workspace.write(
    "packages/math/src/index.ts",
    `/**
 * @generate
 */
export function calculateArea(radius: number): number {
  return Math.PI * radius * radius;
}

// New function without JSDoc - should be detected by check command
export function calculateVolume(radius: number, height: number): number {
  return Math.PI * radius * radius * height;
}`
  );
}

export async function createUtilsPackage(workspace: TestWorkspace): Promise<void> {
  await workspace.write("packages/utils/package.json", {
    name: "@libs/utils",
    version: "1.0.0",
    main: "./src/index.ts",
    types: "./src/index.ts",
  });

  await workspace.write("packages/utils/tsconfig.json", {
    compilerOptions: {
      target: "ES2020",
      module: "ESNext",
      moduleResolution: "node",
      declaration: true,
      outDir: "./dist",
      rootDir: "./src",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "dist"],
  });

  await workspace.write(
    "packages/utils/src/index.ts",
    `export * from './helpers.js';
export * from './validators.js';`
  );

  await workspace.write(
    "packages/utils/src/helpers.ts",
    `/**
 * @public
 * @kind function
 * @category Utilities
 * @name deepClone
 * @signature
 * \`\`\`typescript
 * function deepClone<T>(obj: T): T
 * \`\`\`
 * @description
 * Creates a deep copy of an object.
 * @param {T} obj - The object to clone
 * @returns {T} Deep copy of the object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * @public
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}`
  );

  await workspace.write(
    "packages/utils/src/validators.ts",
    `/**
 * @public
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
}

/**
 * @public
 */
export function hasRequiredFields(obj: Record<string, unknown>, requiredFields: string[]): boolean {
  return requiredFields.every(field => obj.hasOwnProperty(field) && obj[field] !== undefined);
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}`
  );
}

export async function createTypesPackage(workspace: TestWorkspace): Promise<void> {
  await workspace.write("packages/types/package.json", {
    name: "@libs/types",
    version: "1.0.0",
    main: "./src/index.ts",
    types: "./src/index.ts",
  });

  await workspace.write("packages/types/tsconfig.json", {
    compilerOptions: {
      target: "ES2020",
      module: "ESNext",
      moduleResolution: "node",
      declaration: true,
      outDir: "./dist",
      rootDir: "./src",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "dist"],
  });

  await workspace.write(
    "packages/types/src/index.ts",
    `/**
 * User configuration interface
 */
export interface UserConfig {
  name: string;
  email: string;
  preferences: UserPreferences;
}

/**
 * User preferences configuration
 */
export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface RequestOptions {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

export type ID = string | number;
export type Handler<T> = (value: T) => void;

/**
 * @public
 * @name ServerOptions
 */
export interface ServerOptions {
  /** The port to listen on. */
  port: number;
  /** The host configuration. */
  host: {
    /** The hostname. */
    name: string;
    /** The protocol to use. */
    protocol: 'http' | 'https';
  };
  /**
   * Optional timeout in milliseconds.
   *
   * Set to 0 to disable.
   */
  timeout?: number;
}

/**
 * @public
 * @name ServerConfig
 */
export type ServerConfig = {
  /** The environment name. */
  env: string;
  /** The connection settings. */
  connection: {
    /** The database URL. */
    url: string;
  };
};

/**
 * @public
 * @name Server
 */
export class Server {
  /** The server name. */
  name: string;

  /** The current status. */
  status: string;

  constructor(name: string, status: string) {
    this.name = name;
    this.status = status;
  }

  /**
   * Starts the server.
   *
   * @param message - The startup message
   */
  start(message: string): void {
    console.log(message);
  }
}`
  );
}
