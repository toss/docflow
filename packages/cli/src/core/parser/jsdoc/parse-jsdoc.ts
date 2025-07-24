import { JSDocParser } from "./jsdoc-parser.js";
import {
  ExportDeclaration,
  TargetWithJSDoc,
} from "../../types/parser.types.js";

export function parseJSDoc(
  exportDeclaration: ExportDeclaration,
  parser: JSDocParser,
): TargetWithJSDoc {
  const jsDocData = parser.parse(exportDeclaration.jsDoc);
  if (exportDeclaration.signature && !jsDocData.signature) {
    jsDocData.signature = exportDeclaration.signature;
  }

  return {
    ...exportDeclaration,
    parsedJSDoc: jsDocData,
  };
}
