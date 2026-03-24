import { groupBy } from "es-toolkit";
import { ExportDeclaration } from "../../types/parser.types.js";

export function excludeBarrelReExports(exportDeclarations: ExportDeclaration[]): ExportDeclaration[] {
  return Object.values(groupBy(exportDeclarations, exp => exp.symbolName))
    .flatMap(declarations => {
      if (declarations.length === 1) {
        return declarations;
      }

      const nonBarrelExports = declarations.filter(decl => !decl.filePath.endsWith("index.ts"));

      return nonBarrelExports.length > 0 ? nonBarrelExports : declarations.slice(0, 1);
    })
    .filter(decl => decl != null);
}
