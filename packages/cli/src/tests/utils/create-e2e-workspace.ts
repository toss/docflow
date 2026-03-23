import path from "path";
import { TestWorkspace, createTestWorkspace } from "./create-test-workspace.js";
import { execSync } from "child_process";
import { createCorePackage, createMathPackage, createUtilsPackage, createTypesPackage } from "./package-creators.js";
import { createDocflowConfig } from "./docflow-config.js";
import { getWorkingDirectory } from "../../utils/get-working-directory.js";

export type E2EWorkspace = TestWorkspace;

export async function createE2EWorkspace(options?: {
  installDependencies?: boolean;
  packageManager?: "yarn" | "pnpm" | "npm";
}): Promise<TestWorkspace> {
  const workspace = await createTestWorkspace();
  const root = path.resolve(getWorkingDirectory());
  const packageManager = options?.packageManager ?? "yarn";

  await workspace.write("tsconfig.json", {
    compilerOptions: {
      target: "ES2020",
      module: "ESNext",
      moduleResolution: "node",
      declaration: true,
      outDir: "./dist",
      rootDir: "./src",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
    },
    include: ["packages/*/src/**/*"],
    exclude: ["node_modules", "dist"],
  });

  const packageManagerField = (() => {
    switch (packageManager) {
      case "yarn":
        return "yarn@4.9.1";
      case "pnpm":
        return "pnpm@9.15.4";
      default:
        return undefined;
    }
  })();

  await workspace.write("package.json", {
    name: "test-workspace",
    version: "1.0.0",
    private: true,
    workspaces: ["packages/*"],
    ...(packageManagerField ? { packageManager: packageManagerField } : {}),
    devDependencies: {
      docflow: `file:${root}`,
      typescript: "^5.0.0",
    },
  });

  await workspace.write("yarn.lock", "");
  await workspace.write("docflow.config.js", createDocflowConfig());

  await createCorePackage(workspace);
  await createMathPackage(workspace);
  await createUtilsPackage(workspace);
  await createTypesPackage(workspace);

  if (options?.installDependencies) {
    execSync("yarn build", {
      cwd: root,
      stdio: "inherit",
    });

    execSync("yarn install", {
      cwd: workspace.root,
      stdio: "inherit",
    });
  }

  return workspace;
}
