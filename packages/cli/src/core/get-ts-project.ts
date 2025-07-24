import path from "path";
import { existsSync } from "fs";
import { Project } from "ts-morph";

export function getTsProject(tsconfigPath: string): Project {
  const resolvedPath = path.resolve(tsconfigPath);

  if (!existsSync(resolvedPath)) {
    throw new Error(`tsconfig.json not found at: ${resolvedPath}`);
  }

  const project = new Project({
    tsConfigFilePath: resolvedPath,
  });

  return project;
}
