import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getPackageEntryPoints } from "../../core/entry-point.js";
import { createE2EWorkspace, E2EWorkspace } from "../utils/create-e2e-workspace.js";
import path from "path";

describe("getPackageEntryPoints", () => {
  let workspace: E2EWorkspace;

  beforeEach(async () => {
    workspace = await createE2EWorkspace();
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it("should return entry points from package.json main field", async () => {
    const packagePath = path.join(workspace.root, "packages/core");
    const entryPoints = getPackageEntryPoints(packagePath);

    expect(entryPoints).toContain("src/index.ts");
  });

  it("should return entry points from package.json exports field", async () => {
    const packagePath = path.join(workspace.root, "packages/core");
    const entryPoints = getPackageEntryPoints(packagePath);

    expect(entryPoints).toContain("src/math.ts");
  });

  it("should return default entry point when no package.json exists", async () => {
    const nonExistentPackage = path.join(workspace.root, "non-existent");
    const entryPoints = getPackageEntryPoints(nonExistentPackage);

    expect(entryPoints).toContain("index.ts");
  });
});
