import { Command } from "clipanion";
import { isEmpty } from "es-toolkit/compat";
import path from "path";
import { loadConfig } from "../../config/load-config.js";
import { getPackageEntryPoints } from "../../core/entry-point.js";
import { getTsConfigPath } from "../../core/get-ts-config-path.js";
import { getTsProject } from "../../core/get-ts-project.js";
import { excludeBarrelReExports } from "../../core/parser/source/exclude-barrel-re-exports.js";
import { getExportedDeclarationsBySourceFile } from "../../core/parser/source/get-exported-declarations-by-sourcefile.js";
import { isExportSourceFile } from "../../core/parser/source/is-export-source-file.js";
import { createPackageManager } from "../../package-manager/create-package-manager.js";
import { isTargetPackage } from "../../package-manager/utils/is-target-package.js";
import {
  PackageValidationResult,
  validateExports,
} from "./validate/validate-exports.js";
import { ValidationError } from "./validate/validate.types.js";

export class CheckCommand extends Command {
  static paths = [[`check`]];

  async execute(): Promise<number> {
    const { checkConfig, projectConfig, targetPackages } = await loadContext();

    if (isEmpty(targetPackages)) {
      printNoPackagesFound(
        projectConfig.workspace.include,
        projectConfig.root,
        projectConfig.packageManager
      );
      return 1;
    }

    let hasErrors = false;
    for (const pkg of targetPackages) {
      console.log(`📝 ${pkg.name} processing...`);

      const packagePath = path.resolve(projectConfig.root, pkg.location);
      const tsConfigPath = getTsConfigPath(projectConfig.root, pkg.location);
      const project = getTsProject(tsConfigPath);

      const entryPoints =
        checkConfig.entryPoints ?? getPackageEntryPoints(packagePath);

      const sourceFiles = project.getSourceFiles();
      const entryPointFiles = sourceFiles.filter((file) => {
        const filePath = file.getFilePath();
        return entryPoints.some((entryPoint) => filePath.includes(entryPoint));
      });

      const exportSourceFiles = entryPointFiles.filter(isExportSourceFile);
      const exportDeclarationsBySourceFiles = exportSourceFiles.flatMap(
        getExportedDeclarationsBySourceFile
      );
      const exportDeclarations = excludeBarrelReExports(exportDeclarationsBySourceFiles);
      const result = validateExports(exportDeclarations, projectConfig.root);
      if (!isEmpty(result.issues)) {
        printValidationErrors(pkg.name, result);
        hasErrors = true;

        continue;
      }

      console.log(`✅ ${pkg.name} has JSDoc for all exports`);
    }

    return hasErrors ? 1 : 0;
  }
}

async function loadContext() {
  const root = process.cwd();
  const config = await loadConfig(root);
  const projectRoot = path.resolve(root, config.project.root);
  const projectConfig = config.project;
  const checkConfig = config.commands.check;
  const packageManager = createPackageManager(
    projectConfig.packageManager,
    projectRoot
  );
  const packages = packageManager.getPackages();

  const targetPackages = packages.filter((pkg) =>
    isTargetPackage(pkg, {
      include: projectConfig.workspace.include,
      exclude: projectConfig.workspace.exclude,
    })
  );

  return {
    checkConfig,
    projectConfig,
    targetPackages,
  };
}

function printNoPackagesFound(
  include: string[],
  root: string,
  packageManager: string
) {
  console.error("❌ not found packages");
  console.error("check your config:");
  console.error(`  - workspace.include: ${JSON.stringify(include)}`);
  console.error(`  - project root: ${root}`);
  console.error(`  - package manager: ${packageManager}`);
}



function printValidationErrors(packageName: string, result: PackageValidationResult): void {
  console.log(`❌ ${packageName} has missing JSDoc:`);

  result.issues.forEach((issue) => {
    issue.errors.forEach((error) => {
      const message = formatErrorMessage(error);
      console.log(`  - ${issue.relativePath}:${issue.exportDeclaration.symbolName} - ${message}`);
    });
  });
}

function formatErrorMessage(error: ValidationError): string {
  switch (error.type) {
    case "missing_public":
      return "missing @public";
    case "missing_param":
      return `missing @param for '${error.target}'`;
    case "unused_param":
      return `unused @param '${error.target}'`;
    case "missing_returns":
      return "missing @returns";
    case "invalid_returns":
      return error.message ?? "invalid @returns";
  }
}
