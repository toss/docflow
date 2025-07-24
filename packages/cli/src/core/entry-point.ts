import path from "path";
import fs from "fs";

export function getPackageEntryPoints(packagePath: string): string[] {
  const packageJsonPath = path.join(packagePath, "package.json");

  // Return default entry point if package.json doesn't exist
  if (!fs.existsSync(packageJsonPath)) {
    return ["index.ts"];
  }

  const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
  const packageJson = JSON.parse(packageJsonContent);

  const entryPoints: string[] = [];

  const mainEntry = packageJson.main;
  if (mainEntry) {
    entryPoints.push(normalizeEntryPath(mainEntry));
  }

  const exportsField = packageJson.exports;
  if (exportsField) {
    entryPoints.push(...extractExportsEntries(exportsField));
  }

  return entryPoints;
}

function normalizeEntryPath(entryPath: string): string {
  return entryPath.startsWith("./") ? entryPath.substring(2) : entryPath;
}

function extractExportsEntries(exportsField: unknown): string[] {
  if (typeof exportsField === "string") {
    return [normalizeEntryPath(exportsField)];
  }

  if (typeof exportsField === "object" && exportsField !== null) {
    const entries: string[] = [];
    const exportsObj = exportsField as Record<string, unknown>;

    Object.values(exportsObj).forEach((value) => {
      // {
      //   "exports": {
      //     ".": "./dist/index.js",
      //     "./utils": "./dist/utils.js"
      //   }
      // }
      if (typeof value === "string") {
        entries.push(normalizeEntryPath(value));
      }
      // {
      //   "exports": {
      //     ".": {
      //       "import": "./dist/index.mjs",
      //       "require": "./dist/index.js"
      //     }
      //   }
      // }
      else if (typeof value === "object" && value !== null) {
        const conditionalExports = value as Record<string, unknown>;
        ["import", "require", "default"].forEach((condition) => {
          const conditionValue = conditionalExports[condition];
          if (typeof conditionValue === "string") {
            entries.push(normalizeEntryPath(conditionValue));
          }
        });
      }
    });

    return entries;
  }

  return [];
}
