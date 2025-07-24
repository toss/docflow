import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { updateJSDoc } from "../../../../core/parser/jsdoc/update-jsdoc.js";
import { getTsProject } from "../../../../core/get-ts-project.js";
import { getTsConfigPath } from "../../../../core/get-ts-config-path.js";
import { createE2EWorkspace, E2EWorkspace } from "../../../utils/create-e2e-workspace.js";

describe("updateJSDoc", () => {
  let workspace: E2EWorkspace;

  beforeEach(async () => {
    workspace = await createE2EWorkspace();
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it("should add JSDoc to a function without existing documentation", async () => {
    await workspace.write(
      "packages/core/src/test-update.ts",
      `
export function testFunction(param: string): boolean {
  return param.length > 0;
}
    `,
    );

    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const testFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("test-update.ts"));

    const testFunction = testFile?.getFunction("testFunction");
    expect(testFunction).toBeDefined();

    const newJSDoc = `/**
 * Checks if a string is not empty
 * @param param - The string to check
 * @returns True if string is not empty
 */`;

    updateJSDoc(testFunction!, newJSDoc);

    const updatedContent = testFile?.getFullText();
    expect(updatedContent).toContain("Checks if a string is not empty");
    expect(updatedContent).toContain("@param param");
    expect(updatedContent).toContain("@returns True if string is not empty");
  });

  it("should replace existing JSDoc with new documentation", async () => {
    await workspace.write(
      "packages/core/src/test-replace.ts",
      `
/**
 * Old documentation
 * @param param - Old parameter description
 */
export function testFunction(param: string): boolean {
  return param.length > 0;
}
    `,
    );

    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const testFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("test-replace.ts"));

    const testFunction = testFile?.getFunction("testFunction");
    expect(testFunction).toBeDefined();

    const newJSDoc = `/**
 * New documentation
 * @param param - New parameter description
 * @returns Boolean result
 */`;

    updateJSDoc(testFunction!, newJSDoc);

    const updatedContent = testFile?.getFullText();
    expect(updatedContent).toContain("New documentation");
    expect(updatedContent).toContain("New parameter description");
    expect(updatedContent).toContain("@returns Boolean result");
    expect(updatedContent).not.toContain("Old documentation");
  });

  it("should handle variable declarations", async () => {
    await workspace.write(
      "packages/core/src/test-variable.ts",
      `
export const testVariable = "test value";
    `,
    );

    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const testFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("test-variable.ts"));

    const testVariable = testFile?.getVariableDeclaration("testVariable");
    expect(testVariable).toBeDefined();

    const newJSDoc = `/**
 * A test constant variable
 * @type {string}
 */`;

    updateJSDoc(testVariable!, newJSDoc);

    const updatedContent = testFile?.getFullText();
    expect(updatedContent).toContain("A test constant variable");
    expect(updatedContent).toContain("@type {string}");
  });

  it("should handle class declarations", async () => {
    await workspace.write(
      "packages/core/src/test-class.ts",
      `
export class TestClass {
  constructor(public name: string) {}
}
    `,
    );

    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const testFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("test-class.ts"));

    const testClass = testFile?.getClass("TestClass");
    expect(testClass).toBeDefined();

    const newJSDoc = `/**
 * A test class for demonstration
 * @class TestClass
 */`;

    updateJSDoc(testClass!, newJSDoc);

    const updatedContent = testFile?.getFullText();
    expect(updatedContent).toContain("A test class for demonstration");
    expect(updatedContent).toContain("@class TestClass");
  });

  it("should handle interface declarations", async () => {
    await workspace.write(
      "packages/core/src/test-interface.ts",
      `
export interface TestInterface {
  name: string;
  age: number;
}
    `,
    );

    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const testFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("test-interface.ts"));

    const testInterface = testFile?.getInterface("TestInterface");
    expect(testInterface).toBeDefined();

    const newJSDoc = `/**
 * A test interface definition
 * @interface TestInterface
 */`;

    updateJSDoc(testInterface!, newJSDoc);

    const updatedContent = testFile?.getFullText();
    expect(updatedContent).toContain("A test interface definition");
    expect(updatedContent).toContain("@interface TestInterface");
  });

  it("should preserve existing code structure", async () => {
    await workspace.write(
      "packages/core/src/test-preserve.ts",
      `
export function firstFunction(): void {
  console.log("first");
}

export function secondFunction(): void {
  console.log("second");
}
    `,
    );

    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const testFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("test-preserve.ts"));

    const firstFunction = testFile?.getFunction("firstFunction");
    expect(firstFunction).toBeDefined();

    const newJSDoc = `/**
 * The first function
 */`;

    updateJSDoc(firstFunction!, newJSDoc);

    const updatedContent = testFile?.getFullText();
    expect(updatedContent).toContain("The first function");
    expect(updatedContent).toContain("secondFunction");
    expect(updatedContent).toContain('console.log("second")');
  });

  it("should handle multiline JSDoc with proper formatting", async () => {
    await workspace.write(
      "packages/core/src/test-multiline.ts",
      `
export function complexFunction(a: number, b: string, c?: boolean): string {
  return \`\${a}-\${b}-\${c}\`;
}
    `,
    );

    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const testFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("test-multiline.ts"));

    const complexFunction = testFile?.getFunction("complexFunction");
    expect(complexFunction).toBeDefined();

    const newJSDoc = `/**
 * A complex function with multiple parameters
 * @param a - The numeric parameter
 * @param b - The string parameter
 * @param c - Optional boolean parameter
 * @returns Formatted string result
 * @example
 * complexFunction(1, "test", true) // "1-test-true"
 */`;

    updateJSDoc(complexFunction!, newJSDoc);

    const updatedContent = testFile?.getFullText();
    expect(updatedContent).toContain(
      "A complex function with multiple parameters",
    );
    expect(updatedContent).toContain("@param a - The numeric parameter");
    expect(updatedContent).toContain("@param b - The string parameter");
    expect(updatedContent).toContain("@param c - Optional boolean parameter");
    expect(updatedContent).toContain("@returns Formatted string result");
    expect(updatedContent).toContain("@example");
  });
});
