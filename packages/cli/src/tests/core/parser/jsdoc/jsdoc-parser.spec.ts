import { describe, it, expect, beforeEach } from "vitest";
import { Project, JSDoc } from "ts-morph";
import { JSDocParser } from "../../../../core/parser/jsdoc/jsdoc-parser.js";

describe("JSDocParser", () => {
  let parser: JSDocParser;
  let project: Project;

  beforeEach(() => {
    parser = new JSDocParser();
    project = new Project({ useInMemoryFileSystem: true });
  });

  describe("parse", () => {
    it("should parse basic JSDoc comment", () => {
      const sourceFile = project.createSourceFile(
        "test.ts",
        `
/**
 * @description A simple function that adds two numbers
 * @param {number} a - The first number
 * @param {number} b - The second number
 * @returns {number} The sum of a and b
 */
export function add(a: number, b: number): number {
  return a + b;
}
        `
      );

      const func = sourceFile.getFunction("add")!;
      const jsDoc = func.getJsDocs()[0]!;

      const result = parser.parse(jsDoc);
      expect(result.description).toContain(
        "A simple function that adds two numbers"
      );
      expect(result.parameters).toHaveLength(2);
      expect(result.parameters?.[0].name).toBe("a");
      expect(result.parameters?.[0].type).toBe("number");
      expect(result.parameters?.[1].name).toBe("b");
      expect(result.parameters?.[1].type).toBe("number");
      expect(result.returns?.type).toBe("number");
    });

    it("should parse JSDoc with examples", () => {
      const sourceFile = project.createSourceFile(
        "test.ts",
        `
/**
 * Calculates the area of a circle
 * @param {number} radius - The radius of the circle
 * @returns {number} The area
 * @example
 * const area = calculateArea(5);
 * console.log(area); // 78.54
 */
export function calculateArea(radius: number): number {
  return Math.PI * radius * radius;
}
        `
      );

      const func = sourceFile.getFunction("calculateArea")!;
      const jsDoc = func.getJsDocs()[0]!;

      const result = parser.parse(jsDoc);

      expect(result.examples).toHaveLength(1);
      expect(result.examples![0].code).toContain("calculateArea(5)");
    });

    it("should parse JSDoc with category and kind tags", () => {
      const sourceFile = project.createSourceFile(
        "test.ts",
        `
/**
 * @category Math
 * @kind function
 * @name calculateArea
 */
export function calculateArea(radius: number): number {
  return Math.PI * radius * radius;
}
        `
      );

      const func = sourceFile.getFunction("calculateArea")!;
      const jsDoc = func.getJsDocs()[0]!;

      const result = parser.parse(jsDoc);

      expect(result.category).toBe("Math");
      expect(result.kind).toBe("function");
      expect(result.name).toBe("calculateArea");
    });

    it("should parse JSDoc with deprecated tag", () => {
      const sourceFile = project.createSourceFile(
        "test.ts",
        `
/**
 * @deprecated Use newFunction instead
 */
export function oldFunction(): void {
  // deprecated implementation
}
        `
      );

      const func = sourceFile.getFunction("oldFunction")!;
      const jsDoc = func.getJsDocs()[0]!;

      const result = parser.parse(jsDoc);

      expect(result.deprecated).toBe("Use newFunction instead");
    });

    it("should parse JSDoc with throws tag", () => {
      const sourceFile = project.createSourceFile(
        "test.ts",
        `
/**
 * @throws {Error} When input is invalid
 * @throws {TypeError} When parameter is not a number
 */
export function riskyFunction(input: unknown): number {
  if (typeof input !== 'number') throw new TypeError('Not a number');
  return input;
}
        `
      );

      const func = sourceFile.getFunction("riskyFunction")!;
      const jsDoc = func.getJsDocs()[0]!;

      const result = parser.parse(jsDoc);

      expect(result.throws).toHaveLength(2);
      expect(result.throws![0].type).toBe("Error");
      expect(result.throws![1].type).toBe("TypeError");
    });

    it("should parse JSDoc with see tag", () => {
      const sourceFile = project.createSourceFile(
        "test.ts",
        `
/**
 * @see https://example.com/docs
 * @see {@link OtherFunction}
 */
export function testFunction(): void {
  // implementation
}
        `
      );

      const func = sourceFile.getFunction("testFunction")!;
      const jsDoc = func.getJsDocs()[0]!;

      const result = parser.parse(jsDoc);
      expect(result.see).toHaveLength(2);
      expect(result.see![0].reference).toBe("https://example.com/docs");
      expect(result.see![1].reference).toBe("@link OtherFunction");
    });

    it("should parse complex JSDoc with multiple tags", () => {
      const sourceFile = project.createSourceFile(
        "test.ts",
        `
/**
 * <!-- This comment was AI-generated. Please review before using. -->
 * @public
 * @kind function
 * @category Math
 * @name multiply
 * @signature
 * \`\`\`typescript
 * function multiply(x: number, y: number): number
 * \`\`\`
 * @description
 * Multiplies two numbers together and returns the result.
 * @param {number} x - The first number to multiply
 * @param {number} y - The second number to multiply
 * @returns {number} The product of the two numbers
 * @example
 * \`\`\`typescript
 * import { multiply } from '@test/core';
 * 
 * const result = multiply(4, 5);
 * console.log(result); // 20
 * \`\`\`
 */
export function multiply(x: number, y: number): number {
  return x * y;
}
        `
      );

      const func = sourceFile.getFunction("multiply")!;
      const jsDoc = func.getJsDocs()[0]!;

      const result = parser.parse(jsDoc);

      expect(result.name).toBe("multiply");
      expect(result.category).toBe("Math");
      expect(result.kind).toBe("function");
      expect(result.signature).toContain("function multiply");
      expect(result.description).toContain("Multiplies two numbers");
      expect(result.parameters).toHaveLength(2);
      expect(result.returns?.type).toBe("number");
      expect(result.examples).toHaveLength(1);
    });

    it("should handle empty or invalid JSDoc", () => {
      const sourceFile = project.createSourceFile(
        "test.ts",
        `
/**
 * 
 */
export function emptyFunction(): void {
  // no implementation
}
        `
      );

      const func = sourceFile.getFunction("emptyFunction")!;
      const jsDoc = func.getJsDocs()[0]!;

      const result = parser.parse(jsDoc);

      expect(result.description).toBeUndefined();
      expect(result.parameters).toHaveLength(0);
    });

    it("should parse JSDoc with nested parameter properties", () => {
      const sourceFile = project.createSourceFile(
        "test.ts",
        `
/**
 * @param {Object} options - Configuration options
 * @param {string} options.name - The name property
 * @param {number} options.age - The age property
 * @param {boolean} [options.active=true] - Whether active
 */
export function processOptions(options: { name: string; age: number; active?: boolean }): void {
  // implementation
}
        `
      );

      const func = sourceFile.getFunction("processOptions")!;
      const jsDoc = func.getJsDocs()[0]!;

      const result = parser.parse(jsDoc);

      expect(result.parameters).toHaveLength(1);
      expect(result.parameters?.[0].name).toBe("options");
      expect(result.parameters?.[0].type).toBe("Object");
      expect(result.parameters?.[0].nested).toHaveLength(3);
      expect(result.parameters?.[0].nested?.[0].name).toBe("name");
      expect(result.parameters?.[0].nested?.[2].defaultValue).toBe("true");
    });

    it("should handle JSDoc without any documentation", () => {
      const result = parser.parse(null as unknown as JSDoc);

      expect(result.description).toBeUndefined();
      expect(result.parameters).toHaveLength(0);
      expect(result.examples).toHaveLength(0);
      expect(result.throws).toHaveLength(0);
    });

    it("should parse JSDoc with return properties", () => {
      const sourceFile = project.createSourceFile(
        "test.ts",
        `
/**
 * Parse user agent
 * @returns {UserAgentVariables} User agent variables object
 * @property {string} appVersion App version info
 * @property {boolean} [isAndroid] Whether Android device
 * @property {boolean} isIOS Whether iOS device
 */
export function parseUserAgent(userAgent: string): { browser?: string; version?: string; isAndroid?: boolean; isIOS: boolean } {
  return { isIOS: false };
}
        `
      );

      const func = sourceFile.getFunction("parseUserAgent")!;
      const jsDoc = func.getJsDocs()[0]!;

      const result = parser.parse(jsDoc);

      expect(result.returns?.type).toBe("UserAgentVariables");
      expect(result.returns?.description).toBe("agent variables object");
      expect(result.returns?.properties).toBeDefined();
      expect(result.returns?.properties).toHaveLength(3);
      expect(result.returns?.properties?.[0].name).toBe("appVersion");
      expect(result.returns?.properties?.[0].description).toBe(
        "App version info"
      );
    });
  });
});
