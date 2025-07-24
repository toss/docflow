import { groupBy } from "es-toolkit";
import { ExportDeclaration } from "../../types/parser.types.js";

export function excludeBarrelReExports(
  exportDeclarations: ExportDeclaration[],
): ExportDeclaration[] {
  return Object.values(groupBy(exportDeclarations, (exp) => exp.symbolName))
    .map((declarations) => {
      if (declarations.length === 1) {
        return declarations[0];
      }

      const nonBarrelExports = declarations.filter(
        (decl) => !decl.filePath.endsWith("index.ts"),
      );

      return nonBarrelExports.length > 0
        ? nonBarrelExports[0]
        : declarations[0];
    })
    .filter((decl): decl is ExportDeclaration => decl !== undefined);
}
