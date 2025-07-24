import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isExportSourceFile } from "../../../../core/parser/source/is-export-source-file.js";
import { getTsProject } from "../../../../core/get-ts-project.js";
import { getTsConfigPath } from "../../../../core/get-ts-config-path.js";
import { createE2EWorkspace, E2EWorkspace } from "../../../utils/create-e2e-workspace.js";

describe("isExportSourceFile", () => {
  let workspace: E2EWorkspace;

  beforeEach(async () => {
    workspace = await createE2EWorkspace();
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it("should return true for files with exports", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const mathFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("math.ts"));

    expect(mathFile).toBeDefined();
    expect(isExportSourceFile(mathFile!)).toBe(true);
  });

  it("should return true for files with barrel exports", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const indexFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("index.ts"));

    expect(indexFile).toBeDefined();
    expect(isExportSourceFile(indexFile!)).toBe(true);
  });

  it("should return false for files without exports", async () => {
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
    expect(isExportSourceFile(noExportsFile!)).toBe(false);
  });
});
