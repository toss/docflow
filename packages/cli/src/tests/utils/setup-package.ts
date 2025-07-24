import path from "path";
import { TestWorkspace } from "./create-test-workspace.js";

export async function setupPackage(
  workspace: TestWorkspace,
  packageName: string,
  options: {
    tsconfig?: Record<string, unknown>;
    tsconfigBuild?: Record<string, unknown>;
    files?: Record<string, string>;
  } = {},
): Promise<string> {
  const packagePath = path.join(workspace.root, "packages", packageName);

  if (options.tsconfig) {
    await workspace.write(`packages/${packageName}/tsconfig.json`, {
      compilerOptions: options.tsconfig,
    });
  }

  if (options.tsconfigBuild) {
    await workspace.write(`packages/${packageName}/tsconfig.build.json`, {
      compilerOptions: options.tsconfigBuild,
    });
  }

  if (options.files) {
    for (const [filename, content] of Object.entries(options.files)) {
      await workspace.write(`packages/${packageName}/${filename}`, content);
    }
  }

  return packagePath;
}
