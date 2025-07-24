import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  hasJSDocTag,
  getJSDoc,
} from "../../../../core/parser/jsdoc/jsdoc-utils.js";
import { getTsProject } from "../../../../core/get-ts-project.js";
import { getTsConfigPath } from "../../../../core/get-ts-config-path.js";
import { createE2EWorkspace, E2EWorkspace } from "../../../utils/create-e2e-workspace.js";

describe("jsdoc-utils", () => {
  let workspace: E2EWorkspace;

  beforeEach(async () => {
    workspace = await createE2EWorkspace();
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  describe("hasJSDocTag", () => {
    it("should return true when declaration has the specified tag", async () => {
      const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
      const project = getTsProject(tsConfigPath);

      const mathFile = project
        .getSourceFiles()
        .find((sf) => sf.getFilePath().includes("math.ts"));

      const addFunction = mathFile?.getFunction("add");
      expect(addFunction).toBeDefined();

      const hasPublicTag = hasJSDocTag(addFunction!, "public");
      expect(hasPublicTag).toBe(true);
    });

    it("should return false when declaration does not have the specified tag", async () => {
      const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
      const project = getTsProject(tsConfigPath);

      const mathFile = project
        .getSourceFiles()
        .find((sf) => sf.getFilePath().includes("math.ts"));

      const subtractFunction = mathFile?.getFunction("subtract");
      expect(subtractFunction).toBeDefined();

      const hasPublicTag = hasJSDocTag(subtractFunction!, "public");
      expect(hasPublicTag).toBe(false);
    });

    it("should return false when declaration has no JSDoc", async () => {
      const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
      const project = getTsProject(tsConfigPath);

      const mathFile = project
        .getSourceFiles()
        .find((sf) => sf.getFilePath().includes("math.ts"));

      const subtractFunction = mathFile?.getFunction("subtract");
      expect(subtractFunction).toBeDefined();

      const hasGenerateTag = hasJSDocTag(subtractFunction!, "generate");
      expect(hasGenerateTag).toBe(false);
    });

    it("should handle different tag names", async () => {
      const workspace = await createE2EWorkspace();
      const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
      const project = getTsProject(tsConfigPath);

      await workspace.write(
        "packages/core/src/test-tags.ts",
        `
/**
 * @internal
 * @experimental
 * @deprecated
 */
export function testFunction() {
  return true;
}
      `,
      );

      const updatedProject = getTsProject(tsConfigPath);
      const testFile = updatedProject
        .getSourceFiles()
        .find((sf) => sf.getFilePath().includes("test-tags.ts"));

      const testFunction = testFile?.getFunction("testFunction");
      expect(testFunction).toBeDefined();

      expect(hasJSDocTag(testFunction!, "internal")).toBe(true);
      expect(hasJSDocTag(testFunction!, "experimental")).toBe(true);
      expect(hasJSDocTag(testFunction!, "deprecated")).toBe(true);
      expect(hasJSDocTag(testFunction!, "public")).toBe(false);
    });
  });

  describe("getJSDoc", () => {
    it("should return JSDoc when declaration has documentation", async () => {
      const workspace = await createE2EWorkspace();
      const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
      const project = getTsProject(tsConfigPath);

      const mathFile = project
        .getSourceFiles()
        .find((sf) => sf.getFilePath().includes("math.ts"));

      const addFunction = mathFile?.getFunction("add");
      expect(addFunction).toBeDefined();

      const jsDoc = getJSDoc(addFunction!);
      expect(jsDoc).toBeDefined();
      expect(jsDoc?.getText()).toContain("@description");
    });

    it("should return undefined when declaration has no JSDoc", async () => {
      const workspace = await createE2EWorkspace();
      const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
      const project = getTsProject(tsConfigPath);

      const mathFile = project
        .getSourceFiles()
        .find((sf) => sf.getFilePath().includes("math.ts"));

      const subtractFunction = mathFile?.getFunction("subtract");
      expect(subtractFunction).toBeDefined();

      const jsDoc = getJSDoc(subtractFunction!);
      expect(jsDoc).toBeUndefined();
    });

    it("should handle variable declarations with JSDoc", async () => {
      const workspace = await createE2EWorkspace();
      const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
      const project = getTsProject(tsConfigPath);

      const mathFile = project
        .getSourceFiles()
        .find((sf) => sf.getFilePath().includes("math.ts"));

      const piVariable = mathFile?.getVariableDeclaration("PI");
      expect(piVariable).toBeDefined();

      const jsDoc = getJSDoc(piVariable!);
      expect(jsDoc).toBeDefined();
    });

    it("should handle class declarations with JSDoc", async () => {
      const workspace = await createE2EWorkspace();
      const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
      const project = getTsProject(tsConfigPath);

      const classFile = project
        .getSourceFiles()
        .find((sf) => sf.getFilePath().includes("classes.ts"));

      const userClass = classFile?.getClass("User");
      expect(userClass).toBeDefined();

      const jsDoc = getJSDoc(userClass!);
      expect(jsDoc).toBeDefined();
    });
  });
});
