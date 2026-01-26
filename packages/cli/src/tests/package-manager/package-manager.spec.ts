import { execSync } from "child_process";
import { describe, expect, it } from "vitest";
import { NpmPackageManager } from "../../package-manager/package-managers/npm-package-manager.js";
import { PnpmPackageManager } from "../../package-manager/package-managers/pnpm-package-manager.js";
import { YarnPackageManager } from "../../package-manager/package-managers/yarn-package-manager.js";
import { isTargetPackage } from "../../package-manager/utils/is-target-package.js";
import { createE2EWorkspace } from "../utils/create-e2e-workspace.js";

describe("PackageManager integration", () => {
  it("YarnPackageManager should parse workspaces correctly", async () => {
    const workspace = await createE2EWorkspace({ packageManager: "yarn" });
    try {
      const yarn = new YarnPackageManager(workspace.root);
      const result = yarn.getPackages();

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "@libs/core",
            location: "packages/core",
          }),
          expect.objectContaining({
            name: "@libs/math",
            location: "packages/math",
          }),
          expect.objectContaining({
            name: "@libs/types",
            location: "packages/types",
          }),
          expect.objectContaining({
            name: "@libs/utils",
            location: "packages/utils",
          }),
        ])
      );
    } finally {
      await workspace.cleanup();
    }
  });

  it("NpmPackageManager should parse workspaces correctly", async () => {
    const workspace = await createE2EWorkspace({ packageManager: "npm" });
    try {
      execSync("npm install", { stdio: "ignore", cwd: workspace.root });

      const npm = new NpmPackageManager(workspace.root);
      const result = npm.getPackages();

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "@libs/core",
            location: "packages/core",
          }),
          expect.objectContaining({
            name: "@libs/math",
            location: "packages/math",
          }),
          expect.objectContaining({
            name: "@libs/types",
            location: "packages/types",
          }),
          expect.objectContaining({
            name: "@libs/utils",
            location: "packages/utils",
          }),
        ])
      );
    } finally {
      await workspace.cleanup();
    }
  });

  it("PnpmPackageManager should parse workspaces correctly", async () => {
    const workspace = await createE2EWorkspace({ packageManager: "pnpm" });
    try {
      await workspace.write("pnpm-workspace.yaml", "packages:\n  - 'packages/*'\n");

      const pnpm = new PnpmPackageManager(workspace.root);
      const result = pnpm.getPackages();

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "@libs/core",
            location: "packages/core",
          }),
          expect.objectContaining({
            name: "@libs/math",
            location: "packages/math",
          }),
          expect.objectContaining({
            name: "@libs/types",
            location: "packages/types",
          }),
          expect.objectContaining({
            name: "@libs/utils",
            location: "packages/utils",
          }),
        ])
      );
    } finally {
      await workspace.cleanup();
    }
  });
});

describe("isTargetPackage", () => {
  const mockPackages = [
    { name: "pkg-a", location: "packages/pkg-a" },
    { name: "pkg-b", location: "packages/pkg-b" },
    { name: "app-web", location: "apps/web" },
    { name: "app-docs", location: "apps/docs" },
    { name: "lib-utils", location: "libs/utils" },
  ];

  it("should return all packages when include is empty", () => {
    const result = mockPackages.filter(pkg =>
      isTargetPackage(pkg, {
        include: [],
        exclude: [],
      })
    );

    expect(result).toEqual(mockPackages);
  });

  it("should filter packages by include patterns", () => {
    const result = mockPackages.filter(pkg =>
      isTargetPackage(pkg, {
        include: ["packages/*"],
        exclude: [],
      })
    );

    expect(result).toEqual([
      { name: "pkg-a", location: "packages/pkg-a" },
      { name: "pkg-b", location: "packages/pkg-b" },
    ]);
  });

  it("should exclude packages by exclude patterns", () => {
    const result = mockPackages.filter(pkg =>
      isTargetPackage(pkg, {
        include: [],
        exclude: ["apps/*"],
      })
    );

    expect(result).toEqual([
      { name: "pkg-a", location: "packages/pkg-a" },
      { name: "pkg-b", location: "packages/pkg-b" },
      { name: "lib-utils", location: "libs/utils" },
    ]);
  });

  it("should combine include and exclude patterns", () => {
    const result = mockPackages.filter(pkg =>
      isTargetPackage(pkg, {
        include: ["packages/*", "apps/*"],
        exclude: ["apps/docs"],
      })
    );

    expect(result).toEqual([
      { name: "pkg-a", location: "packages/pkg-a" },
      { name: "pkg-b", location: "packages/pkg-b" },
      { name: "app-web", location: "apps/web" },
    ]);
  });

  it("should handle multiple include patterns", () => {
    const result = mockPackages.filter(pkg =>
      isTargetPackage(pkg, {
        include: ["packages/*", "libs/*"],
        exclude: [],
      })
    );

    expect(result).toEqual([
      { name: "pkg-a", location: "packages/pkg-a" },
      { name: "pkg-b", location: "packages/pkg-b" },
      { name: "lib-utils", location: "libs/utils" },
    ]);
  });

  it("should handle multiple exclude patterns", () => {
    const result = mockPackages.filter(pkg =>
      isTargetPackage(pkg, {
        include: [],
        exclude: ["apps/*", "libs/*"],
      })
    );

    expect(result).toEqual([
      { name: "pkg-a", location: "packages/pkg-a" },
      { name: "pkg-b", location: "packages/pkg-b" },
    ]);
  });

  it("should return empty array when all packages are excluded", () => {
    const result = mockPackages.filter(pkg =>
      isTargetPackage(pkg, {
        include: ["packages/*"],
        exclude: ["packages/*"],
      })
    );

    expect(result).toEqual([]);
  });
});
