import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getExportedDeclarationsBySourceFile } from "../../../../core/parser/source/get-exported-declarations-by-sourcefile.js";
import { getTsProject } from "../../../../core/get-ts-project.js";
import { getTsConfigPath } from "../../../../core/get-ts-config-path.js";
import { createE2EWorkspace, E2EWorkspace } from "../../../utils/create-e2e-workspace.js";

describe("getExportedDeclarationsBySourceFile", () => {
  let workspace: E2EWorkspace;

  beforeEach(async () => {
    workspace = await createE2EWorkspace();
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it("should extract all exported declarations from a source file", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const mathFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("math.ts"));

    expect(mathFile).toBeDefined();

    const exportDeclarations = getExportedDeclarationsBySourceFile(mathFile!);

    expect(exportDeclarations.length).toBeGreaterThan(0);

    const symbolNames = exportDeclarations.map((decl) => decl.symbolName);
    expect(symbolNames).toContain("add");
    expect(symbolNames).toContain("multiply");
    expect(symbolNames).toContain("PI");
    expect(symbolNames).toContain("Status");
  });

  it("should include declaration metadata", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const mathFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("math.ts"));

    const exportDeclarations = getExportedDeclarationsBySourceFile(mathFile!);

    const addDeclaration = exportDeclarations.find(
      (decl) => decl.symbolName === "add",
    );
    expect(addDeclaration).toBeDefined();
    expect(addDeclaration!.kind).toBe("function");
    expect(addDeclaration!.signature).toContain("function add");
    expect(addDeclaration!.jsDoc).toBeDefined();
    expect(addDeclaration!.filePath).toContain("math.ts");
  });

  it("should handle files with no exports", async () => {
    const workspace = await createE2EWorkspace();
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    await workspace.write(
      "packages/core/src/no-exports.ts",
      `
function internalFunction() {
  return "internal";
}

const internalVariable = "test";
    `,
    );

    const updatedProject = getTsProject(tsConfigPath);
    const noExportsFile = updatedProject
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("no-exports.ts"));

    expect(noExportsFile).toBeDefined();

    const exportDeclarations = getExportedDeclarationsBySourceFile(
      noExportsFile!,
    );
    expect(exportDeclarations).toHaveLength(0);
  });

  it("should handle barrel export files", async () => {
    const workspace = await createE2EWorkspace();
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const indexFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("index.ts"));

    expect(indexFile).toBeDefined();

    const exportDeclarations = getExportedDeclarationsBySourceFile(indexFile!);
    expect(exportDeclarations.length).toBeGreaterThan(0);

    const symbolNames = exportDeclarations.map((decl) => decl.symbolName);
    expect(symbolNames).toContain("add");
    expect(symbolNames).toContain("multiply");
    expect(symbolNames).toContain("toUpper");
  });

  it("should include declarations with and without JSDoc", async () => {
    const workspace = await createE2EWorkspace();
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const mathFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("math.ts"));

    const exportDeclarations = getExportedDeclarationsBySourceFile(mathFile!);

    const withJSDoc = exportDeclarations.filter(
      (decl) => decl.jsDoc !== undefined,
    );
    const withoutJSDoc = exportDeclarations.filter(
      (decl) => decl.jsDoc === undefined,
    );

    expect(withJSDoc.length).toBeGreaterThan(0);
    expect(withoutJSDoc.length).toBeGreaterThan(0);

    exportDeclarations.forEach((decl) => {
      expect(decl.kind).toBeDefined();
      expect(decl.signature).toBeDefined();
      expect(decl.filePath).toBeDefined();
      expect(decl.symbolName).toBeDefined();
      expect(decl.declaration).toBeDefined();
    });
  });
});
