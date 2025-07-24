import { Command } from "clipanion";
import enquirer from "enquirer";
import { loadConfig } from "../../config/load-config.js";
import { createPackageManager } from "../../package-manager/create-package-manager.js";
import { isTargetPackage } from "../../package-manager/utils/is-target-package.js";
import { getTsConfigPath } from "../../core/get-ts-config-path.js";
import { getTsProject } from "../../core/get-ts-project.js";
import { getExportedDeclarationsBySourceFile } from "../../core/parser/source/get-exported-declarations-by-sourcefile.js";
import { excludeBarrelReExports } from "../../core/parser/source/exclude-barrel-re-exports.js";
import { hasJSDocTag } from "../../core/parser/jsdoc/jsdoc-utils.js";
import { extractSignature } from "../../core/parser/source/extract-signature.js";
import { updateJSDoc } from "../../core/parser/jsdoc/update-jsdoc.js";
import { ExportDeclaration } from "../../core/types/parser.types.js";
import { Package } from "../../package-manager/types/package-manager.type.js";
import { Project } from "ts-morph";
import path from "path";

export class GenerateCommand extends Command {
  static paths = [[`generate`]];

  async execute(): Promise<number> {
    const { projectConfig, generateConfig, targetPackages } =
      await loadContext();
    if (!generateConfig) {
      console.error("❌ not found generate config");
      return 1;
    }

    if (targetPackages.length === 0) {
      printNoPackagesFound(
        projectConfig.workspace.include,
        projectConfig.root,
        projectConfig.packageManager
      );
      return 1;
    }

    const allGenerateTargets = targetPackages.flatMap((pkg) => {
      console.log(`📝 ${pkg.name} processing...`);

      const tsConfigPath = getTsConfigPath(projectConfig.root, pkg.location);
      const project = getTsProject(tsConfigPath);
      const projectSourceFiles = project.getSourceFiles();

      const exportDeclarationsBySourceFiles = projectSourceFiles.flatMap(
        getExportedDeclarationsBySourceFile
      );

      const excludeBarrelReExport = excludeBarrelReExports(
        exportDeclarationsBySourceFiles
      );

      const generateTargets = excludeBarrelReExport.filter((target) => {
        return target.jsDoc && hasJSDocTag(target.declaration, "generate");
      });

      return generateTargets
        .map((target) => {
          const signature = extractSignature(target.declaration);
          if (!signature) {
            return null;
          }

          return {
            ...target,
            signature,
            pkg,
            project,
          };
        })
        .filter((target): target is GenerateTarget => target !== null);
    });

    if (allGenerateTargets.length === 0) {
      console.log("❌ not found generate targets");
      return 0;
    }

    const selectedTargets = await promptTargetSelection(allGenerateTargets);
    if (selectedTargets.length === 0) {
      console.log("❌ no targets selected");
      return 0;
    }

    const fetcher = generateConfig.jsdoc.fetcher;
    const promptTemplate = generateConfig.jsdoc.prompt;
    const templateFunction = (signature: string) =>
      `${promptTemplate}\n\nSignature: ${signature}`;

    for (const selectTarget of selectedTargets) {
      const sourceFile = selectTarget.project.getSourceFile(
        selectTarget.filePath
      );
      if (!sourceFile) continue;

      const declaration = selectTarget.declaration;
      const signature = selectTarget.signature;
      if (!declaration || !signature) continue;

      const formattedPrompt = templateFunction(signature);

      const newJSDoc = await fetcher({
        signature,
        prompt: formattedPrompt,
      });

      updateJSDoc(declaration, newJSDoc);
      await sourceFile.save();
      console.log(
        `✅ ${selectTarget.filePath} ${selectTarget.symbolName} updated`
      );
    }

    console.log("✅ generate done");

    return 0;
  }
}

async function loadContext() {
  const root = process.cwd();
  const config = await loadConfig(root);
  const projectRoot = path.resolve(root, config.project.root);
  const generateConfig = config.commands?.generate;
  const projectConfig = config.project;
  const packageManager = createPackageManager(
    projectConfig.packageManager,
    projectRoot
  );
  const packages = packageManager.getPackages();

  if (packages.length > 0) {
    packages.forEach((pkg) => {
      console.log(`  - ${pkg.name} (${pkg.location})`);
    });
  }

  const targetPackages = packages.filter((pkg) =>
    isTargetPackage(pkg, {
      include: projectConfig.workspace.include,
      exclude: projectConfig.workspace.exclude,
    })
  );

  return {
    projectConfig,
    generateConfig,
    packages,
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

interface GenerateTarget extends ExportDeclaration {
  pkg: Package;
  project: Project;
}

async function promptTargetSelection(
  targetContexts: GenerateTarget[]
): Promise<GenerateTarget[]> {
  const choices = [
    {
      name: "All targets",
      value: "All targets",
    },
    ...targetContexts.map((ctx, index) => ({
      name: `${index + 1}. ${ctx.symbolName} (${ctx.pkg.name})`,
      value: ctx,
    })),
  ];

  const response = await enquirer.prompt<{ selection: string }>({
    type: "select",
    name: "selection",
    message: "Select targets for JSDoc generation:",
    choices,
  });

  if (response.selection === "All targets") {
    return targetContexts;
  }

  const selectedIndex =
    choices.findIndex((choice) => choice.name === response.selection) - 1;
  if (selectedIndex === -1) {
    return [];
  }

  const selectedTarget = targetContexts[selectedIndex];
  if (!selectedTarget) {
    return [];
  }

  return [selectedTarget];
}
