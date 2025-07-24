import { Command } from "clipanion";
import path from "path";
import fs from "fs/promises";
import { loadConfig } from "../../config/load-config.js";
import { createPackageManager } from "../../package-manager/create-package-manager.js";
import { isTargetPackage } from "../../package-manager/utils/is-target-package.js";
import { getTsConfigPath } from "../../core/get-ts-config-path.js";
import { getTsProject } from "../../core/get-ts-project.js";
import { parseJSDoc } from "../../core/parser/jsdoc/parse-jsdoc.js";
import { PluginManager } from "../../plugins/plugin-manager.js";
import { loadPlugins } from "../../plugins/load-plugins.js";
import { JSDocParser } from "../../core/parser/jsdoc/jsdoc-parser.js";
import { Manifest } from "./manifest/manifest.js";

import { isExportSourceFile } from "../../core/parser/source/is-export-source-file.js";
import { getExportedDeclarationsBySourceFile } from "../../core/parser/source/get-exported-declarations-by-sourcefile.js";
import { excludeBarrelReExports } from "../../core/parser/source/exclude-barrel-re-exports.js";
import { hasJSDocTag } from "../../core/parser/jsdoc/jsdoc-utils.js";

export class BuildCommand extends Command {
  static paths = [[`build`]];

  async execute(): Promise<number> {
    const {
      projectConfig,
      buildConfig,
      targetPackages,
      parser,
      generator,
      manifestManager,
      outputDir,
    } = await loadContext();

    if (targetPackages.length === 0) {
      printNoPackagesFound(
        projectConfig.workspace.include,
        projectConfig.root,
        projectConfig.packageManager
      );
      return 1;
    }

    await fs.mkdir(outputDir, { recursive: true });

    for (const pkg of targetPackages) {
      console.log(`📝 ${pkg.name} processing...`);

      const tsConfigPath = getTsConfigPath(projectConfig.root, pkg.location);
      const project = getTsProject(tsConfigPath);
      const projectSourceFiles = project.getSourceFiles();

      const exportSourceFiles = projectSourceFiles.filter(isExportSourceFile);
      const exportDeclarationsBySourceFiles = exportSourceFiles.flatMap(
        getExportedDeclarationsBySourceFile
      );
      const excludeBarrelReExport = excludeBarrelReExports(
        exportDeclarationsBySourceFiles
      );
      const targets = excludeBarrelReExport.filter((target) => {
        return target.jsDoc && hasJSDocTag(target.declaration, "public");
      });

      const targetsWithJSDoc = targets.map((target) =>
        parseJSDoc(target, parser)
      );

      const docs = targetsWithJSDoc.map((target) =>
        generator.generateDocs(target, pkg.location)
      );

      console.log(`Generated ${docs.length} documentation files:`);
      for (const doc of docs) {
        const outputPath = path.join(outputDir, doc.relativePath);
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, doc.content);
        console.log(`  - ${doc.relativePath}`);

        manifestManager.add(doc.relativePath);
      }
    }

    if (buildConfig.manifest.enabled && !manifestManager.isEmpty()) {
      const manifestPath = buildConfig.manifest.path
        ? path.resolve(projectConfig.root, buildConfig.manifest.path)
        : path.join(outputDir, "manifest.json");

      await fs.mkdir(path.dirname(manifestPath), { recursive: true });
      await fs.writeFile(manifestPath, manifestManager.toString());
      console.log(
        `📋 Generated manifest: ${path.relative(
          projectConfig.root,
          manifestPath
        )}`
      );
    }

    return 0;
  }
}

async function loadContext() {
  const root = process.cwd();
  const config = await loadConfig(root);
  const projectRoot = path.resolve(root, config.project.root);
  const buildConfig = config.commands.build;
  const projectConfig = config.project;
  const packageManager = createPackageManager(
    projectConfig.packageManager,
    projectRoot
  );
  const packages = packageManager.getPackages();

  const parser = new JSDocParser();
  const pluginManager = new PluginManager({
    workspacePath: projectConfig.root,
    config,
  });

  const targetPackages = packages.filter((pkg) =>
    isTargetPackage(pkg, {
      include: projectConfig.workspace.include,
      exclude: projectConfig.workspace.exclude,
    })
  );

  try {
    const plugins = await loadPlugins(config);
    pluginManager.registerAll(plugins);
    console.log(
      `📦 Loaded ${plugins.length} plugin(s): ${plugins
        .map((p) => p.name)
        .join(", ")}`
    );
  } catch (error) {
    console.error(
      `❌ Failed to load plugins: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  const generator = pluginManager.getGenerator(config);
  const manifestManager = new Manifest({
    prefix: buildConfig.manifest.prefix,
    pluginManager,
  });

  const outputDir = path.resolve(projectConfig.root, buildConfig.outputDir);

  return {
    buildConfig,
    projectConfig,
    parser,
    generator,
    targetPackages,
    manifestManager,
    outputDir,
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
