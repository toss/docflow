import { ExportDeclaration } from "../../types/parser.types.js";
import { SourceFile } from "ts-morph";
import { getDeclarationKind } from "./get-declaration-kind.js";
import { getJSDoc } from "../jsdoc/jsdoc-utils.js";
import { extractSignature } from "./extract-signature.js";

export function getExportedDeclarationsBySourceFile(
  sourceFile: SourceFile,
): ExportDeclaration[] {
  const filePath = sourceFile.getFilePath();
  const exportedDeclarations = sourceFile.getExportedDeclarations();

  return Array.from(exportedDeclarations)
    .flatMap(([symbolName, declarations]) =>
      declarations.map((declaration) => {
        const kind = getDeclarationKind(declaration);
        const jsDoc = getJSDoc(declaration);
        const signature = extractSignature(declaration);

        if (!kind || !signature) {
          return null;
        }

        return {
          filePath,
          symbolName,
          declaration,
          kind,
          jsDoc,
          signature,
        };
      }),
    )
    .filter((item): item is ExportDeclaration => item !== null);
}
