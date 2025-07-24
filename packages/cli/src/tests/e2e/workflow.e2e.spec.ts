import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  createE2EWorkspace,
  E2EWorkspace,
} from "../utils/create-e2e-workspace.js";
import { execSync } from "child_process";
import type { SidebarItem } from "../../commands/build/manifest/manifest.js";

function hasTextProperty(item: object): item is { text: unknown } & object {
  return "text" in item;
}

function isSidebarItem(item: unknown): item is SidebarItem {
  if (typeof item !== "object" || item === null) {
    return false;
  }

  if (!hasTextProperty(item)) {
    return false;
  }

  return typeof item.text === "string";
}

function isSidebarItemArray(items: unknown): items is SidebarItem[] {
  return Array.isArray(items) && items.every(isSidebarItem);
}

describe("workflow", () => {
  let workspace: E2EWorkspace;

  beforeEach(async () => {
    workspace = await createE2EWorkspace();
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it("should complete generate → build → check workflow", async () => {
    // Install dependencies for e2e test
    execSync("yarn workspaces focus --all", {
      cwd: workspace.root,
      stdio: "inherit",
    });

    execSync("yarn install", {
      cwd: workspace.root,
      stdio: "inherit",
    });

    execSync("echo '0' | yarn docflow generate", {
      cwd: workspace.root,
      stdio: "inherit",
    });

    const coreContent = await workspace.read("packages/core/src/index.ts");
    const mathContent = await workspace.read("packages/math/src/index.ts");

    expect(coreContent).toContain("@public");
    expect(coreContent).toContain("fetchData");
    expect(mathContent).toContain("@public");
    expect(mathContent).toContain("calculateArea");

    execSync("yarn docflow build", {
      cwd: workspace.root,
      stdio: "inherit",
    });

    const manifestContent = await workspace.read(
      "docs/references/manifest.json"
    );
    expect(manifestContent).toBeDefined();

    const manifest: unknown = JSON.parse(manifestContent);

    // Type guard to verify the manifest structure
    expect(isSidebarItemArray(manifest)).toBe(true);

    if (!isSidebarItemArray(manifest)) {
      throw new Error("Manifest is not a valid SidebarItem array");
    }

    expect(manifest.length).toBeGreaterThanOrEqual(2);

    const coreSection = manifest.find((section) => section.text === "core");
    const mathSection = manifest.find((section) => section.text === "math");
    expect(coreSection).toBeDefined();
    expect(mathSection).toBeDefined();
    expect(coreSection?.items?.length).toBeGreaterThanOrEqual(1);
    expect(mathSection?.items?.length).toBeGreaterThanOrEqual(1);

    const fetchDataMd = await workspace.read(
      "docs/references/core/index/fetchData.md"
    );
    expect(fetchDataMd).toContain("# fetchData");
    expect(fetchDataMd).toContain("Fetches data from the given URL");
    expect(fetchDataMd).toContain("@libs/core");

    const calculateAreaMd = await workspace.read(
      "docs/references/math/index/calculateArea.md"
    );
    expect(calculateAreaMd).toContain("# calculateArea");
    expect(calculateAreaMd).toContain("Calculates the area of a circle");
    expect(calculateAreaMd).toContain("@libs/math");

    const checkOutput = execSync("yarn docflow check", {
      cwd: workspace.root,
      encoding: "utf8",
    });

    expect(checkOutput).toContain("❌ @libs/core has missing JSDoc:");
    expect(checkOutput).toContain("❌ @libs/math has missing JSDoc:");
    expect(checkOutput).toContain("calculateVolume");
  }, 30_000);
});
