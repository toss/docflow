import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getTsProject } from "../../core/get-ts-project.js";
import { getTsConfigPath } from "../../core/get-ts-config-path.js";
import { createE2EWorkspace, E2EWorkspace } from "../utils/create-e2e-workspace.js";

describe("getTsProject", () => {
  let workspace: E2EWorkspace;

  beforeEach(async () => {
    workspace = await createE2EWorkspace();
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it("should create a TypeScript project from tsconfig path", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    expect(project).toBeDefined();
    expect(project.getSourceFiles().length).toBeGreaterThan(0);
  });

  it("should load source files from the project", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const sourceFiles = project.getSourceFiles();
    const filePaths = sourceFiles.map((sf) => sf.getFilePath());

    expect(filePaths.some((path) => path.includes("math.ts"))).toBe(true);
    expect(filePaths.some((path) => path.includes("string.ts"))).toBe(true);
  });

  it("should handle different packages correctly", async () => {
    const utilsConfigPath = getTsConfigPath(workspace.root, "packages/utils");
    const utilsProject = getTsProject(utilsConfigPath);

    const sourceFiles = utilsProject.getSourceFiles();
    const filePaths = sourceFiles.map((sf) => sf.getFilePath());

    expect(filePaths.some((path) => path.includes("helpers.ts"))).toBe(true);
    expect(filePaths.some((path) => path.includes("validators.ts"))).toBe(true);
  });
});
