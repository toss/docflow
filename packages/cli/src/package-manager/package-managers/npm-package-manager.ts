import { execSync } from "child_process";
import { z } from "zod";
import { PackageManager, Package } from "../types/package-manager.type.js";

const npmSchema = z.object({
  name: z.string(),
  location: z.string(),
});

export class NpmPackageManager implements PackageManager {
  constructor(private cwd: string) {}
  
  getPackages(): Package[] {
    try {
      const raw = execSync("npm query .workspace --json", { encoding: "utf8", cwd: this.cwd });
      const parsed = JSON.parse(raw) as Array<unknown>;
      if (!Array.isArray(parsed)) return [];

      return parsed
        .map((ws) => npmSchema.parse(ws))
        .map(({ name, location }) => ({ name, location }));
    } catch {
      return [];
    }
  }
}
