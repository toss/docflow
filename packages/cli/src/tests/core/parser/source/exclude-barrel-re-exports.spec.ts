import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { excludeBarrelReExports } from "../../../../core/parser/source/exclude-barrel-re-exports.js";
import { getExportedDeclarationsBySourceFile } from "../../../../core/parser/source/get-exported-declarations-by-sourcefile.js";
import { getTsProject } from "../../../../core/get-ts-project.js";
import { getTsConfigPath } from "../../../../core/get-ts-config-path.js";
import { createE2EWorkspace, E2EWorkspace } from "../../../utils/create-e2e-workspace.js";

describe("excludeBarrelReExports", () => {
  let workspace: E2EWorkspace;

  beforeEach(async () => {
    workspace = await createE2EWorkspace();
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it("should remove duplicate re-exported symbols", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const sourceFiles = project.getSourceFiles();
    const allExportDeclarations = sourceFiles.flatMap((sf) =>
      getExportedDeclarationsBySourceFile(sf),
    );

    const uniqueExports = excludeBarrelReExports(allExportDeclarations);

    expect(uniqueExports.length).toBeLessThanOrEqual(
      allExportDeclarations.length,
    );

    const symbolNames = uniqueExports.map((exp) => exp.symbolName);
    const uniqueSymbolNames = [...new Set(symbolNames)];
    expect(symbolNames.length).toBe(uniqueSymbolNames.length);
  });

  it("should prefer original declarations over re-exports", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const sourceFiles = project.getSourceFiles();
    const allExportDeclarations = sourceFiles.flatMap((sf) =>
      getExportedDeclarationsBySourceFile(sf),
    );

    const uniqueExports = excludeBarrelReExports(allExportDeclarations);

    const addExport = uniqueExports.find((exp) => exp.symbolName === "add");
    expect(addExport).toBeDefined();

    expect(addExport!.filePath).toContain("math.ts");
    expect(addExport!.filePath).not.toContain("index.ts");
  });

  it("should handle empty input", () => {
    const result = excludeBarrelReExports([]);
    expect(result).toHaveLength(0);
  });

  it("should handle single export", async () => {
    const workspace = await createE2EWorkspace();
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const mathFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("math.ts"));

    const exportDeclarations = getExportedDeclarationsBySourceFile(mathFile!);
    const singleExport = exportDeclarations.slice(0, 1);

    const result = excludeBarrelReExports(singleExport);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(singleExport[0]);
  });

  it("should preserve exports with different file paths", async () => {
    const workspace = await createE2EWorkspace();
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const mathFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("math.ts"));
    const stringFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("string.ts"));

    const mathExports = getExportedDeclarationsBySourceFile(mathFile!);
    const stringExports = getExportedDeclarationsBySourceFile(stringFile!);

    const allExports = [...mathExports, ...stringExports];
    const uniqueExports = excludeBarrelReExports(allExports);

    const filePaths = [...new Set(uniqueExports.map((exp) => exp.filePath))];
    expect(filePaths.length).toBeGreaterThan(1);
    expect(filePaths.some((path) => path.includes("math.ts"))).toBe(true);
    expect(filePaths.some((path) => path.includes("string.ts"))).toBe(true);
  });
});
