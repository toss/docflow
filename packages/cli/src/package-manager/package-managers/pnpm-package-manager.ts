import { execSync } from "child_process";
import { z } from "zod";
import { PackageManager, Package } from "../types/package-manager.type.js";
import path from "path";

const pnpmSchema = z.object({
  name: z.string().optional(),
  path: z.string(),
});

export class PnpmPackageManager implements PackageManager {
  constructor(private cwd: string) {}
  
  getPackages(): Package[] {
    try {
      const raw = execSync("pnpm list --recursive --json", { encoding: "utf8", cwd: this.cwd });
      const parsed = JSON.parse(raw) as Array<unknown>;

      return parsed
        .map((pkg) => pnpmSchema.parse(pkg))
        .filter((pkg) => pkg.name !== undefined)
        .map(({ name, path: pkgPath }) => ({
          name: name as string,
          location: path.relative(this.cwd, pkgPath),
        }));
    } catch {
      return [];
    }
  }
}
