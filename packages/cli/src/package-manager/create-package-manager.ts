import { PackageManager } from "./types/package-manager.type.js";
import { YarnPackageManager } from "./package-managers/yarn-package-manager.js";
import { PnpmPackageManager } from "./package-managers/pnpm-package-manager.js";
import { NpmPackageManager } from "./package-managers/npm-package-manager.js";

export function createPackageManager(
  type: "yarn" | "pnpm" | "npm",
  cwd: string,
): PackageManager {
  switch (type) {
    case "yarn":
      return new YarnPackageManager(cwd);
    case "pnpm":
      return new PnpmPackageManager(cwd);
    case "npm":
      return new NpmPackageManager(cwd);
    default:
      throw new Error(`Unsupported package manager ${type}`);
  }
}
