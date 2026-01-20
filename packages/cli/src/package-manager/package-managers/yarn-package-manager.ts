import { execSync } from "child_process";
import { z } from "zod";
import { PackageManager, Package } from "../types/package-manager.type.js";
import path from "path";
import { findUp } from "../utils/find-up.js";

const workspaceIdentitySchema = z.object({
  name: z.string().nullable(),
  location: z.string(),
});

export class YarnPackageManager implements PackageManager {
  constructor(private cwd: string) { }

  getPackages(): Package[] {
    try {
      const output = execSync("yarn workspaces list --json", { encoding: "utf8", cwd: this.cwd });
      const repoRootPath = this.getRepoRootPath();

      return output
        .split("\n")
        .filter(Boolean)
        .map((line) => workspaceIdentitySchema.parse(JSON.parse(line)))
        .filter((ws) => ws.name !== null)
        .map((ws) => {
          const locationAbsolutePath = path.join(repoRootPath, ws.location);

          return {
            name: ws.name as string,
            location: path.relative(this.cwd, locationAbsolutePath)
          };
        });
    } catch {
      return [];
    }
  }

  private getRepoRootPath(): string {
    const root = findUp("yarn.lock", this.cwd);

    if (root == null) {
      throw new Error(`'yarn.lock' not found from ${this.cwd}`);
    }

    return path.dirname(root);
  }
}
