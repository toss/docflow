import { Command } from "clipanion";
import { loadConfig } from "../../config/load-config.js";
import { createPackageManager } from "../../package-manager/create-package-manager.js";
import { isTargetPackage } from "../../package-manager/utils/is-target-package.js";
import { getTsConfigPath } from "../../core/get-ts-config-path.js";
import { getTsProject } from "../../core/get-ts-project.js";
import { isExportSourceFile } from "../../core/parser/source/is-export-source-file.js";
import { getExportedDeclarationsBySourceFile } from "../../core/parser/source/get-exported-declarations-by-sourcefile.js";
import { excludeBarrelReExports } from "../../core/parser/source/exclude-barrel-re-exports.js";
import { hasJSDocTag } from "../../core/parser/jsdoc/jsdoc-utils.js";
import { getPackageEntryPoints } from "../../core/entry-point.js";
import path from "path";

export class CheckCommand extends Command {
  static paths = [[`check`]];

  async execute(): Promise<number> {
    const { checkConfig, projectConfig, targetPackages } = await loadContext();

    if (targetPackages.length === 0) {
      printNoPackagesFound(
        projectConfig.workspace.include,
        projectConfig.root,
        projectConfig.packageManager
      );
      return 1;
    }

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
      const excludeBarrelReExport = excludeBarrelReExports(
        exportDeclarationsBySourceFiles
      );
      const missingJSDocExports = excludeBarrelReExport.filter((target) => {
        return !hasJSDocTag(target.declaration, "public");
      });

      if (missingJSDocExports.length > 0) {
        console.log(`❌ ${pkg.name} has missing JSDoc:`);
        missingJSDocExports.forEach((exportInfo) => {
          const relativePath = path.relative(
            projectConfig.root,
            exportInfo.filePath
          );
          console.log(`  - ${relativePath}:${exportInfo.symbolName}`);
        });
      } else {
        console.log(`✅ ${pkg.name} has JSDoc for all exports`);
      }
    }

    return 0;
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
