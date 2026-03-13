import { Project, SourceFile } from "ts-morph";

export function createTSSourceFile(code: string): SourceFile {
  const project = new Project({ useInMemoryFileSystem: true });
  return project.createSourceFile("test.ts", code);
}
