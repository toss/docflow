import { SourceFile } from "ts-morph";

export function isExportSourceFile(sourceFile: SourceFile): boolean {
  return sourceFile.getExportedDeclarations().size > 0;
}
