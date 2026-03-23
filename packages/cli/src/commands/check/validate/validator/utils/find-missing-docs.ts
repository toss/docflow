import { difference } from "es-toolkit";
import { ValidationError } from "../../validate.types.js";

interface FindMissingDocsOptions {
  codeSymbols: string[];
  jsDocNames: string[];
  errorType: "missing_param" | "missing_property";
}

export function findMissingDocs({ codeSymbols, jsDocNames, errorType }: FindMissingDocsOptions): ValidationError[] {
  return difference(codeSymbols, jsDocNames).map(target => ({
    type: errorType,
    target,
  }));
}
