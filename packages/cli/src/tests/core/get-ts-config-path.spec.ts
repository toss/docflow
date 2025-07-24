import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getTsConfigPath } from "../../core/get-ts-config-path.js";
import { createE2EWorkspace, E2EWorkspace } from "../utils/create-e2e-workspace.js";
import path from "path";

describe("getTsConfigPath", () => {
  let workspace: E2EWorkspace;

  beforeEach(async () => {
    workspace = await createE2EWorkspace();
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it("should return package tsconfig.json path when it exists", async () => {
    const projectRoot = workspace.root;
    const packageLocation = "packages/core";

    const tsConfigPath = getTsConfigPath(projectRoot, packageLocation);
    const expectedPath = path.join(
      projectRoot,
      packageLocation,
      "tsconfig.json"
    );

    expect(tsConfigPath).toBe(expectedPath);
  });

  it("should return root tsconfig.json path when package tsconfig doesn't exist", async () => {
    const projectRoot = workspace.root;
    const packageLocation = "packages/non-existent";

    const tsConfigPath = getTsConfigPath(projectRoot, packageLocation);
    const expectedPath = path.join(projectRoot, "tsconfig.json");

    expect(tsConfigPath).toBe(expectedPath);
  });

  it("should handle absolute paths correctly", async () => {
    const projectRoot = workspace.root;
    const packageLocation = "packages/core";

    const tsConfigPath = getTsConfigPath(projectRoot, packageLocation);
    const expectedPath = path.join(
      projectRoot,
      packageLocation,
      "tsconfig.json"
    );

    expect(tsConfigPath).toBe(expectedPath);
  });
});
