import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { parseJSDoc } from "../../../../core/parser/jsdoc/parse-jsdoc.js";
import { JSDocParser } from "../../../../core/parser/jsdoc/jsdoc-parser.js";
import { ExportDeclaration } from "../../../../core/types/parser.types.js";
import { getTsProject } from "../../../../core/get-ts-project.js";
import { getTsConfigPath } from "../../../../core/get-ts-config-path.js";
import { getExportedDeclarationsBySourceFile } from "../../../../core/parser/source/get-exported-declarations-by-sourcefile.js";
import { createE2EWorkspace, E2EWorkspace } from "../../../utils/create-e2e-workspace.js";

describe("parseJSDoc", () => {
  let workspace: E2EWorkspace;

  beforeEach(async () => {
    workspace = await createE2EWorkspace();
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it("should parse JSDoc from export declaration", async () => {
    const parser = new JSDocParser();
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const mathFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("math.ts"));

    const exportDeclarations = getExportedDeclarationsBySourceFile(mathFile!);
    const addExport = exportDeclarations.find(
      (exp) => exp.symbolName === "add",
    );

    expect(addExport).toBeDefined();

    const result = parseJSDoc(addExport!, parser);

    expect(result).toHaveProperty("parsedJSDoc");
    expect(result.parsedJSDoc.name).toBe("add");
    expect(result.parsedJSDoc.description).toContain("addition");
    expect(result.parsedJSDoc.category).toBe("Math");
    expect(result.parsedJSDoc.kind).toBe("function");
  });

  it("should handle export declarations without JSDoc", async () => {
    const parser = new JSDocParser();
    await workspace.write(
      "packages/core/src/test-minimal-jsdoc.ts",
      `
/**
 * @public
 */
export function minimalJSDoc(x: number): number {
  return x * 2;
}
    `,
    );

    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const testFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("test-minimal-jsdoc.ts"));

    const exportDeclarations = getExportedDeclarationsBySourceFile(testFile!);
    const minimalExport = exportDeclarations.find(
      (exp) => exp.symbolName === "minimalJSDoc",
    );

    expect(minimalExport).toBeDefined();

    const result = parseJSDoc(minimalExport!, parser);

    expect(result).toHaveProperty("parsedJSDoc");
    expect(result.parsedJSDoc.description).toBeUndefined();
    expect(result.parsedJSDoc.parameters).toHaveLength(0);
  });

  it("should preserve original export declaration properties", async () => {
    const workspace = await createE2EWorkspace();
    const parser = new JSDocParser();
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const mathFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("math.ts"));

    const exportDeclarations = getExportedDeclarationsBySourceFile(mathFile!);
    const addExport = exportDeclarations.find(
      (exp) => exp.symbolName === "add",
    );

    expect(addExport).toBeDefined();

    const result = parseJSDoc(addExport!, parser);

    expect(result.filePath).toBe(addExport!.filePath);
    expect(result.symbolName).toBe(addExport!.symbolName);
    expect(result.declaration).toBe(addExport!.declaration);
    expect(result.kind).toBe(addExport!.kind);
    expect(result.jsDoc).toBe(addExport!.jsDoc);
    expect(result.signature).toBe(addExport!.signature);
  });

  it("should parse parameters from JSDoc", async () => {
    const workspace = await createE2EWorkspace();
    const parser = new JSDocParser();
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const mathFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("math.ts"));

    const exportDeclarations = getExportedDeclarationsBySourceFile(mathFile!);
    const addExport = exportDeclarations.find(
      (exp) => exp.symbolName === "add",
    );

    expect(addExport).toBeDefined();

    const result = parseJSDoc(addExport!, parser);

    expect(result.parsedJSDoc.parameters).toHaveLength(2);
  });

  it("should parse return information from JSDoc", async () => {
    const workspace = await createE2EWorkspace();
    const parser = new JSDocParser();
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const mathFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("math.ts"));

    const exportDeclarations = getExportedDeclarationsBySourceFile(mathFile!);
    const addExport = exportDeclarations.find(
      (exp) => exp.symbolName === "add",
    );

    expect(addExport).toBeDefined();

    const result = parseJSDoc(addExport!, parser);

    expect(result.parsedJSDoc.returns).toBeDefined();
    expect(result.parsedJSDoc.returns!.type).toBe("number");
  });

  it("should parse examples from JSDoc", async () => {
    const workspace = await createE2EWorkspace();
    const parser = new JSDocParser();
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const mathFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("math.ts"));

    const exportDeclarations = getExportedDeclarationsBySourceFile(mathFile!);
    const addExport = exportDeclarations.find(
      (exp) => exp.symbolName === "add",
    );

    expect(addExport).toBeDefined();

    const result = parseJSDoc(addExport!, parser);

    expect(result.parsedJSDoc.examples).toBeDefined();
    expect(result.parsedJSDoc.examples!.length).toBeGreaterThan(0);
    expect(result.parsedJSDoc.examples![0].code).toContain("add");
  });

  it("should handle different declaration kinds", async () => {
    const workspace = await createE2EWorkspace();
    const parser = new JSDocParser();
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const mathFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("math.ts"));

    const exportDeclarations = getExportedDeclarationsBySourceFile(mathFile!);
    const multiplyExport = exportDeclarations.find(
      (exp) => exp.symbolName === "multiply",
    );

    expect(multiplyExport).toBeDefined();
    expect(multiplyExport!.kind).toBe("function");

    const result = parseJSDoc(multiplyExport!, parser);

    expect(result.parsedJSDoc.kind).toBe("const");
    expect(result.parsedJSDoc.category).toBe("Math");
  });
});
