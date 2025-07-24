import { execSync } from "child_process";
import { z } from "zod";
import { PackageManager, Package } from "../types/package-manager.type.js";

const workspaceIdentitySchema = z.object({
  name: z.string().nullable(),
  location: z.string(),
});

export class YarnPackageManager implements PackageManager {
  constructor(private cwd: string) {}
  
  getPackages(): Package[] {
    try {
      const output = execSync("yarn workspaces list --json", { encoding: "utf8", cwd: this.cwd });

      return output
        .split("\n")
        .filter(Boolean)
        .map((line) => workspaceIdentitySchema.parse(JSON.parse(line)))
        .filter((ws) => ws.name !== null)
        .map((ws) => ({ name: ws.name as string, location: ws.location }));
    } catch {
      return [];
    }
  }
}
