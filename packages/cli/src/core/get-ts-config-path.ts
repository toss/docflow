import { existsSync } from "fs";
import path from "path";

export function getTsConfigPath(root: string, pkg: string) {
  const pkgConfigPath = path.join(root, pkg, "tsconfig.json");
  if (existsSync(pkgConfigPath)) {
    return pkgConfigPath;
  }

  const buildConfigPath = path.join(root, pkg, "tsconfig.build.json");
  if (existsSync(buildConfigPath)) {
    return buildConfigPath;
  }

  const rootConfigPath = path.join(root, "tsconfig.json");
  if (existsSync(rootConfigPath)) {
    return rootConfigPath;
  }

  throw new Error(`tsconfig.json not found in ${root} or ${pkg}`);
}
